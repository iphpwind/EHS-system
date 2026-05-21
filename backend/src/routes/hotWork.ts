import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { ticketTrainingValidator } from '../middleware/ticketTrainingValidator';
import {
  getHotWorkList, getHotWorkDetail,
  createHotWork, updateHotWork,
  submitHotWork, approveHotWork,
  startWork, finishWork, closeWork,
  gasCheck, getGasChecks,
  guardianSignIn, guardianConfirmEnd
} from '../controllers/hotWorkController';

const router = Router();

// 列表和详情
router.get('/', authenticateToken, getHotWorkList);
router.get('/:id', authenticateToken, getHotWorkDetail);

// CRUD（培训合规：高危作业需三级教育72学时 + 年度≥20学时 + 特种证书）
router.post('/', authenticateToken, ticketTrainingValidator({ requireThreeLevel: true, minAnnualHours: 20 }), createHotWork);
router.put('/:id', authenticateToken, updateHotWork);

// 流程操作
router.post('/:id/submit', authenticateToken, submitHotWork);
router.post('/:id/approve', authenticateToken, approveHotWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

// 气体检测
router.get('/:id/gas', authenticateToken, getGasChecks);
router.post('/:id/gas', authenticateToken, gasCheck);

// 监护人签到（GB 30871 强制）
router.post('/:id/guardian-sign-in', authenticateToken, guardianSignIn);
router.post('/:id/guardian-confirm', authenticateToken, guardianConfirmEnd);

export default router;
