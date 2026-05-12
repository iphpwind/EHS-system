import { Router, Request, Response, NextFunction } from 'express';
import { generateQR, verifyQR } from '../controllers/qrController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * 生成二维码
 * POST /api/qr/generate
 */
router.post('/generate', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await generateQR(req, res, next);
  } catch (error) {
    console.error('Generate QR error:', error);
    next(error);
  }
});

/**
 * 核验二维码
 * POST /api/qr/verify
 */
router.post('/verify', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyQR(req, res, next);
  } catch (error) {
    console.error('Verify QR error:', error);
    next(error);
  }
});

export default router;
