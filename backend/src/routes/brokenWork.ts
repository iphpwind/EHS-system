import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getBrokenWorkList, getBrokenWorkDetail,
  createBrokenWork, updateBrokenWork,
  submitBrokenWork, approveBrokenWork,
  startWork, finishWork, closeWork
} from '../controllers/brokenWorkController';

const router = Router();

router.get('/', authenticateToken, getBrokenWorkList);
router.get('/:id', authenticateToken, getBrokenWorkDetail);
// 培训合规：三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createBrokenWork);
router.put('/:id', authenticateToken, updateBrokenWork);
router.post('/:id/submit', authenticateToken, submitBrokenWork);
router.post('/:id/approve', authenticateToken, approveBrokenWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
