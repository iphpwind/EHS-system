import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getBlindWorkList, getBlindWorkDetail,
  createBlindWork, updateBlindWork,
  submitBlindWork, approveBlindWork,
  startWork, finishWork, closeWork
} from '../controllers/blindWorkController';

const router = Router();

router.get('/', authenticateToken, getBlindWorkList);
router.get('/:id', authenticateToken, getBlindWorkDetail);
router.post('/', authenticateToken, createBlindWork);
router.put('/:id', authenticateToken, updateBlindWork);
router.post('/:id/submit', authenticateToken, submitBlindWork);
router.post('/:id/approve', authenticateToken, approveBlindWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
