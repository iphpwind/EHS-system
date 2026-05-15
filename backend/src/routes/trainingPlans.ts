import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getTrainingList, getTrainingById, createTraining, updateTraining, deleteTraining } from '../controllers/trainingController';

const router = Router();

// ===== 培训计划管理 =====
router.get('/plans', authenticateToken, getTrainingList);
router.get('/plans/:id', authenticateToken, getTrainingById);
router.post('/plans', authenticateToken, createTraining);
router.put('/plans/:id', authenticateToken, updateTraining);
router.delete('/plans/:id', authenticateToken, deleteTraining);

export default router;