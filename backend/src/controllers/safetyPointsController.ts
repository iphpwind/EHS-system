/**
 * 安全积分 - 查询API
 */

import { Request, Response, NextFunction } from 'express';
import { getUserPoints, getPointsRanking, awardPoints } from '../services/safetyPointsService';

/**
 * 获取用户积分明细
 * GET /api/safety-points/:userId
 */
export const getUserPointsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId) || (req as any).user?.userId;
    const data = await getUserPoints(userId);
    res.json({ code: 200, msg: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * 获取积分排行榜
 * GET /api/safety-points/ranking?limit=20
 */
export const getRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const data = await getPointsRanking(limit);
    res.json({ code: 200, msg: 'success', data });
  } catch (error) {
    next(error);
  }
};

/**
 * 手动奖励积分（管理员操作）
 * POST /api/safety-points/award
 */
export const manualAward = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, userName, ruleCode, relatedEntity, relatedId } = req.body;
    if (!userId || !ruleCode) {
      return res.status(400).json({ code: 400, msg: '缺少参数 userId 或 ruleCode' });
    }
    const result = await awardPoints(userId, userName || '', ruleCode, relatedEntity || '', relatedId || null);
    res.json({ code: 200, msg: result.message, data: result });
  } catch (error) {
    next(error);
  }
};
