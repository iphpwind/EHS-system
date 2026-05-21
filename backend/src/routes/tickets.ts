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
  verifyQrCode,
  getTicketApprovalLogs,
  getGasDetectionRecords,
  addGasDetectionRecord,
  deleteGasDetectionRecord,
  uploadVideo
} from '../controllers/ticketController';
import upload from '../middleware/uploadMiddleware';
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

/**
 * 获取作业票审批日志（GB 30871 合规）
 * GET /api/tickets/:id/approval-logs
 */
router.get('/:id/approval-logs', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getTicketApprovalLogs(req, res, next);
  } catch (error) {
    console.error('Get ticket approval logs error:', error);
    next(error);
  }
});

/**
 * 获取气体检测记录（受限空间作业，GB 30871-2022 合规）
 * GET /api/tickets/:id/gas-detection
 */
router.get('/:id/gas-detection', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getGasDetectionRecords(req, res, next);
  } catch (error) {
    console.error('Get gas detection records error:', error);
    next(error);
  }
});

/**
 * 添加气体检测记录（受限空间作业，GB 30871-2022 合规）
 * POST /api/tickets/:id/gas-detection
 */
router.post('/:id/gas-detection', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addGasDetectionRecord(req, res, next);
  } catch (error) {
    console.error('Add gas detection record error:', error);
    next(error);
  }
});

/**
 * 删除气体检测记录（受限空间作业，GB 30871-2022 合规）
 * DELETE /api/tickets/:id/gas-detection/:recordId
 */
router.delete('/:id/gas-detection/:recordId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteGasDetectionRecord(req, res, next);
  } catch (error) {
    console.error('Delete gas detection record error:', error);
    next(error);
  }
});

/**
 * 上传作业票监控视频（特级作业，GB 30871-2022 合规）
 * POST /api/tickets/:id/upload-video
 */
router.post('/:id/upload-video', authenticateToken, upload.single('video'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    await uploadVideo(req, res, next);
  } catch (error) {
    console.error('Upload video error:', error);
    next(error);
  }
});

export default router;
