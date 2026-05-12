import { Router, Request, Response, NextFunction } from 'express';
import { 
  getTickets, 
  getTicketById, 
  createTicket, 
  updateTicket, 
  deleteTicket,
  submitApproval,
  approveTicket,
  getTicketStats,
  verifyQrCode
} from '../controllers/ticketController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

import { getSafetyMeasures } from '../utils/ticketTypeMap';

/**
 * 获取安全措施模板（按类型+级别）
 * GET /api/tickets/measures?type=hot_work&level=special
 */
router.get('/measures', authenticateToken, (req: Request, res: Response) => {
  const { type, level } = req.query;
  const measures = getSafetyMeasures(type as string, level as string | undefined);
  res.json({ success: true, data: measures });
});

/**
 * 获取作业票列表
 * GET /api/tickets
 */
router.get('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getTickets(req, res, next);
  } catch (error) {
    console.error('Get tickets error:', error);
    next(error);
  }
});

/**
 * 获取作业票统计数据
 * GET /api/tickets/stats
 */
router.get('/stats', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getTicketStats(req, res, next);
  } catch (error) {
    console.error('Get ticket stats error:', error);
    next(error);
  }
});

/**
 * 二维码核验
 * GET /api/tickets/verify-qr?code=xxx
 */
router.get('/verify-qr', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await verifyQrCode(req, res, next);
  } catch (error) {
    console.error('Verify QR code error:', error);
    next(error);
  }
});

/**
 * 获取单个作业票详情
 * GET /api/tickets/:id
 */
router.get('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getTicketById(req, res, next);
  } catch (error) {
    console.error('Get ticket by id error:', error);
    next(error);
  }
});

/**
 * 创建作业票
 * POST /api/tickets
 */
router.post('/', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createTicket(req, res, next);
  } catch (error) {
    console.error('Create ticket error:', error);
    next(error);
  }
});

/**
 * 更新作业票
 * PUT /api/tickets/:id
 */
router.put('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await updateTicket(req, res, next);
  } catch (error) {
    console.error('Update ticket error:', error);
    next(error);
  }
});

/**
 * 提交审批
 * POST /api/tickets/:id/submit
 */
router.post('/:id/submit', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await submitApproval(req, res, next);
  } catch (error) {
    console.error('Submit approval error:', error);
    next(error);
  }
});

/**
 * 审批操作
 * POST /api/tickets/:id/approve
 */
router.post('/:id/approve', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await approveTicket(req, res, next);
  } catch (error) {
    console.error('Approve ticket error:', error);
    next(error);
  }
});

/**
 * 删除作业票
 * DELETE /api/tickets/:id
 */
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteTicket(req, res, next);
  } catch (error) {
    console.error('Delete ticket error:', error);
    next(error);
  }
});

export default router;
