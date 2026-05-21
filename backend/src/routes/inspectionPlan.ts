import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getInspectionPlans,
  getInspectionPlanDetail,
  createInspectionPlan,
  updateInspectionPlan,
  deleteInspectionPlan,
  getInspectionRecords,
  createInspectionRecord,
  updateInspectionRecord,
  deleteInspectionRecord,
  getTodayInspections
} from '../controllers/inspectionPlanController';

const router = Router();

// 排查计划管理
router.get('/plans', authenticateToken, getInspectionPlans);
router.get('/plans/:id', authenticateToken, getInspectionPlanDetail);
router.post('/plans', authenticateToken, createInspectionPlan);
router.put('/plans/:id', authenticateToken, updateInspectionPlan);
router.delete('/plans/:id', authenticateToken, deleteInspectionPlan);

// 排查记录管理
router.get('/records', authenticateToken, getInspectionRecords);
router.post('/records', authenticateToken, createInspectionRecord);
router.put('/records/:id', authenticateToken, updateInspectionRecord);
router.delete('/records/:id', authenticateToken, deleteInspectionRecord);

// 今日待排查任务
router.get('/today', authenticateToken, getTodayInspections);

export default router;