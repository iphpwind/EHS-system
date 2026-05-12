import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { exportHotWorkPDF } from '../controllers/pdfController';

const router = Router();

router.get('/hot-work/:id', authenticateToken, exportHotWorkPDF);

export default router;
