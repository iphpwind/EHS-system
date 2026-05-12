import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getHoistingWorkList, getHoistingWorkDetail,
  createHoistingWork, updateHoistingWork,
  submitHoistingWork, approveHoistingWork,
  startWork, finishWork, closeWork
} from '../controllers/hoistingWorkController';

const router = Router();

router.get('/', authenticateToken, getHoistingWorkList);
router.get('/:id', authenticateToken, getHoistingWorkDetail);
router.post('/', authenticateToken, createHoistingWork);
router.put('/:id', authenticateToken, updateHoistingWork);
router.post('/:id/submit', authenticateToken, submitHoistingWork);
router.post('/:id/approve', authenticateToken, approveHoistingWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
