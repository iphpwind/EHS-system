/**
 * 三级安全教育服务（化工企业合规版）
 *
 * 学时换算：45分钟 = 1学时（应急管理部认可标准）
 * 化工企业危险化学品从业人员标准：72学时（厂级24+车间级24+班组级24）
 *
 * 触发场景：
 * 1. 新员工入职 → autoAssignThreeLevelEducation()
 * 2. 三同时项目立项 → autoAssignThreeLevelEducation(userId, projectId)
 * 3. 课程学习完成 → recordThreeLevelProgress()
 * 4. 作业票申请前校验 → checkThreeLevelCompleted()
 */

import { getConnection } from '../config/database';
import { logger } from '../utils/logger';

/** 学时标准：45分钟 = 1学时 */
const MINUTES_PER_CREDIT = 45;

/** 化工企业标准学时配置 */
interface LevelConfig {
  level: 'factory' | 'workshop' | 'team';
  label: string;
  requiredHours: number;
}

export const THREE_LEVEL_CONFIG: LevelConfig[] = [
  { level: 'factory', label: '厂级安全教育（一级）', requiredHours: 24 },
  { level: 'workshop', label: '车间级安全教育（二级）', requiredHours: 24 },
  { level: 'team', label: '班组级安全教育（三级）', requiredHours: 24 },
];

/** 总计72学时 */
export const TOTAL_REQUIRED_HOURS = THREE_LEVEL_CONFIG.reduce((sum, c) => sum + c.requiredHours, 0);

/**
 * 计算学时（45分钟 = 1学时）
 */
export function calculateCreditHours(minutes: number): number {
  return Math.floor(minutes / MINUTES_PER_CREDIT);
}

/**
 * 分钟转学时的格式化显示
 */
export function formatCreditHours(minutes: number): string {
  const hours = calculateCreditHours(minutes);
  const remainingMinutes = minutes % MINUTES_PER_CREDIT;
  if (hours === 0) return `${minutes} 分钟`;
  if (remainingMinutes === 0) return `${hours} 学时`;
  return `${hours} 学时 ${remainingMinutes} 分钟`;
}

/**
 * 自动为新员工分配三级安全教育任务
 */
export async function autoAssignThreeLevelEducation(
  userId: number,
  departmentId?: number,
  projectId?: number
): Promise<{ assigned: boolean; recordId?: number; plans?: number[] }> {
  const conn = await getConnection();
  await conn.beginTransaction();

  try {
    // 1. 确保人员记录存在
    const [existing] = await conn.execute(
      `SELECT id FROM three_level_education_records WHERE user_id = ?`,
      [userId]
    );

    let recordId: number;
    if ((existing as any[]).length === 0) {
      const [result] = await conn.execute(
        `INSERT INTO three_level_education_records 
         (user_id, project_id, factory_hours, workshop_hours, team_hours, status) 
         VALUES (?, ?, 0, 0, 0, 'pending')`,
        [userId, projectId || null]
      );
      recordId = (result as any).insertId;
    } else {
      recordId = (existing as any[])[0].id;
    }

    // 2. 获取默认模板
    const [templates] = await conn.execute(
      `SELECT * FROM three_level_templates WHERE is_default = 1 ORDER BY sort_order`
    );

    // 3. 为每级创建培训计划
    const planIds: number[] = [];
    for (const tpl of templates as any[]) {
      const [planResult] = await conn.execute(
        `INSERT INTO training_plans 
         (plan_no, title, type, category, target_users, status, start_date, end_date, created_at, updated_at)
         VALUES (?, ?, 'three_level', ?, ?, 'active', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 MONTH), NOW(), NOW())`,
        [
          `TL${Date.now()}${Math.floor(Math.random() * 1000)}`,
          `${tpl.name}——用户ID${userId}`,
          tpl.level,
          JSON.stringify([userId]),
        ]
      );
      planIds.push((planResult as any).insertId);
    }

    await conn.commit();

    logger.info(`[ThreeLevelEdu] 已为 userId=${userId} 分配三级安全教育（72学时）`, {
      userId,
      plans: planIds,
      projectId,
    });

    return { assigned: true, recordId, plans: planIds };

  } catch (error) {
    await conn.rollback();
    logger.error('[ThreeLevelEdu] 分配三级安全教育失败', { error, userId });
    throw error;
  }
}

/**
 * 课程学习完成后自动累加三级教育学时
 * 根据课程所属级别自动累加到对应字段
 */
export async function recordThreeLevelProgress(
  userId: number,
  courseId: number,
  creditHours: number,
  learningMinutes: number
): Promise<void> {
  try {
    const conn = await getConnection();

    // 1. 确保人员记录存在
    const [existing] = await conn.execute(
      `SELECT id FROM three_level_education_records WHERE user_id = ?`,
      [userId]
    );

    if ((existing as any[]).length === 0) {
      // 人员记录不存在，自动创建
      const [result] = await conn.execute(
        `INSERT INTO three_level_education_records (user_id, status) VALUES (?, 'in_progress')`,
        [userId]
      );
      logger.info(`[ThreeLevelEdu] 自动创建三级教育记录 userId=${userId}`);
    }

    // 2. 判断课程属于哪个级别
    const level = await getCourseLevel(courseId);

    let field = '';
    if (level === 'factory') field = 'factory_hours';
    else if (level === 'workshop') field = 'workshop_hours';
    else if (level === 'team') field = 'team_hours';

    if (field) {
      await conn.execute(
        `UPDATE three_level_education_records 
         SET ${field} = ${field} + ?, status = 'in_progress', updated_at = NOW() 
         WHERE user_id = ?`,
        [creditHours, userId]
      );
    }

    // 3. 同时更新 training_records 的学时累计
    await conn.execute(
      `UPDATE training_records 
       SET learning_minutes = COALESCE(learning_minutes, 0) + ?,
           credit_hours = COALESCE(credit_hours, 0) + ?
       WHERE user_id = ? AND plan_id IN (
         SELECT id FROM training_plans WHERE id = (SELECT plan_id FROM training_records WHERE user_id = ? LIMIT 1)
       )`,
      [learningMinutes, creditHours, userId]
    );

    // 4. 检查是否全部完成
    await checkThreeLevelCompletion(userId);

    logger.info(`[ThreeLevelEdu] 学时更新 userId=${userId} level=${field || 'unknown'} +${creditHours}学时`);

  } catch (error) {
    logger.error('[ThreeLevelEdu] 记录三级教育学时失败', { error, userId, courseId });
  }
}

/**
 * 判断课程所属的三级教育级别
 */
async function getCourseLevel(courseId: number): Promise<'factory' | 'workshop' | 'team' | null> {
  try {
    const conn = await getConnection();

    // 1. 从 course_categories 判断
    const [cats] = await conn.execute(
      `SELECT cc.name as cat_name 
       FROM training_courses c
       LEFT JOIN course_categories cc ON c.category_id = cc.id
       WHERE c.id = ?`,
      [courseId]
    );

    const catName = ((cats as any[])[0]?.cat_name || '').toLowerCase();

    if (catName.includes('厂级') || catName.includes('一级') || catName.includes('法律法规')) return 'factory';
    if (catName.includes('车间') || catName.includes('二级') || catName.includes('工艺')) return 'workshop';
    if (catName.includes('班组') || catName.includes('三级') || catName.includes('岗位')) return 'team';

    // 2. 从课程模板关联判断
    const [tpls] = await conn.execute(
      `SELECT level FROM three_level_templates WHERE JSON_CONTAINS(course_ids, ?)`,
      [JSON.stringify(courseId)]
    );

    if ((tpls as any[]).length > 0) return (tpls as any[])[0].level;

    return null;
  } catch (error) {
    logger.error('[ThreeLevelEdu] 判断课程级别失败', { error, courseId });
    return null;
  }
}

/**
 * 检查三级教育是否全部完成（每级≥24学时）
 */
export async function checkThreeLevelCompletion(userId: number): Promise<{
  completed: boolean;
  factory: number;
  workshop: number;
  team: number;
  total: number;
}> {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT 
        factory_hours, workshop_hours, team_hours, total_hours, status
       FROM three_level_education_records 
       WHERE user_id = ?`,
      [userId]
    );

    const record = (rows as any[])[0];
    if (!record) {
      return { completed: false, factory: 0, workshop: 0, team: 0, total: 0 };
    }

    const factory = Number(record.factory_hours) || 0;
    const workshop = Number(record.workshop_hours) || 0;
    const team = Number(record.team_hours) || 0;
    const total = Number(record.total_hours) || factory + workshop + team;

    const factoryDone = factory >= 24;
    const workshopDone = workshop >= 24;
    const teamDone = team >= 24;
    const allDone = factoryDone && workshopDone && teamDone;

    if (allDone && record.status !== 'completed') {
      await conn.execute(
        `UPDATE three_level_education_records 
         SET status = 'completed', completed_at = NOW() 
         WHERE user_id = ?`,
        [userId]
      );
      logger.info(`[ThreeLevelEdu] ✅ 三级教育全部完成 userId=${userId} total=${total}学时`);
    }

    return { completed: allDone, factory, workshop, team, total };

  } catch (error) {
    logger.error('[ThreeLevelEdu] 检查三级教育完成状态失败', { error, userId });
    return { completed: false, factory: 0, workshop: 0, team: 0, total: 0 };
  }
}

/**
 * 获取三级教育模板列表
 */
export async function getThreeLevelTemplates(): Promise<any[]> {
  const conn = await getConnection();
  const [rows] = await conn.execute(
    `SELECT * FROM three_level_templates ORDER BY sort_order ASC`
  );
  return (rows as any[]).map((r: any) => ({
    ...r,
    levelText: r.level === 'factory' ? '厂级（一级）' : r.level === 'workshop' ? '车间级（二级）' : '班组级（三级）',
  }));
}

/**
 * 年度学时统计（化工企业合规：危险化学品从业人员≥20学时/年）
 */
export async function getAnnualCreditReport(
  year: number,
  departmentId?: number,
  minRequiredHours: number = 20
): Promise<any[]> {
  const conn = await getConnection();

  let sql = `
    SELECT 
      u.id as userId,
      u.real_name as userName,
      u.department as deptName,
      d.name as deptName2,
      COALESCE(SUM(tr.credit_hours), 0) as totalHours,
      COALESCE(SUM(tr.learning_minutes), 0) as totalMinutes,
      COUNT(DISTINCT tr.plan_id) as planCount,
      MAX(tr.updated_at) as lastLearnDate,
      CASE WHEN COALESCE(SUM(tr.credit_hours), 0) >= ${minRequiredHours} THEN '达标' ELSE '未达标' END as status
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.id
    LEFT JOIN training_records tr ON u.id = tr.user_id 
      AND YEAR(COALESCE(tr.updated_at, tr.created_at)) = ?
    WHERE u.status = 'active' OR u.status = 1
  `;
  const params: any[] = [year];

  if (departmentId) {
    sql += ' AND u.department_id = ?';
    params.push(departmentId);
  }

  sql += ' GROUP BY u.id, u.real_name, u.department, d.name ORDER BY totalHours DESC';

  const [rows] = await conn.execute(sql, params);
  return rows as any[];
}

export default {
  calculateCreditHours,
  formatCreditHours,
  autoAssignThreeLevelEducation,
  recordThreeLevelProgress,
  checkThreeLevelCompletion,
  getThreeLevelTemplates,
  getAnnualCreditReport,
  THREE_LEVEL_CONFIG,
  TOTAL_REQUIRED_HOURS,
};
