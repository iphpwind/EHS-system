import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getHealthList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, healthType } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (h.record_no LIKE ? OR u.real_name LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (healthType) { where += ' AND h.health_type = ?'; params.push(healthType); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM occupational_health h LEFT JOIN users u ON h.user_id=u.id ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT h.*, u.real_name as user_name, u.department FROM occupational_health h LEFT JOIN users u ON h.user_id=u.id ${where} ORDER BY h.checkup_date DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getHealthById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT h.*, u.real_name as user_name, u.department FROM occupational_health h LEFT JOIN users u ON h.user_id=u.id WHERE h.id=?', [req.params.id]);
  if (!rows || rows.length===0) return res.status(404).json({ success:false, message:'记录不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createHealth = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { userId, healthType, checkupDate, checkupOrganization, checkupResult, hazardFactors, isNormal, abnormalFindings, medicalAdvice, nextCheckupDate, remark } = req.body;
  if (!userId || !healthType) return res.status(400).json({ success:false, message:'员工和体检类型不能为空' });
  try {
  conn = await getConnection();
  const recordNo = `OH${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO occupational_health (record_no, user_id, health_type, checkup_date, checkup_organization, checkup_result, hazard_factors, is_normal, abnormal_findings, medical_advice, next_checkup_date, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [recordNo, userId, healthType, checkupDate||null, checkupOrganization||'', checkupResult||'', hazardFactors||'', isNormal!==undefined?(isNormal?1:0):1, abnormalFindings||'', medicalAdvice||'', nextCheckupDate||null, remark||'']
  );
  res.status(201).json({ success: true, data: { id: result.insertId, recordNo } });
  } finally { if (conn) conn.release(); }
});

export const updateHealth = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { userId, healthType, checkupDate, checkupOrganization, checkupResult, hazardFactors, isNormal, abnormalFindings, medicalAdvice, nextCheckupDate, remark } = req.body;
  try {
  conn = await getConnection();
  await conn.execute(
    `UPDATE occupational_health SET user_id=?, health_type=?, checkup_date=?, checkup_organization=?, checkup_result=?, hazard_factors=?, is_normal=?, abnormal_findings=?, medical_advice=?, next_checkup_date=?, remark=?, updated_at=NOW() WHERE id=?`,
    [userId, healthType, checkupDate||null, checkupOrganization||'', checkupResult||'', hazardFactors||'', isNormal!==undefined?(isNormal?1:0):1, abnormalFindings||'', medicalAdvice||'', nextCheckupDate||null, remark||'', id]
  );
  res.json({ success: true, message: '更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteHealth = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM occupational_health WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
  } finally { if (conn) conn.release(); }
});

export const getHealthStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total, SUM(IF(is_normal=0,1,0)) as abnormal FROM occupational_health');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT health_type, COUNT(*) as count FROM occupational_health GROUP BY health_type');
  const [upcoming] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM occupational_health WHERE next_checkup_date IS NOT NULL AND next_checkup_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  res.json({ success: true, data: { totalCount: total[0]?.total||0, abnormalCount: total[0]?.abnormal||0, byType, upcomingCheckup: upcoming[0]?.count||0 } });
  } finally { if (conn) conn.release(); }
});
