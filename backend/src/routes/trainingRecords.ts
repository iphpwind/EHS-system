import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getTrainingRecords, getTrainingRecordById, createTrainingRecord, updateTrainingRecord, deleteTrainingRecord } from '../controllers/trainingRecordsController';

const router = Router();

// ===== 培训记录管理 =====
router.get('/training-records', authenticateToken, getTrainingRecords);
router.get('/training-records/:id', authenticateToken, getTrainingRecordById);
router.post('/training-records', authenticateToken, createTrainingRecord);
router.put('/training-records/:id', authenticateToken, updateTrainingRecord);
router.delete('/training-records/:id', authenticateToken, deleteTrainingRecord);

export default router;