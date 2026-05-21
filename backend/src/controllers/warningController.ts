import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database';
import sseManager from '../utils/sseManager';

/**
 * SSE 连接端点 - 建立实时预警推送连接
 */
export const connectSSE = async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: '未授权' });
    }

    const clientId = `user_${userId}_${Date.now()}`;
    sseManager.addClient(clientId, userId, res);

    // 连接断开时清理
    req.on('close', () => {
      sseManager.removeClient(clientId);
    });

    // 立即推送一条欢迎消息
    sseManager.sendToClient(clientId, 'welcome', {
      message: '预警连接已建立',
      timestamp: new Date().toISOString()
    });

    // 推送当前用户的未读预警数量
    conn = await getConnection();
    const [unreadRows] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    const unreadCount = (unreadRows as any[])[0]?.count || 0;
    
    sseManager.sendToClient(clientId, 'unread_count', { count: unreadCount });

  } catch (error) {
    console.error('SSE 连接错误:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: '服务器错误' });
    }
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取预警列表（分页）
 */
export const getWarningList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    const { page = 1, pageSize = 20, type, isRead, level } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    conn = await getConnection();

    let where = 'WHERE user_id = ?';
    const params: any[] = [userId];

    if (isRead !== undefined && isRead !== '') {
      where += ' AND is_read = ?';
      params.push(Number(isRead));
    }

    if (type) {
      where += ' AND warning_type = ?';
      params.push(type);
    }

    if (level) {
      where += ' AND level = ?';
      params.push(level);
    }

    // 查询总数
    const [countRows] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM warnings ${where}`,
      params
    );
    const total = (countRows as any[])[0]?.total || 0;

    // 查询列表
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM warnings ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );

    res.json({
      success: true,
      data: rows,
      total,
      page: Number(page),
      pageSize: Number(pageSize)
    });
  } catch (error) {
    console.error('获取预警列表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 标记预警已读
 */
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    const { id } = req.params;

    conn = await getConnection();
    const [result] = await conn.execute(
      'UPDATE warnings SET is_read = 1, read_time = NOW() WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    const affectedRows = (result as any).affectedRows;
    if (affectedRows === 0) {
      return res.status(404).json({ success: false, message: '预警记录不存在' });
    }

    // 推送未读数量更新
    const [unreadRows] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    const unreadCount = (unreadRows as any[])[0]?.count || 0;
    sseManager.sendToUser(userId, 'unread_count', { count: unreadCount });

    res.json({ success: true, message: '已标记为已读' });
  } catch (error) {
    console.error('标记已读错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 全部标记为已读
 */
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    conn = await getConnection();

    await conn.execute(
      'UPDATE warnings SET is_read = 1, read_time = NOW() WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    // 推送未读数量更新
    sseManager.sendToUser(userId, 'unread_count', { count: 0 });
    sseManager.sendToUser(userId, 'all_read', { message: '全部已读' });

    res.json({ success: true, message: '全部已标记为已读' });
  } catch (error) {
    console.error('全部标记已读错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取未读预警数量
 */
export const getUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    const count = (rows as any[])[0]?.count || 0;
    res.json({ success: true, data: { count } });
  } catch (error) {
    console.error('获取未读数量错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 创建预警（系统自动触发或手动触发）
 */
export const createWarning = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const {
      userId,
      warningType,
      level,
      title,
      content,
      relatedId,
      relatedType
    } = req.body;

    if (!userId || !warningType || !title) {
      return res.status(400).json({ success: false, message: '缺少必填参数' });
    }

    conn = await getConnection();
    const [result] = await conn.execute(
      `INSERT INTO warnings (user_id, warning_type, level, title, content, related_id, related_type, is_read, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())`,
      [userId, warningType, level || 'info', title, content || '', relatedId || null, relatedType || null]
    );

    const insertId = (result as any).insertId;

    // 实时推送预警给目标用户
    sseManager.sendToUser(userId, 'new_warning', {
      id: insertId,
      warningType,
      level,
      title,
      content,
      createdAt: new Date().toISOString()
    });

    // 推送未读数量更新
    const [unreadRows] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM warnings WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    const unreadCount = (unreadRows as any[])[0]?.count || 0;
    sseManager.sendToUser(userId, 'unread_count', { count: unreadCount });

    res.json({ success: true, data: { id: insertId }, message: '预警创建成功' });
  } catch (error) {
    console.error('创建预警错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 运行预警规则检查（定时任务调用）
 * 检查以下内容并自动生成预警：
 * 1. 作业票即将到期（3天内）
 * 2. 隐患逾期未整改
 * 3. 设备点检逾期
 * 4. 证书即将过期（30天内）
 */
export const runWarningCheck = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    let createdCount = 0;

    // 1. 检查作业票即将到期（3天内）
    const [upcomingTickets] = await conn.execute<RowDataPacket[]>(
      `SELECT wp.*, u.id as user_id, u.real_name
       FROM work_permits wp
       LEFT JOIN users u ON wp.applicant_id = u.id
       WHERE wp.status IN ('approved', 'executing')
       AND wp.end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)`
    );

    for (const ticket of upcomingTickets as any[]) {
      // 检查是否已存在相同预警
      const [existing] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM warnings WHERE related_id = ? AND related_type = ? AND warning_type = ? AND is_read = 0',
        [ticket.id, 'work_permit', 'ticket_expiring']
      );

      if ((existing as any[]).length === 0) {
        await conn.execute(
          `INSERT INTO warnings (user_id, warning_type, level, title, content, related_id, related_type, is_read, created_at)
           VALUES (?, 'ticket_expiring', 'warning', ?, ?, 'work_permit', 0, NOW())`,
          [
            ticket.user_id,
            `作业票即将到期：${ticket.ticket_no}`,
            `作业票「${ticket.ticket_no}」将于 ${ticket.end_time} 到期，请及时完成或延期。`,
            ticket.id
          ]
        );
        createdCount++;

        // 推送预警
        sseManager.sendToUser(ticket.user_id, 'new_warning', {
          warningType: 'ticket_expiring',
          level: 'warning',
          title: `作业票即将到期：${ticket.ticket_no}`
        });
      }
    }

    // 2. 检查隐患逾期未整改
    const [overdueHazards] = await conn.execute<RowDataPacket[]>(
      `SELECT h.*, u.id as user_id
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       WHERE h.status = 1 AND h.rectification_deadline < NOW()`
    );

    for (const hazard of overdueHazards as any[]) {
      const [existing] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM warnings WHERE related_id = ? AND related_type = ? AND warning_type = ? AND is_read = 0',
        [hazard.id, 'hazard', 'hazard_overdue']
      );

      if ((existing as any[]).length === 0) {
        await conn.execute(
          `INSERT INTO warnings (user_id, warning_type, level, title, content, related_id, related_type, is_read, created_at)
           VALUES (?, 'hazard_overdue', 'danger', ?, ?, 'hazard', 0, NOW())`,
          [
            hazard.user_id,
            `隐患整改逾期：${hazard.hazard_description?.substring(0, 50)}`,
            `隐患「${hazard.hazard_description}」整改期限已逾期，请尽快处理。`,
            hazard.id
          ]
        );
        createdCount++;

        sseManager.sendToUser(hazard.user_id, 'new_warning', {
          warningType: 'hazard_overdue',
          level: 'danger',
          title: `隐患整改逾期：${hazard.hazard_description?.substring(0, 50)}`
        });
      }
    }

    // 3. 检查证书即将过期（30天内）
    const [expiringCerts] = await conn.execute<RowDataPacket[]>(
      `SELECT c.*, u.id as user_id, u.real_name
       FROM certificates c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.expiry_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)
       AND c.status = 1`
    );

    for (const cert of expiringCerts as any[]) {
      const [existing] = await conn.execute<RowDataPacket[]>(
        'SELECT id FROM warnings WHERE related_id = ? AND related_type = ? AND warning_type = ? AND is_read = 0',
        [cert.id, 'certificate', 'cert_expiring']
      );

      if ((existing as any[]).length === 0) {
        await conn.execute(
          `INSERT INTO warnings (user_id, warning_type, level, title, content, related_id, related_type, is_read, created_at)
           VALUES (?, 'cert_expiring', 'info', ?, ?, 'certificate', 0, NOW())`,
          [
            cert.user_id,
            `证书即将过期：${cert.cert_name}`,
            `证书「${cert.cert_name}」将于 ${cert.expiry_date} 过期，请及时续期。`,
            cert.id
          ]
        );
        createdCount++;

        sseManager.sendToUser(cert.user_id, 'new_warning', {
          warningType: 'cert_expiring',
          level: 'info',
          title: `证书即将过期：${cert.cert_name}`
        });
      }
    }

    res.json({
      success: true,
      data: { createdCount },
      message: `预警检查完成，新生成 ${createdCount} 条预警`
    });
  } catch (error) {
    console.error('运行预警检查错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取 SSE 连接统计
 */
export const getSSEStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = sseManager.getStats();
    res.json({
      success: true,
      data: {
        ...stats,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('获取 SSE 统计错误:', error);
    next(error);
  }
};
