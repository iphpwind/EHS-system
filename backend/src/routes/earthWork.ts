import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getEarthWorkList, getEarthWorkDetail,
  createEarthWork, updateEarthWork,
  submitEarthWork, approveEarthWork,
  startWork, finishWork, closeWork
} from '../controllers/earthWorkController';

const router = Router();

router.get('/', authenticateToken, getEarthWorkList);
router.get('/:id', authenticateToken, getEarthWorkDetail);
// 培训合规：三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createEarthWork);
router.put('/:id', authenticateToken, updateEarthWork);
router.post('/:id/submit', authenticateToken, submitEarthWork);
router.post('/:id/approve', authenticateToken, approveEarthWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
