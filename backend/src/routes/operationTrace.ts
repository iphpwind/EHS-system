import { Router } from 'express';
import { getTraceByTicket, getTraceByUser, getRecentTraces } from '../controllers/operationTraceController';

const router = Router();

// 按作业票ID查询操作链
router.get('/trace/:ticketId', getTraceByTicket);

// 按用户ID查询操作记录
router.get('/trace/user/:userId', getTraceByUser);

// 查询最近的审计日志
router.get('/trace', getRecentTraces);

export default router;
