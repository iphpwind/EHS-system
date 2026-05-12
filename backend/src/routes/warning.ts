import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import {
  connectSSE,
  getWarningList,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  createWarning,
  runWarningCheck,
  getSSEStats
} from '../controllers/warningController';

const router = Router();

/**
 * SSE 实时连接端点
 * GET /api/warning/sse
 * 返回 text/event-stream
 */
router.get('/sse', authenticateToken, connectSSE);

/**
 * 获取预警列表
 * GET /api/warning/list
 */
router.get('/list', authenticateToken, getWarningList);

/**
 * 获取未读预警数量
 * GET /api/warning/unread-count
 */
router.get('/unread-count', authenticateToken, getUnreadCount);

/**
 * 标记预警已读
 * PUT /api/warning/:id/read
 */
router.put('/:id/read', authenticateToken, markAsRead);

/**
 * 全部标记为已读
 * PUT /api/warning/read-all
 */
router.put('/read-all', authenticateToken, markAllAsRead);

/**
 * 创建预警（手动触发）
 * POST /api/warning/create
 */
router.post('/create', authenticateToken, createWarning);

/**
 * 运行预警规则检查（管理员或定时任务调用）
 * POST /api/warning/check
 */
router.post('/check', authenticateToken, runWarningCheck);

/**
 * 获取 SSE 连接统计（管理员用）
 * GET /api/warning/sse-stats
 */
router.get('/sse-stats', authenticateToken, getSSEStats);

export default router;
