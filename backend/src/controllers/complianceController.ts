/**
 * 合规评分 - 查询API
 */

import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';
import { calculateCompliance } from '../services/complianceService';

/**
 * 获取合规评分
 * GET /api/compliance/scores?period=month
 */
export const getComplianceScores = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.query;
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM compliance_scores
       WHERE period = ? AND user_id IS NULL
       ORDER BY created_at DESC LIMIT 10`,
      [period as string]
    );
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  }
};

/**
 * 手动触发合规评分计算
 * POST /api/compliance/calculate
 */
export const triggerComplianceCalc = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { period = 'month' } = req.body;
    const scores = await calculateCompliance(1, null, period as string);
    res.json({ code: 200, msg: '合规评分计算完成', data: scores });
  } catch (error) {
    next(error);
  }
};
