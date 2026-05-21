import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getRiskPoints,
  getRiskPointById,
  createRiskPoint,
  updateRiskPoint,
  deleteRiskPoint,
  getRiskStats,
  getRiskDistribution,
  getRiskMatrix,
  getMajorRisks
} from '../controllers/riskV2Controller';

const router = Router();

// 风险点管理
router.get('/', authenticateToken, getRiskPoints);
router.get('/:id', authenticateToken, getRiskPointById);
router.post('/', authenticateToken, createRiskPoint);
router.put('/:id', authenticateToken, updateRiskPoint);
router.delete('/:id', authenticateToken, deleteRiskPoint);

// 风险可视化统计
router.get('/stats/overview', authenticateToken, getRiskStats);
router.get('/stats/distribution', authenticateToken, getRiskDistribution);
router.get('/stats/matrix', authenticateToken, getRiskMatrix);
router.get('/stats/major', authenticateToken, getMajorRisks);

export default router;