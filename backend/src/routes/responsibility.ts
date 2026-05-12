/**
 * 安全生产责任制签署路由
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  getResponsibilityList,
  getResponsibilityDetail,
  createResponsibility,
  publishResponsibility,
  handleSign,
  handleRevision,
  getMySignList,
} from '../controllers/responsibilityController';

const router = Router();

// 列表
router.get('/list', authenticateToken, getResponsibilityList);
// 待签署任务
router.get('/my-tasks', authenticateToken, getMySignList);
// 详情
router.get('/:id', authenticateToken, getResponsibilityDetail);
// 创建
router.post('/create', authenticateToken, createResponsibility);
// 发布签署
router.post('/:id/publish', authenticateToken, publishResponsibility);
// 签署
router.post('/:id/sign', authenticateToken, handleSign);
// 触发修订
router.post('/:id/revision', authenticateToken, handleRevision);

export default router;
