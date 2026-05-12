import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getElectricWorkList, getElectricWorkDetail,
  createElectricWork, updateElectricWork,
  submitElectricWork, approveElectricWork,
  startWork, finishWork, closeWork
} from '../controllers/electricWorkController';

const router = Router();

router.get('/', authenticateToken, getElectricWorkList);
router.get('/:id', authenticateToken, getElectricWorkDetail);
router.post('/', authenticateToken, createElectricWork);
router.put('/:id', authenticateToken, updateElectricWork);
router.post('/:id/submit', authenticateToken, submitElectricWork);
router.post('/:id/approve', authenticateToken, approveElectricWork);
router.post('/:id/start', authenticateToken, startWork);
router.post('/:id/finish', authenticateToken, finishWork);
router.post('/:id/close', authenticateToken, closeWork);

export default router;
