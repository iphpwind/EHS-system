/**
 * 操作回放审计链 - 快照记录器
 * 记录每次作业票状态变更的完整快照，用于审计回放
 */

import { getConnection } from '../config/database';
import { Request } from 'express';

export interface TraceRecord {
  entity_type: string;
  entity_id: number;
  entity_no?: string;
  action: string;
  action_label?: string;
  operator_id: number;
  operator_name?: string;
  operator_ip?: string;
  snapshot_before?: any;
  snapshot_after?: any;
  remarks?: string;
}

/**
 * 记录操作快照到 operation_traces 表
 * @param params 快照参数
 */
export async function recordTrace(params: TraceRecord): Promise<void> {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute(
      `INSERT INTO operation_traces 
       (entity_type, entity_id, entity_no, action, action_label, 
        operator_id, operator_name, operator_ip,
        snapshot_before, snapshot_after, remarks)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        params.entity_type,
        params.entity_id,
        params.entity_no || '',
        params.action,
        params.action_label || actionLabelMap(params.action),
        params.operator_id,
        params.operator_name || '',
        params.operator_ip || '',
        params.snapshot_before ? JSON.stringify(params.snapshot_before) : null,
        params.snapshot_after ? JSON.stringify(params.snapshot_after) : null,
        params.remarks || ''
      ]
    );
    console.log(`[TRACE] ${params.entity_type}#${params.entity_id} ${params.action} by user#${params.operator_id}`);
  } catch (error) {
    console.error('[TRACE] 操作快照记录失败:', error);
    // 不阻断业务流程
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 从 Express Request 提取操作上下文
 */
export function extractOperatorInfo(req: Request) {
  const auth = (req as any).user || {};
  return {
    userId: auth.userId || auth.id || 0,
    userName: auth.realName || auth.username || auth.userName || '未知',
    ip: req.ip || req.socket.remoteAddress || ''
  };
}

function actionLabelMap(action: string): string {
  const map: Record<string, string> = {
    create: '创建作业票',
    update: '更新作业票',
    submit: '提交审批',
    dept_approve: '部门审批通过',
    safety_approve: '安全审批通过',
    final_approve: '最终批准',
    reject: '驳回',
    start_work: '开始作业',
    finish_work: '完成作业',
    close: '归档关闭',
    delete: '删除作业票',
    gas_check: '气体检测',
    revoke: '撤回'
  };
  return map[action] || action;
}

/**
 * 提取当前作业票的状态快照（用于 before/after 对比）
 */
export async function getWorkPermitSnapshot(ticketId: number): Promise<any> {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT * FROM work_permits WHERE id = ?`,
      [ticketId]
    );
    return (rows as any[])[0] || null;
  } catch {
    return null;
  } finally {
    if (conn) conn.release();
  }
}
