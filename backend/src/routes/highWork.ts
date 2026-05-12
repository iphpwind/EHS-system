import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getHighWorkList, getHighWorkDetail,
  createHighWork, updateHighWork,
  submitHighWork, approveHighWork,
  startWork, finishWork, closeWork
} from '../controllers/highWorkController';

const router = Router();

router.get('/', authenticateToken, getHighWorkList);
router.get('/:id', authenticateToken, getHighWorkDetail);
router.post('/', authenticateToken, createHighWork);
router.put('/:id', authenticateToken, updateHighWork);
router.post('/:id/submit', authenticateToken, submitHighWork);
router.post('/:id/approve', authenticateToken, approveHighWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
