import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const getCertificateList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, userId, status } = req.query;
    conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (userId) { where += ' AND c.user_id = ?'; params.push(Number(userId)); }
    if (status) { where += ' AND c.status = ?'; params.push(Number(status)); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM certificates c ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT c.*, u.real_name as user_name, ct.name as cert_type_name FROM certificates c LEFT JOIN users u ON c.user_id = u.id LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id ${where} ORDER BY c.expire_date ASC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { userId, certTypeId, certName, issueDate, expireDate, issueAuthority, remark } = req.body;
    if (!userId || !issueDate || !expireDate) return res.status(400).json({ success: false, message: '用户、发证日期和到期日期不能为空' });
    conn = await getConnection();
    const certNo = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO certificates (cert_no, user_id, cert_type_id, cert_name, issue_date, expire_date, issue_authority, remark) VALUES (?,?,?,?,?,?,?,?)',
      [certNo, userId, certTypeId || null, certName || '', issueDate, expireDate, issueAuthority || '', remark || '']);
    res.status(201).json({ success: true, message: '证书创建成功', data: { id: result.insertId, certNo } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const renewCertificate = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { newExpireDate, issueAuthority } = req.body;
    conn = await getConnection();
    const [existing] = await conn.execute<RowDataPacket[]>('SELECT * FROM certificates WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ success: false, message: '证书不存在' });
    const old = existing[0];
    // 创建新证书
    const certNo = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO certificates (cert_no, user_id, cert_type_id, cert_name, issue_date, expire_date, issue_authority, is_renewed, renewed_from_id, status) VALUES (?,?,?,?,?,?,?,1,?,1)',
      [certNo, old.user_id, old.cert_type_id, old.cert_name, new Date().toISOString().split('T')[0], newExpireDate, issueAuthority || old.issue_authority, old.id]);
    // 标记旧证书
    await conn.execute('UPDATE certificates SET status = 4 WHERE id = ?', [old.id]);
    res.json({ success: true, message: '证书续期成功', data: { id: result.insertId, certNo } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '证书删除成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取即将过期的证书列表（红绿灯预警）
 * GET /api/training-v2/certificates/expiring?days=90&userId=
 */
export const getExpiringCertificates = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const days = Number(req.query.days) || 90;
    const userId = req.query.userId ? Number(req.query.userId) : (req as any).user?.userId;
    conn = await getConnection();

    let where = 'WHERE c.status = 1 AND c.expire_date IS NOT NULL AND DATEDIFF(c.expire_date, NOW()) <= ? AND DATEDIFF(c.expire_date, NOW()) >= 0';
    const params: any[] = [days];
    if (userId) { where += ' AND c.user_id = ?'; params.push(userId); }

    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT c.*, u.real_name AS user_name, u.department,
              ct.name AS cert_type_name,
              DATEDIFF(c.expire_date, NOW()) AS days_remaining
       FROM certificates c
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
       ${where} ORDER BY c.expire_date ASC`, params
    );

    const list = (rows as any[]).map(r => ({
      ...r,
      warningLevel: r.days_remaining <= 30 ? 'urgent' : r.days_remaining <= 60 ? 'warning' : 'notice',
    }));

    res.json({ success: true, data: list });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

/**
 * 证书统计概览
 * GET /api/training-v2/certificates/stats?userId=
 */
export const getCertificateStats = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = req.query.userId ? Number(req.query.userId) : (req as any).user?.userId;
    conn = await getConnection();

    let userFilter = '';
    const params: any[] = [];
    if (userId) { userFilter = ' AND c.user_id = ?'; params.push(userId); }

    const [validRows] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM certificates c WHERE c.status = 1 AND c.expire_date > NOW() ${userFilter}`, params
    );
    const [expiringRows] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM certificates c WHERE c.status = 1 AND DATEDIFF(c.expire_date, NOW()) BETWEEN 0 AND 90 ${userFilter}`, params
    );
    const [expiredRows] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM certificates c WHERE c.status != 4 AND (c.expire_date < NOW() OR c.status IN (2,3)) ${userFilter}`, params
    );

    res.json({
      success: true,
      data: {
        valid: (validRows[0] as any)?.cnt || 0,
        expiringSoon: (expiringRows[0] as any)?.cnt || 0,
        expired: (expiredRows[0] as any)?.cnt || 0,
      }
    });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

/**
 * 下载培训证书 PDF
 * GET /api/training/certificate/download?id=recordId
 *
 * 根据培训记录ID查询用户信息、课程/计划信息，
 * 使用 puppeteer-core + Chrome 生成 PDF 证书并返回下载。
 */
export const downloadCertificatePDF = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const recordId = Number(req.query.id);
    if (!recordId) {
      return res.status(400).json({ success: false, message: '培训记录ID不能为空' });
    }

    const userId = (req as any).user?.userId;
    conn = await getConnection();

    // 查询培训记录 + 用户信息 + 计划信息
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT r.*,
              u.real_name AS user_name,
              u.department,
              u.username,
              p.title AS plan_name,
              p.description AS plan_desc,
              p.instructor,
              p.hours AS course_hours,
              c.name AS course_name,
              c.duration AS course_duration,
              lp.is_completed,
              lp.completed_at
       FROM training_records r
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN training_plans p ON r.plan_id = p.id
       LEFT JOIN training_courses c ON r.course_id = c.id
       LEFT JOIN learning_progress lp ON lp.user_id = r.user_id AND lp.course_id = r.course_id
       WHERE r.id = ?${userId ? ' AND r.user_id = ?' : ''}`,
      userId ? [recordId, userId] : [recordId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: '培训记录不存在' });
    }

    const record = rows[0] as any;
    const completedAt = record.completed_at
      ? new Date(record.completed_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
      : new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    const issueDate = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });

    // HTML 证书模板
    const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<style>
  * { margin:0; padding:0; box-sizing: border-box; }
  body { font-family: "SimSun", "宋体", serif; background: #fff; }
  .cert-container {
    width: 800px;
    margin: 40px auto;
    border: 12px solid #c8a951;
    padding: 60px 80px;
    background: linear-gradient(135deg, #fffef5 0%, #fff9e6 100%);
    position: relative;
  }
  .cert-border {
    position: absolute;
    inset: 8px;
    border: 2px solid #c8a951;
    pointer-events: none;
  }
  .cert-inner-border {
    position: absolute;
    inset: 16px;
    border: 1px solid #e8d5a3;
    pointer-events: none;
  }
  .header {
    text-align: center;
    margin-bottom: 30px;
  }
  .company {
    font-size: 14px;
    color: #888;
    letter-spacing: 4px;
    margin-bottom: 8px;
  }
  .title {
    font-size: 36px;
    color: #8B6914;
    font-weight: bold;
    letter-spacing: 8px;
    margin-bottom: 8px;
  }
  .subtitle {
    font-size: 16px;
    color: #aaa;
    letter-spacing: 2px;
  }
  .divider {
    height: 2px;
    background: linear-gradient(to right, transparent, #c8a951, transparent);
    margin: 20px 0;
  }
  .content {
    text-align: center;
    font-size: 18px;
    color: #333;
    line-height: 2.2;
  }
  .content strong {
    color: #8B6914;
    font-size: 22px;
  }
  .course-info {
    margin: 30px 0;
    font-size: 16px;
    color: #555;
    line-height: 2;
  }
  .footer {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 14px;
    color: #888;
  }
  .footer-left { text-align: left; }
  .footer-right { text-align: right; }
  .seal {
    width: 80px;
    height: 80px;
    border: 2px solid #c8a951;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #8B6914;
    margin-top: 10px;
    margin-left: auto;
    font-weight: bold;
  }
  .qr-code { width: 60px; height: 60px; margin-top: 8px; }
  .watermark {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 80px;
    color: rgba(200,169,81,0.06);
    pointer-events: none;
    white-space: nowrap;
    z-index: 0;
  }
</style>
</head>
<body>
<div class="cert-container">
  <div class="cert-border"></div>
  <div class="cert-inner-border"></div>
  <div class="watermark">德州名将</div>
  
  <div class="header">
    <div class="company">德州名将工贸有限公司</div>
    <div class="title">培训合格证书</div>
    <div class="subtitle">TRAINING CERTIFICATE OF COMPLETION</div>
  </div>
  
  <div class="divider"></div>
  
  <div class="content">
    <p>兹证明 <strong>${record.user_name || record.username || '学员'}</strong></p>
    <p style="margin-top: 8px;">于 <strong>${completedAt}</strong> 圆满完成培训课程</p>
  </div>
  
  <div class="course-info">
    <p><strong>培训项目：</strong>${record.plan_name || record.course_name || '安全培训'}</p>
    <p><strong>培训内容：</strong>${record.plan_desc || record.course_name || ''}</p>
    <p><strong>培训时长：</strong>${record.course_hours || record.course_duration || 0} 学时</p>
    <p><strong>培训讲师：</strong>${record.instructor || '公司内部讲师'}</p>
    <p><strong>所在部门：</strong>${record.department || '—'}</p>
  </div>
  
  <div class="divider"></div>
  
  <div class="footer">
    <div class="footer-left">
      <div>证书编号：CERT-${record.id.toString().padStart(8, '0')}</div>
      <div>发证日期：${issueDate}</div>
    </div>
    <div class="footer-right">
      <div style="text-align:center">
        <div>德州名将工贸有限公司</div>
        <div>安全生产管理部门</div>
      </div>
      <div class="seal">公章</div>
    </div>
  </div>
</div>
</body>
</html>`;

    // 使用 puppeteer-core + Chrome 生成 PDF
    const puppeteer = require('puppeteer-core');
    const browser = await puppeteer.launch({
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: false,
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' }
    });

    await browser.close();

    const certName = record.plan_name || record.course_name || '培训';
    const safeName = certName.replace(/[\\/:*?"<>|]/g, '').substring(0, 20);
    const filename = `培训证书_${safeName}_${record.id}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
      'Content-Length': pdfBuffer.length
    });
    res.send(pdfBuffer);

  } catch (e) {
    next(e);
  } finally {
    if (conn) conn.release();
  }
};
