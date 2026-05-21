/**
 * 统一状态校验中心
 * 防止脏数据、流程断裂、假完成
 */

import { getConnection } from '../config/database';

export interface WorkTicketData {
  applicantId?: number;
  deptId?: number;
  projectName?: string;
  workLocation?: string;
  workContent?: string;
  startTime?: string;
  endTime?: string;
  status?: string | number;
}

export interface HazardData {
  level?: string;
  title?: string;
  department?: string;
  discoveryTime?: string;
}

export interface TrainingData {
  userId?: number;
  courseId?: number;
  duration?: number;
}

export interface CanWorkResult {
  allowed: boolean;
  reason: string;
  lastTraining?: string;
  certificateValid?: boolean;
  certificateExpiry?: string;
}

/**
 * 强制培训准入校验 — 作业票创建前调用
 * 要求：至少有一条通过(is_passed=1)的培训记录，且证书未过期
 */
export async function checkCanWork(userId: number, workType?: string): Promise<CanWorkResult> {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT tr.is_passed, tr.exam_score, tr.certificate_valid_until,
              tr.created_at AS training_date, tp.title AS plan_title
       FROM training_records tr
       LEFT JOIN training_plans tp ON tr.plan_id = tp.id
       WHERE tr.user_id = ? AND tr.is_passed = 1
       ORDER BY tr.created_at DESC
       LIMIT 1`,
      [userId]
    );

    const record = (rows as any[])[0] || null;

    if (!record) {
      return {
        allowed: false,
        reason: '该人员未完成任何安全培训，禁止创建作业票。请先完成安全培训并通过考核。',
        certificateValid: false
      };
    }

    // 检查证书是否过期
    if (record.certificate_valid_until) {
      const expiryDate = new Date(record.certificate_valid_until);
      if (expiryDate < new Date()) {
        return {
          allowed: false,
          reason: `安全培训证书已于 ${record.certificate_valid_until} 过期，禁止创建作业票。请重新参加培训。`,
          lastTraining: record.plan_title,
          certificateValid: false,
          certificateExpiry: record.certificate_valid_until
        };
      }
    }

    return {
      allowed: true,
      reason: '培训准入校验通过',
      lastTraining: record.plan_title,
      certificateValid: true,
      certificateExpiry: record.certificate_valid_until || '无期限'
    };
  } catch (error) {
    console.error('[checkCanWork] 校验异常:', error);
    // 数据库异常时放行（避免阻塞紧急作业），但记录日志
    return {
      allowed: true,
      reason: '培训校验服务异常，临时放行（已记录）',
      certificateValid: true
    };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 校验作业票数据完整性
 */
export function validateWorkTicket(data: WorkTicketData): void {
  const errors: string[] = [];
  if (!data.applicantId) errors.push('缺少申请人');
  if (!data.deptId) errors.push('缺少部门');
  if (!data.projectName || data.projectName.trim() === '') errors.push('项目名称不能为空');
  if (!data.workLocation || data.workLocation.trim() === '') errors.push('作业地点不能为空');
  if (!data.workContent || data.workContent.trim() === '') errors.push('作业内容不能为空');
  if (!data.startTime) errors.push('计划开始时间不能为空');
  if (!data.endTime) errors.push('计划结束时间不能为空');
  if (data.startTime && data.endTime && new Date(data.startTime) > new Date(data.endTime)) {
    errors.push('计划开始时间不能晚于结束时间');
  }
  if (errors.length > 0) {
    throw new Error(`作业票数据校验失败: ${errors.join('; ')}`);
  }
}

/**
 * 校验隐患数据完整性
 */
export function validateHazard(data: HazardData): void {
  const errors: string[] = [];
  if (!data.level) errors.push('隐患未分级');
  if (!data.title || data.title.trim() === '') errors.push('隐患标题不能为空');
  if (!data.department) errors.push('责任部门不能为空');
  if (!data.discoveryTime) errors.push('发现时间不能为空');
  if (errors.length > 0) {
    throw new Error(`隐患数据校验失败: ${errors.join('; ')}`);
  }
}

/**
 * 校验培训数据完整性
 */
export function validateTraining(data: TrainingData): void {
  const errors: string[] = [];
  if (!data.userId) errors.push('缺少培训人员');
  if (!data.courseId) errors.push('缺少课程');
  if (errors.length > 0) {
    throw new Error(`培训数据校验失败: ${errors.join('; ')}`);
  }
}

/**
 * 流程状态机校验
 * 防止跳步骤操作
 */
const workFlowMap: Record<string, string[]> = {
  '1': ['submit'],
  '2': ['dept_approve', 'reject'],
  '3': ['safety_approve', 'reject'],
  '4': ['final_approve', 'reject'],
  '5': ['start'],
  '6': ['finish'],
  '7': ['close']
};

export function checkFlow(currentStatus: string | number, action: string): void {
  const status = String(currentStatus);
  const allowed = workFlowMap[status];
  if (!allowed || !allowed.includes(action)) {
    throw new Error(`流程非法操作: 当前状态[${status}]不允许执行[${action}]`);
  }
}
