import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getTrainingRecords, getTrainingRecordById, createTrainingRecord, updateTrainingRecord, deleteTrainingRecord } from '../controllers/trainingRecordsController';

const router = Router();

router.get('/', authenticateToken, getTrainingRecords);
router.get('/:id', authenticateToken, getTrainingRecordById);
router.post('/', authenticateToken, createTrainingRecord);
router.put('/:id', authenticateToken, updateTrainingRecord);
router.delete('/:id', authenticateToken, deleteTrainingRecord);

export default router;
