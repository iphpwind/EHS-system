/**
 * 合规评分服务
 * 多维度评分：作业票合规率、隐患整改率、培训完成率
 */

import { getConnection } from '../config/database';

export interface ComplianceScore {
  dimension: string;
  dimensionLabel: string;
  score: number;
  totalItems: number;
  passedItems: number;
}

/**
 * 计算组织/个人的合规评分
 * @param orgId 组织ID
 * @param userId 用户ID(可选，null则计算组织级)
 * @param period 周期: day/week/month/quarter/year
 */
export async function calculateCompliance(
  orgId: number = 1,
  userId: number | null = null,
  period: string = 'month'
): Promise<ComplianceScore[]> {
  const conn = await getConnection();
  const scores: ComplianceScore[] = [];

  try {
    // 计算周期范围
    const { startDate, endDate } = getPeriodRange(period);
    const deptFilter = userId ? ' AND wp.applicant_id = ?' : '';
    const params: any[] = [startDate, endDate];
    if (userId) params.push(userId);

    // 1. 作业票合规率
    const [ticketRows] = await conn.execute(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status IN ('7','8') AND actual_end_time IS NOT NULL THEN 1 ELSE 0 END) as passed
       FROM work_permits wp
       WHERE wp.created_at >= ? AND wp.created_at <= ? ${deptFilter}`,
      params
    );
    const ticketStats = (ticketRows as any[])[0] || { total: 0, passed: 0 };
    scores.push({
      dimension: 'work_compliance',
      dimensionLabel: '作业票合规率',
      score: ticketStats.total > 0 ? Math.round((ticketStats.passed / ticketStats.total) * 10000) / 100 : 100,
      totalItems: ticketStats.total,
      passedItems: ticketStats.passed
    });

    // 2. 隐患整改率
    const hazardParams: any[] = [startDate, endDate, orgId];
    if (userId) hazardParams.push(userId);
    const hazFilter = userId ? ' AND discoverer_id = ?' : ' AND org_id = ?';
    const [hazardRows] = await conn.execute(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 4 OR status = 'closed' THEN 1 ELSE 0 END) as passed
       FROM hazard_inspection
       WHERE discovery_time >= ? AND discovery_time <= ? ${hazFilter}`,
      hazardParams
    );
    const hazardStats = (hazardRows as any[])[0] || { total: 0, passed: 0 };
    scores.push({
      dimension: 'hazard_closure',
      dimensionLabel: '隐患整改率',
      score: hazardStats.total > 0 ? Math.round((hazardStats.passed / hazardStats.total) * 10000) / 100 : 100,
      totalItems: hazardStats.total,
      passedItems: hazardStats.passed
    });

    // 3. 培训完成率
    const trainingParams: any[] = [startDate, endDate];
    if (userId) trainingParams.push(userId);
    const trFilter = userId ? ' AND tr.user_id = ?' : '';
    const [trainingRows] = await conn.execute(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN tr.is_passed = 1 THEN 1 ELSE 0 END) as passed
       FROM training_records tr
       WHERE tr.created_at >= ? AND tr.created_at <= ? ${trFilter}`,
      trainingParams
    );
    const trainingStats = (trainingRows as any[])[0] || { total: 0, passed: 0 };
    scores.push({
      dimension: 'training_rate',
      dimensionLabel: '培训完成率',
      score: trainingStats.total > 0 ? Math.round((trainingStats.passed / trainingStats.total) * 10000) / 100 : 100,
      totalItems: trainingStats.total,
      passedItems: trainingStats.passed
    });

    // 保存评分记录
    for (const s of scores) {
      await conn.execute(
        `INSERT INTO compliance_scores (org_id, user_id, dimension, dimension_label, score, total_items, passed_items, period, period_start, period_end)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orgId, userId || null, s.dimension, s.dimensionLabel, s.score, s.totalItems, s.passedItems, period, startDate, endDate]
      );
    }

  } catch (error) {
    console.error('[ComplianceService] 计算失败:', error);
  }

  return scores;
}

function getPeriodRange(period: string): { startDate: string; endDate: string } {
  const now = new Date();
  const end = now.toISOString().split('T')[0];
  let start = end;

  const d = new Date(now);
  switch (period) {
    case 'day': d.setDate(d.getDate() - 1); break;
    case 'week': d.setDate(d.getDate() - 7); break;
    case 'month': d.setMonth(d.getMonth() - 1); break;
    case 'quarter': d.setMonth(d.getMonth() - 3); break;
    case 'year': d.setFullYear(d.getFullYear() - 1); break;
    default: d.setMonth(d.getMonth() - 1);
  }
  start = d.toISOString().split('T')[0];

  return { startDate: start, endDate: end };
}
