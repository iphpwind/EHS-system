import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { saveProgress, getProgress, getAnalysis, getTrainingList, getTrainingById, createTraining, updateTraining, deleteTraining, heartbeat } from '../controllers/trainingController';
import { downloadCertificatePDF } from '../controllers/training/certificateController';

const router = Router();

router.get('/analysis', authenticateToken, getAnalysis);
router.get('/progress', authenticateToken, getProgress);
router.post('/progress', authenticateToken, saveProgress);
router.post('/heartbeat', authenticateToken, heartbeat);
router.get('/', authenticateToken, getTrainingList);
router.get('/:id', authenticateToken, getTrainingById);
router.post('/', authenticateToken, createTraining);
router.put('/:id', authenticateToken, updateTraining);
router.delete('/:id', authenticateToken, deleteTraining);

// 证书下载（使用 Chrome 生成 PDF，需认证）
router.get('/certificate/download', authenticateToken, downloadCertificatePDF);

export default router;
