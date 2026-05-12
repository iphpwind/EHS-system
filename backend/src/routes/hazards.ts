import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getHazardList,
  getHazardById,
  createHazard,
  updateHazard,
  deleteHazard,
  rectifyHazard,
  acceptHazard,
  getHazardStats
} from '../controllers/hazardController';

const router = Router();

router.get('/', authenticateToken, getHazardList);
router.get('/stats', authenticateToken, getHazardStats);
router.get('/:id', authenticateToken, getHazardById);
router.post('/', authenticateToken, createHazard);
router.put('/:id', authenticateToken, updateHazard);
router.delete('/:id', authenticateToken, deleteHazard);
router.post('/:id/rectify', authenticateToken, rectifyHazard);
router.post('/:id/accept', authenticateToken, acceptHazard);

export default router;
