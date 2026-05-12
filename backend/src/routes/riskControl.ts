import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getRiskPoints,
  getRiskStats,
  getRiskDistribution,
  createRiskPoint,
  updateRiskPoint,
  deleteRiskPoint,
  getInspectionList
} from '../controllers/riskControlController';

const router = Router();

// 风险点
router.get('/risk-points', authenticateToken, getRiskPoints);
router.get('/risk-points/stats', authenticateToken, getRiskStats);
router.get('/risk-points/distribution', authenticateToken, getRiskDistribution);
router.post('/risk-points', authenticateToken, createRiskPoint);
router.put('/risk-points/:id', authenticateToken, updateRiskPoint);
router.delete('/risk-points/:id', authenticateToken, deleteRiskPoint);
// 隐患排查
router.get('/inspection-plans', authenticateToken, getInspectionList);

export default router;
