import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getBlindWorkList, getBlindWorkDetail,
  createBlindWork, updateBlindWork,
  submitBlindWork, approveBlindWork,
  startWork, finishWork, closeWork
} from '../controllers/blindWorkController';

const router = Router();

router.get('/', authenticateToken, getBlindWorkList);
router.get('/:id', authenticateToken, getBlindWorkDetail);
// 培训合规：高危作业需三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createBlindWork);
router.put('/:id', authenticateToken, updateBlindWork);
router.post('/:id/submit', authenticateToken, submitBlindWork);
router.post('/:id/approve', authenticateToken, approveBlindWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
