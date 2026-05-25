import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { dashboardCache } from '../middleware/dashboardCache';
import {
  getKPI,
  getTrend,
  getLevelDistribution,
  getDepartmentRanking,
  getPendingTasks,
  getTrainingRate,
  getAreaRiskDistribution
} from '../controllers/dashboardController';

const router = Router();

// 获取KPI指标（缓存25秒）
router.get('/kpi', authenticateToken, dashboardCache(25), getKPI);

// 获取隐患趋势（缓存60秒）
router.get('/trend', authenticateToken, dashboardCache(60), getTrend);

// 获取隐患等级分布（缓存300秒 = 5分钟）
router.get('/level-distribution', authenticateToken, dashboardCache(300), getLevelDistribution);

// 获取部门隐患排行（缓存60秒）
router.get('/department-ranking', authenticateToken, dashboardCache(60), getDepartmentRanking);

// 获取待办事项（缓存25秒）
router.get('/pending-tasks', authenticateToken, dashboardCache(25), getPendingTasks);

// 获取培训完成率（缓存300秒 = 5分钟）
router.get('/training-rate', authenticateToken, dashboardCache(300), getTrainingRate);

// 获取区域风险分布（缓存300秒 = 5分钟）
router.get('/area-risk', authenticateToken, dashboardCache(300), getAreaRiskDistribution);

export default router;
