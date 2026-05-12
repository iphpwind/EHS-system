import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  hazardReport,
  workPermitReport,
  trainingReport,
  riskTips,
  fullDashboard
} from '../controllers/reportController';

const router = Router();

/**
 * 隐患统计报表
 * GET /api/reports/hazard
 */
router.get('/hazard', authenticateToken, hazardReport);

/**
 * 作业票统计报表
 * GET /api/reports/work-permits
 */
router.get('/work-permits', authenticateToken, workPermitReport);

/**
 * 培训统计报表
 * GET /api/reports/training
 */
router.get('/training', authenticateToken, trainingReport);

/**
 * 风险智能提示
 * GET /api/reports/risk-tips
 */
router.get('/risk-tips', authenticateToken, riskTips);

/**
 * 综合 Dashboard 数据
 * GET /api/reports/dashboard-full
 */
router.get('/dashboard-full', authenticateToken, fullDashboard);

export default router;
