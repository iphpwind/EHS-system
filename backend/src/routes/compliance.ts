import { Router } from 'express';
import { getComplianceScores, triggerComplianceCalc } from '../controllers/complianceController';

const router = Router();

// 获取合规评分
router.get('/scores', getComplianceScores);

// 手动触发合规评分计算
router.post('/calculate', triggerComplianceCalc);

export default router;
