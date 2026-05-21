/**
 * 证书到期定时任务服务
 *
 * 每天早上8:30自动检查证书到期情况
 * - 提前30天/60天/90天分级预警
 * - 通过SSE推送预警通知到前端
 * - 生成数据库通知记录
 * - 标记已通知，避免重复推送
 *
 * 在 app.ts 中调用 startCertificateScheduler() 启动
 */

import cron from 'node-cron';
import { getConnection } from '../config/database';
import { logger } from '../utils/logger';

/** SSE 推送客户端集合（由外部注入） */
const sseClients: Set<{ send: (data: any) => void }> = new Set();

/**
 * 注册 SSE 客户端（由 app.ts 的 /api/sse 路由注入）
 */
export function registerSSEClient(client: { send: (data: any) => void }): void {
  sseClients.add(client);
  logger.info(`[CertificateScheduler] SSE 客户端已注册，当前连接数: ${sseClients.size}`);
}

/**
 * 移除 SSE 客户端
 */
export function removeSSEClient(client: { send: (data: any) => void }): void {
  sseClients.delete(client);
  logger.info(`[CertificateScheduler] SSE 客户端已移除，当前连接数: ${sseClients.size}`);
}

/**
 * 向所有SSE客户端广播消息
 */
function broadcastSSE(data: any): void {
  let sent = 0;
  sseClients.forEach(client => {
    try {
      client.send(data);
      sent++;
    } catch (error) {
      logger.error('[CertificateScheduler] SSE 推送失败，移除客户端', { error });
      sseClients.delete(client);
    }
  });
  if (sent > 0) {
    logger.info(`[CertificateScheduler] SSE 预警已推送到 ${sent} 个客户端`);
  }
}

/**
 * 证书过期预警扫描
 * 每天早上8:30执行
 */
async function scanCertificateExpiry(): Promise<void> {
  logger.info('[CertificateScheduler] 开始证书过期扫描...');

  let conn: any = null;
  try {
    conn = await getConnection();

    // 确保 notifications 表存在
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL COMMENT '用户ID',
        title VARCHAR(200) NOT NULL COMMENT '通知标题',
        content TEXT COMMENT '通知内容',
        level ENUM('notice','warning','urgent') DEFAULT 'notice' COMMENT '预警级别',
        type VARCHAR(50) DEFAULT 'certificate_expiry' COMMENT '通知类型',
        is_read TINYINT DEFAULT 0 COMMENT '是否已读',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_user (user_id),
        INDEX idx_type (type),
        INDEX idx_read (is_read),
        INDEX idx_user_type_read (user_id, type, is_read)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知消息表'
    `);

    // 查询未来90天内过期的证书（使用索引优化）
    const [rows] = await conn.execute(`
      SELECT 
        c.id as cert_id, c.cert_no, c.user_id, c.cert_name,
        c.issue_date, c.expire_date, c.status,
        u.real_name as user_name, u.department,
        ct.name as cert_type_name,
        DATEDIFF(c.expire_date, CURDATE()) as days_remaining
      FROM certificates c
      INNER JOIN users u ON c.user_id = u.id
      INNER JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
      WHERE c.status = 1
        AND c.expire_date IS NOT NULL
        AND c.expire_date >= CURDATE()
        AND c.expire_date <= DATE_ADD(CURDATE(), INTERVAL 90 DAY)
      ORDER BY c.expire_date ASC
    `);

    const certs = rows as any[];

    if (certs.length === 0) {
      logger.info('[CertificateScheduler] ✅ 没有即将过期的证书');
      return;
    }

    logger.info(`[CertificateScheduler] 🔍 发现 ${certs.length} 个即将过期的证书`);

    let insertedCount = 0;
    const urgentCerts: any[] = [];   // ≤30天紧急
    const warningCerts: any[] = [];  // 31-60天警告
    const noticeCerts: any[] = [];   // 61-90天提醒

    for (const cert of certs) {
      let level: string;
      if (cert.days_remaining <= 30) {
        level = 'urgent';
        urgentCerts.push(cert);
      } else if (cert.days_remaining <= 60) {
        level = 'warning';
        warningCerts.push(cert);
      } else {
        level = 'notice';
        noticeCerts.push(cert);
      }

      // 去重检查：同一用户+同一类型+未读的通知不再重复生成
      const [existing] = await conn.execute(
        `SELECT id FROM notifications 
         WHERE user_id = ? AND type = 'certificate_expiry' AND is_read = 0 
         LIMIT 1`,
        [cert.user_id]
      );

      if ((existing as any[]).length === 0) {
        const title = '证书即将过期提醒';
        const content = `您的证书【${cert.cert_type_name || cert.cert_name}】（编号：${cert.cert_no}）将于 ${cert.expire_date} 到期，剩余 ${cert.days_remaining} 天，请及时参加复训并更新证书。`;

        await conn.execute(
          `INSERT INTO notifications (user_id, title, content, level, type, created_at) 
           VALUES (?, ?, ?, ?, 'certificate_expiry', NOW())`,
          [cert.user_id, title, content, level]
        );
        insertedCount++;
      }
    }

    logger.info(`[CertificateScheduler] 📬 证书过期通知已生成：${insertedCount} 条 ` +
      `(紧急:${urgentCerts.length} 警告:${warningCerts.length} 提醒:${noticeCerts.length})`);

    // 通过 SSE 推送预警到前端
    broadcastSSE({
      type: 'certificate_expiry_warning',
      timestamp: new Date().toISOString(),
      summary: {
        total: certs.length,
        urgent: urgentCerts.length,
        warning: warningCerts.length,
        notice: noticeCerts.length,
        newNotifications: insertedCount,
      },
      urgentList: urgentCerts.slice(0, 5).map(c => ({
        certId: c.cert_id,
        certNo: c.cert_no,
        certName: c.cert_type_name || c.cert_name,
        userName: c.user_name,
        department: c.department,
        expireDate: c.expire_date,
        daysRemaining: c.days_remaining,
      })),
    });

  } catch (error) {
    logger.error('[CertificateScheduler] 证书过期扫描失败:', { error });
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 作业票操作人员证书校验
 * 在作业票创建时调用，检查操作人员证书有效性
 *
 * @param userId 用户ID
 * @param ticketType 作业票类型
 * @returns 校验结果
 */
export async function checkOperatorCertificate(
  userId: number,
  ticketType?: string
): Promise<{ valid: boolean; message: string; certInfo?: any }> {
  let conn: any = null;
  try {
    conn = await getConnection();

    // 查询用户的有效证书
    const [rows] = await conn.execute(`
      SELECT 
        c.id, c.cert_no, c.cert_name, c.expire_date,
        ct.name as cert_type_name,
        DATEDIFF(c.expire_date, CURDATE()) as days_remaining
      FROM certificates c
      INNER JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
      WHERE c.user_id = ? AND c.status = 1 AND c.expire_date >= CURDATE()
      ORDER BY c.expire_date ASC
    `, [userId]);

    const certs = rows as any[];

    if (!certs || certs.length === 0) {
      return {
        valid: false,
        message: '该操作人员无有效证书，请先参加培训并取得证书后再创建作业票',
      };
    }

    // 找出最近过期或第一个有效的证书
    const validCert = certs[0];

    return {
      valid: true,
      message: `证书校验通过：${validCert.cert_type_name || validCert.cert_name} 有效期至 ${validCert.expire_date}`,
      certInfo: {
        certId: validCert.id,
        certNo: validCert.cert_no,
        certName: validCert.cert_type_name || validCert.cert_name,
        expireDate: validCert.expire_date,
        daysRemaining: validCert.days_remaining,
      },
    };

  } catch (error) {
    logger.error('[CertificateScheduler] 操作员证书校验异常:', { error, userId, ticketType });
    // 异常时放行但记录日志
    return {
      valid: true,
      message: '证书校验服务异常，临时放行（已记录）',
    };
  } finally {
    if (conn) conn.release();
  }
}

/**
 * 启动证书定时任务
 */
let schedulerStarted = false;

export function startCertificateScheduler(): void {
  if (schedulerStarted) {
    logger.warn('[CertificateScheduler] 定时任务已启动，跳过重复启动');
    return;
  }

  logger.info('[CertificateScheduler] 证书定时任务启动...');

  // 每天早上8:30执行
  cron.schedule('30 8 * * *', async () => {
    logger.info('[CertificateScheduler] ⏰ 定时任务触发（每天 8:30）');
    await scanCertificateExpiry();
  }, {
    timezone: 'Asia/Shanghai',
  });

  // 服务启动时立即执行一次
  setTimeout(() => {
    logger.info('[CertificateScheduler] 🚀 启动时立即执行一次扫描');
    scanCertificateExpiry().catch(err => {
      logger.error('[CertificateScheduler] 启动扫描失败:', { error: err });
    });
  }, 5000); // 延迟5秒，等待数据库连接就绪

  schedulerStarted = true;
  logger.info('[CertificateScheduler] ✅ 证书定时任务已就绪');
}

export default {
  startCertificateScheduler,
  checkOperatorCertificate,
  registerSSEClient,
  removeSSEClient,
};
