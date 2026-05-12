import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getPatrolPlans, createPatrolPlan, updatePatrolPlan, deletePatrolPlan } from '../controllers/patrolController';

const router = Router();
router.get('/plans', authenticateToken, getPatrolPlans);
router.post('/plans', authenticateToken, createPatrolPlan);
router.put('/plans/:id', authenticateToken, updatePatrolPlan);
router.delete('/plans/:id', authenticateToken, deletePatrolPlan);

export default router;
