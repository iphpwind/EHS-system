import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getCertificateList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 20, userId, status } = req.query;
    const conn = await getConnection();
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
  } catch (e) { next(e); }
};

export const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, certTypeId, certName, issueDate, expireDate, issueAuthority, remark } = req.body;
    if (!userId || !issueDate || !expireDate) return res.status(400).json({ success: false, message: '用户、发证日期和到期日期不能为空' });
    const conn = await getConnection();
    const certNo = `CERT${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO certificates (cert_no, user_id, cert_type_id, cert_name, issue_date, expire_date, issue_authority, remark) VALUES (?,?,?,?,?,?,?,?)',
      [certNo, userId, certTypeId || null, certName || '', issueDate, expireDate, issueAuthority || '', remark || '']);
    res.status(201).json({ success: true, message: '证书创建成功', data: { id: result.insertId, certNo } });
  } catch (e) { next(e); }
};

export const renewCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { newExpireDate, issueAuthority } = req.body;
    const conn = await getConnection();
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
  } catch (e) { next(e); }
};

export const deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM certificates WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '证书删除成功' });
  } catch (e) { next(e); }
};

/**
 * 获取即将过期的证书列表（红绿灯预警）
 * GET /api/training-v2/certificates/expiring?days=90&userId=
 */
export const getExpiringCertificates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = Number(req.query.days) || 90;
    const userId = req.query.userId ? Number(req.query.userId) : (req as any).user?.userId;
    const conn = await getConnection();

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
  } catch (e) { next(e); }
};

/**
 * 证书统计概览
 * GET /api/training-v2/certificates/stats?userId=
 */
export const getCertificateStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.query.userId ? Number(req.query.userId) : (req as any).user?.userId;
    const conn = await getConnection();

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
  } catch (e) { next(e); }
};
