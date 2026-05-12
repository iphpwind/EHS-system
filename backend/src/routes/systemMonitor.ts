import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import { getConnection } from '../config/database';

const router = Router();

/**
 * 获取系统健康状态
 * GET /api/system-monitor/health
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const start = Date.now();

    // 数据库延迟检测
    await conn.execute('SELECT 1');
    const dbLatency = Date.now() - start;

    // 各业务统计
    const [workCount] = await conn.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(IF(status = '2', 1, 0)) as pending,
        SUM(IF(status = '3', 1, 0)) as deptApprove,
        SUM(IF(status = '4', 1, 0)) as safetyApprove,
        SUM(IF(status IN ('5','6'), 1, 0)) as working,
        SUM(IF(status = '8', 1, 0)) as closed
       FROM work_permits`
    );
    const [hazardCount] = await conn.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(IF(status != 4 AND status != 'closed', 1, 0)) as open,
        SUM(IF(rectify_deadline < NOW() AND status != 4 AND status != 'closed', 1, 0)) as overdue
       FROM hazard_inspection`
    );
    const [trainingCount] = await conn.execute(
      `SELECT COUNT(*) as total FROM training_records`
    );
    const [userCount] = await conn.execute(
      `SELECT COUNT(*) as total FROM users WHERE status = 1`
    );
    const [errorLogCount] = await conn.execute(
      `SELECT COUNT(*) as total FROM operation_logs WHERE action = 'ERROR' AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        status: 'ok',
        uptime: process.uptime(),
        memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1)} MB`,
        dbLatency: `${dbLatency}ms`,
        dbStatus: dbLatency < 200 ? 'normal' : 'slow',
        workPermits: (workCount as any[])[0] || {},
        hazards: (hazardCount as any[])[0] || {},
        trainingTotal: (trainingCount as any[])[0]?.total || 0,
        activeUsers: (userCount as any[])[0]?.total || 0,
        last24hErrors: (errorLogCount as any[])[0]?.total || 0,
        nodeVersion: process.version,
        env: process.env.NODE_ENV || 'development'
      }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: error.message || '系统错误' });
  }
});

/**
 * 获取待办摘要
 * GET /api/system-monitor/summary
 */
router.get('/summary', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [myWork] = await conn.execute(
      `SELECT COUNT(*) as count FROM work_permits WHERE applicant_id = ? AND status IN ('1','2','3','4')`,
      [userId]
    );
    const [pending] = await conn.execute(
      `SELECT COUNT(*) as count FROM work_permits WHERE status = '2'`
    );
    const [overdueHazard] = await conn.execute(
      `SELECT COUNT(*) as count FROM hazard_inspection WHERE rectify_deadline < NOW() AND status != 4 AND status != 'closed'`
    );
    const [training] = await conn.execute(
      `SELECT COUNT(*) as count FROM training_records WHERE user_id = ? AND status = 'learning'`,
      [userId]
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        myPendingWork: (myWork as any[])[0]?.count || 0,
        totalPendingApproval: (pending as any[])[0]?.count || 0,
        overdueHazards: (overdueHazard as any[])[0]?.count || 0,
        inProgressTraining: (training as any[])[0]?.count || 0,
        serverUptime: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m`
      }
    });
  } catch (error: any) {
    res.status(500).json({ code: 500, msg: error.message || '系统错误' });
  }
});

export default router;
