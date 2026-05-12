import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { saveSignature, getSignatures, getSignatureImage } from '../controllers/signatureController';

const router = Router();

router.post('/', authenticateToken, saveSignature);
router.get('/', authenticateToken, getSignatures);
router.get('/image/:filename', getSignatureImage); // 图片无需认证（方便PDF生成）

export default router;
