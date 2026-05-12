import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getDevices, createDevice, updateDevice, deleteDevice } from '../controllers/iotVideoController';

const router = Router();
router.get('/devices', authenticateToken, getDevices);
router.post('/devices', authenticateToken, createDevice);
router.put('/devices/:id', authenticateToken, updateDevice);
router.delete('/devices/:id', authenticateToken, deleteDevice);

export default router;
