import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getHoistingWorkList, getHoistingWorkDetail,
  createHoistingWork, updateHoistingWork,
  submitHoistingWork, approveHoistingWork,
  startWork, finishWork, closeWork,
  guardianSignIn, guardianConfirmEnd
} from '../controllers/hoistingWorkController';

const router = Router();

router.get('/', authenticateToken, getHoistingWorkList);
router.get('/:id', authenticateToken, getHoistingWorkDetail);
// 培训合规：高危作业需三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createHoistingWork);
router.put('/:id', authenticateToken, updateHoistingWork);
router.post('/:id/submit', authenticateToken, submitHoistingWork);
router.post('/:id/approve', authenticateToken, approveHoistingWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);
// 监护人签到（GB 30871 强制）
router.post('/:id/guardian-sign-in', authenticateToken, guardianSignIn);
router.post('/:id/guardian-confirm', authenticateToken, guardianConfirmEnd);

export default router;
