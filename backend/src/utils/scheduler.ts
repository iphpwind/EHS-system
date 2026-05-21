import cron from 'node-cron';
import { getConnection } from '../config/database';

/**
 * 定时任务调度引擎
 * 在 app.ts 中调用 startAllJobs() 启动所有定时任务
 */

// ==================== 隐患超期检查（每10分钟） ====================
async function checkOverdueHazards() {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute(
      `SELECT COUNT(*) as count FROM hazard_inspection 
       WHERE rectification_deadline < NOW() AND status != 4 AND status <> 'closed'`
    );
    const count = (rows as any[])[0]?.count || 0;
    if (count > 0) {
      console.log(`[SCHEDULER] ⚠ 发现 ${count} 条超期隐患`);
    }
  } catch (error) {
    console.error('[SCHEDULER] 隐患超期检查失败:', error);
  } finally {
    if (conn) conn.release();
  }
}

// ==================== 作业票过期检查（每10分钟） ====================
async function checkExpiredTickets() {
  let conn: any = null;
  try {
    conn = await getConnection();
    // 自动关闭已过期且仍在作业中的作业票
    const [result] = await conn.execute(
      `UPDATE work_permits SET status = '8', updated_at = NOW()
       WHERE end_time < NOW() AND status IN ('5','6')`
    );
    const affected = (result as any).affectedRows || 0;
    if (affected > 0) {
      console.log(`[SCHEDULER] ⚠ 自动关闭 ${affected} 张过期作业票`);
    }
  } catch (error) {
    console.error('[SCHEDULER] 作业票过期检查失败:', error);
  } finally {
    if (conn) conn.release();
  }
}

// ==================== 待办事项统计（每5分钟） ====================
async function checkPendingTasks() {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [pendingWork] = await conn.execute(
      `SELECT COUNT(*) as count FROM work_permits WHERE status IN ('2','3','4')`
    );
    const [pendingHazard] = await conn.execute(
      `SELECT COUNT(*) as count FROM hazard_inspection WHERE status != 4 AND status != 'closed'`
    );
    const w = (pendingWork as any[])[0]?.count || 0;
    const h = (pendingHazard as any[])[0]?.count || 0;
    console.log(`[SCHEDULER] 📋 待审批: ${w} 张作业票, 未闭环: ${h} 条隐患`);
  } catch (error) {
    console.error('[SCHEDULER] 待办统计失败:', error);
  } finally {
    if (conn) conn.release();
  }
}

// ==================== 数据库连接检查（每30分钟） ====================
async function checkDBHealth() {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('SELECT 1');
    console.log('[SCHEDULER] ✅ 数据库连接正常');
  } catch (error) {
    console.error('[SCHEDULER] ❌ 数据库连接异常:', error);
  } finally {
    if (conn) conn.release();
  }
}

// ==================== 证书过期预警扫描（每天上午9:00） ====================
async function scanCertificateExpiry() {
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

    // 查询90天内即将过期的证书
    const [rows] = await conn.execute(`
      SELECT 
        c.id as cert_id, c.cert_no, c.user_id, c.cert_name,
        c.issue_date, c.expire_date, c.status,
        u.real_name as user_name, u.department,
        ct.name as cert_type_name,
        DATEDIFF(c.expire_date, NOW()) as days_remaining
      FROM certificates c
      INNER JOIN users u ON c.user_id = u.id
      INNER JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
      WHERE c.status = 1
        AND c.expire_date IS NOT NULL
        AND DATEDIFF(c.expire_date, NOW()) <= 90
        AND DATEDIFF(c.expire_date, NOW()) >= 0
      ORDER BY c.expire_date ASC
    `);

    const certs = rows as any[];
    if (certs.length === 0) {
      console.log('[SCHEDULER] ✅ 没有即将过期的证书');
      return;
    }

    console.log(`[SCHEDULER] 🔍 发现 ${certs.length} 个即将过期的证书`);

    let inserted = 0;
    for (const cert of certs) {
      let level: string;
      if (cert.days_remaining <= 30) level = 'urgent';
      else if (cert.days_remaining <= 60) level = 'warning';
      else level = 'notice';

      const title = '证书即将过期提醒';
      const content = `您的证书【${cert.cert_type_name || cert.cert_name}】（编号：${cert.cert_no}）将于 ${cert.expire_date} 到期，请及时续期。`;

      // 去重：已有相同 user_id+type 未读通知则跳过
      const [existing] = await conn.execute(
        `SELECT id FROM notifications WHERE user_id = ? AND type = 'certificate_expiry' AND is_read = 0 LIMIT 1`,
        [cert.user_id]
      );

      if ((existing as any[]).length === 0) {
        await conn.execute(
          `INSERT INTO notifications (user_id, title, content, level, type, created_at) VALUES (?, ?, ?, ?, 'certificate_expiry', NOW())`,
          [cert.user_id, title, content, level]
        );
        inserted++;
      }
    }

    console.log(`[SCHEDULER] 📬 证书过期通知已生成：${inserted} 条`);
  } catch (error) {
    console.error('[SCHEDULER] 证书过期扫描失败:', error);
  } finally {
    if (conn) conn.release();
  }
}

// ==================== TNA 自动任务分配（每天凌晨2:00） ====================
async function autoAssignTnaTasks() {
  try {
    const { autoAssignTasks: run } = require('../controllers/training/tnaController');
    const result = await run();
    if (result.assigned > 0) {
      console.log(`[SCHEDULER] 📚 TNA 自动分配培训任务：${result.assigned} 条`);
    }
  } catch (error) {
    console.error('[SCHEDULER] TNA 任务分配失败:', error);
  }
}

/**
 * 启动所有定时任务
 * 在 app.ts 中调用此函数
 */
export function startAllJobs() {
  console.log('[SCHEDULER] 定时任务引擎启动...');

  // 每10分钟：隐患超期检查
  cron.schedule('*/10 * * * *', checkOverdueHazards);

  // 每10分钟：作业票过期自动关闭
  cron.schedule('*/10 * * * *', checkExpiredTickets);

  // 每5分钟：待办事项统计
  cron.schedule('*/5 * * * *', checkPendingTasks);

  // 每30分钟：数据库健康检查
  cron.schedule('*/30 * * * *', checkDBHealth);

  // 每天上午9:00：证书过期预警扫描
  cron.schedule('0 9 * * *', scanCertificateExpiry, { timezone: 'Asia/Shanghai' });

  // 每天凌晨2:00：TNA 自动任务分配
  cron.schedule('0 2 * * *', autoAssignTnaTasks, { timezone: 'Asia/Shanghai' });

  // 启动时立即执行一次
  checkOverdueHazards();
  checkExpiredTickets();
  checkPendingTasks();
  scanCertificateExpiry();

  console.log('[SCHEDULER] ✅ 定时任务已就绪');
}
