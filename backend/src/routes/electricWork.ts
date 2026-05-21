import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getElectricWorkList, getElectricWorkDetail,
  createElectricWork, updateElectricWork,
  submitElectricWork, approveElectricWork,
  startWork, finishWork, closeWork,
  guardianSignIn, guardianConfirmEnd
} from '../controllers/electricWorkController';

const router = Router();

router.get('/', authenticateToken, getElectricWorkList);
router.get('/:id', authenticateToken, getElectricWorkDetail);
// 培训合规：三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createElectricWork);
router.put('/:id', authenticateToken, updateElectricWork);
router.post('/:id/submit', authenticateToken, submitElectricWork);
router.post('/:id/approve', authenticateToken, approveElectricWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);
// 监护人签到（GB 30871 强制）
router.post('/:id/guardian-sign-in', authenticateToken, guardianSignIn);
router.post('/:id/guardian-confirm', authenticateToken, guardianConfirmEnd);

export default router;
