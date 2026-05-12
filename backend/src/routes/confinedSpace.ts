import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { gb30871Validator, gb30871ApproveValidator } from '../middleware/gb30871Validator';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getConfinedSpaceList, getConfinedSpaceDetail,
  createConfinedSpace, updateConfinedSpace,
  submitConfinedSpace, approveConfinedSpace,
  startWork, finishWork, closeWork
} from '../controllers/confinedSpaceController';

const router = Router();

router.get('/', authenticateToken, getConfinedSpaceList);
router.get('/:id', authenticateToken, getConfinedSpaceDetail);
// GB 30871-2022 + 培训合规：三级教育72学时 + 年度≥20学时
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), gb30871Validator('confined'), createConfinedSpace);
router.put('/:id', authenticateToken, updateConfinedSpace);
router.post('/:id/submit', authenticateToken, submitConfinedSpace);
// GB 30871 审批前校验：安全审批/最终批准前必须确认气体检测已完成
router.post('/:id/approve', authenticateToken, gb30871ApproveValidator('confined'), approveConfinedSpace);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
