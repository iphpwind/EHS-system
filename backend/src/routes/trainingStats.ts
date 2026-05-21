import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getTrainingStats,
  getDeptTrainingStats,
  getTrainingCompliance,
  getTrainingTasks,
  getCompletionTrend,
  getTrainingTypeDistribution,
  getTrainingLeaderboard
} from '../controllers/trainingStatsController';

const router = Router();

// 培训统计概览
router.get('/stats', authenticateToken, getTrainingStats);

// 部门培训统计
router.get('/stats/dept', authenticateToken, getDeptTrainingStats);

// 培训合规率
router.get('/stats/compliance', authenticateToken, getTrainingCompliance);

// 培训待办任务
router.get('/stats/tasks', authenticateToken, getTrainingTasks);

// 培训完成率趋势
router.get('/stats/trend', authenticateToken, getCompletionTrend);

// 培训类型分布
router.get('/stats/types', authenticateToken, getTrainingTypeDistribution);

// 培训排行榜
router.get('/stats/leaderboard', authenticateToken, getTrainingLeaderboard);

export default router;