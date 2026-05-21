import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getHighWorkList, getHighWorkDetail,
  createHighWork, updateHighWork,
  submitHighWork, approveHighWork,
  startWork, finishWork, closeWork,
  guardianSignIn, guardianConfirmEnd
} from '../controllers/highWorkController';

const router = Router();

router.get('/', authenticateToken, getHighWorkList);
router.get('/:id', authenticateToken, getHighWorkDetail);
// 培训合规：三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createHighWork);
router.put('/:id', authenticateToken, updateHighWork);
router.post('/:id/submit', authenticateToken, submitHighWork);
router.post('/:id/approve', authenticateToken, approveHighWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);
// 监护人签到（GB 30871 强制）
router.post('/:id/guardian-sign-in', authenticateToken, guardianSignIn);
router.post('/:id/guardian-confirm', authenticateToken, guardianConfirmEnd);

export default router;
