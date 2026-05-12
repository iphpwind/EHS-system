import { Router, Request, Response, NextFunction } from 'express';
import { 
  getSubTicketDetail, 
  saveSubTicketDetail, 
  getFullTicketDetail 
} from '../controllers/ticketTypeSubController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * 作业类型子表 - 所有路由需要认证
 */

/**
 * 获取指定作业类型的子表详情
 * GET /api/ticket-types/:type/detail/:ticketId
 */
router.get('/:type/detail/:ticketId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getSubTicketDetail(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * 保存（创建/更新）指定作业类型的子表详情
 * POST /api/ticket-types/:type/detail/:ticketId
 */
router.post('/:type/detail/:ticketId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await saveSubTicketDetail(req, res, next);
  } catch (error) {
    next(error);
  }
});

/**
 * 获取作业票主表+子表完整详情
 * GET /api/ticket-types/:type/full/:ticketId
 */
router.get('/:type/full/:ticketId', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getFullTicketDetail(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
