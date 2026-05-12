import { Router } from 'express';
import { getUserPointsHandler, getRanking, manualAward } from '../controllers/safetyPointsController';

const router = Router();

// 积分排行榜
router.get('/ranking', getRanking);

// 获取指定用户积分
router.get('/:userId', getUserPointsHandler);

// 管理员手动奖励积分
router.post('/award', manualAward);

export default router;
