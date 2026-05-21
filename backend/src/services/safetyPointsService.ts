/**
 * 安全积分规则引擎
 * 积分规则：隐患上报+5、完成培训+10、按时审批+2、安全作业完成+3、违规-20
 */

import { getConnection } from '../config/database';

/**
 * 为用户增加/减少积分
 * @param userId 用户ID
 * @param ruleCode 积分规则编码
 * @param relatedEntity 关联实体类型
 * @param relatedId 关联实体ID
 * @returns 变更后积分余额
 */
export async function awardPoints(
  userId: number,
  userName: string,
  ruleCode: string,
  relatedEntity: string = '',
  relatedId: number | null = null
): Promise<{ pointsChange: number; balance: number; message: string }> {
  let conn: any = null;
  try {
    conn = await getConnection();

    // 查询规则
    const [rules] = await conn.execute(
      'SELECT * FROM safety_point_rules WHERE rule_code = ? AND enabled = 1',
      [ruleCode]
    );
    const rule = (rules as any[])[0];
    if (!rule) {
      return { pointsChange: 0, balance: 0, message: `积分规则[${ruleCode}]不存在或已禁用` };
    }

    // 检查每日上限
    if (rule.daily_limit > 0) {
      const [dailyTotal] = await conn.execute(
        `SELECT COALESCE(SUM(points_change), 0) as total FROM safety_points
         WHERE user_id = ? AND type = ? AND DATE(created_at) = CURDATE()`,
        [userId, rule.type]
      );
      const today = (dailyTotal as any[])[0]?.total || 0;
      if (today + rule.points > rule.daily_limit && rule.points > 0) {
        return { pointsChange: 0, balance: 0, message: `已达到每日上限${rule.daily_limit}分` };
      }
    }

    // 查询当前余额
    const [balanceRows] = await conn.execute(
      `SELECT COALESCE(SUM(points_change), 0) as balance FROM safety_points WHERE user_id = ?`,
      [userId]
    );
    const currentBalance = (balanceRows as any[])[0]?.balance || 0;
    const newBalance = currentBalance + rule.points;

    // 写入积分记录
    await conn.execute(
      `INSERT INTO safety_points (user_id, user_name, points_change, balance_after, reason, type, type_label, related_entity, related_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, userName, rule.points, newBalance, rule.rule_name, rule.type, rule.description, relatedEntity, relatedId]
    );

    return {
      pointsChange: rule.points,
      balance: newBalance,
      message: `${rule.description}，${rule.points >= 0 ? '+' : ''}${rule.points}分`
    };
  } catch (error) {
    console.error('[SafetyPointsService] 积分操作失败:', error);
    return { pointsChange: 0, balance: 0, message: '积分操作异常' };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 获取用户积分信息
 */
export async function getUserPoints(userId: number) {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [balance] = await conn.execute(
      'SELECT COALESCE(SUM(points_change), 0) as balance FROM safety_points WHERE user_id = ?',
      [userId]
    );
    const [records] = await conn.execute(
      'SELECT * FROM safety_points WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId]
    );
    return {
      balance: (balance as any[])[0]?.balance || 0,
      records: records as any[]
    };
  } catch (error) {
    console.error('[SafetyPointsService] 查询失败:', error);
    return { balance: 0, records: [] };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 获取积分排行榜
 */
export async function getPointsRanking(limit: number = 20) {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT user_id, user_name, COALESCE(SUM(points_change), 0) as total_points
       FROM safety_points
       GROUP BY user_id, user_name
       ORDER BY total_points DESC
       LIMIT ?`,
      [String(limit)]
    );
    return rows as any[];
  } catch (error) {
    console.error('[SafetyPointsService] 排行榜查询失败:', error);
    return [];
  } finally {
    if (conn) conn.release();
  }
}
