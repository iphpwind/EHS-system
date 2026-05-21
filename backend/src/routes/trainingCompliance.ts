/**
 * 三级安全教育 & 年度学时统计 路由
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getTemplates,
  updateTemplate,
  assignEducation,
  getEducationStatus,
  getMyEducationStatus,
  preCheckTrainingStatus,
  annualReport,
  creditCalculator,
  listThreeLevelRecords,
  getThreeLevelRecord,
  createThreeLevelRecord,
  updateThreeLevelRecord,
  assessThreeLevelRecord,
} from '../controllers/trainingComplianceController';

const router = Router();

// ===== 三级教育模板 =====
router.get('/templates', authenticateToken, getTemplates);
router.put('/templates/:id', authenticateToken, updateTemplate);

// ===== 三级教育分配 =====
router.post('/assign', authenticateToken, assignEducation);
router.get('/status/:userId', authenticateToken, getEducationStatus);
router.get('/my-status', authenticateToken, getMyEducationStatus);

// ===== 作业票培训预校验 =====
router.get('/precheck', authenticateToken, preCheckTrainingStatus);

// ===== 年度学时报表 =====
router.get('/annual-report', authenticateToken, annualReport);

// ===== 学时换算计算器 =====
router.get('/credit-calc', authenticateToken, creditCalculator);

// ===== 三级教育记录 CRUD =====
router.get('/records', authenticateToken, listThreeLevelRecords);
router.get('/records/:id', authenticateToken, getThreeLevelRecord);
router.post('/records', authenticateToken, createThreeLevelRecord);
router.put('/records/:id', authenticateToken, updateThreeLevelRecord);
router.post('/records/:id/assess', authenticateToken, assessThreeLevelRecord);

export default router;
