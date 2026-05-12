import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
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

// 获取KPI指标
router.get('/kpi', authenticateToken, getKPI);

// 获取隐患趋势
router.get('/trend', authenticateToken, getTrend);

// 获取隐患等级分布
router.get('/level-distribution', authenticateToken, getLevelDistribution);

// 获取部门隐患排行
router.get('/department-ranking', authenticateToken, getDepartmentRanking);

// 获取待办事项
router.get('/pending-tasks', authenticateToken, getPendingTasks);

// 获取培训完成率
router.get('/training-rate', authenticateToken, getTrainingRate);

// 获取区域风险分布
router.get('/area-risk', authenticateToken, getAreaRiskDistribution);

export default router;
