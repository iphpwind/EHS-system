import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getConfinedSpaceList, getConfinedSpaceDetail,
  createConfinedSpace, updateConfinedSpace,
  submitConfinedSpace, approveConfinedSpace,
  startWork, finishWork, closeWork
} from '../controllers/confinedSpaceController';

const router = Router();

router.get('/', authenticateToken, getConfinedSpaceList);
router.get('/:id', authenticateToken, getConfinedSpaceDetail);
router.post('/', authenticateToken, createConfinedSpace);
router.put('/:id', authenticateToken, updateConfinedSpace);
router.post('/:id/submit', authenticateToken, submitConfinedSpace);
router.post('/:id/approve', authenticateToken, approveConfinedSpace);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
