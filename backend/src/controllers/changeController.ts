import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getChangeList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, changeType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (change_title LIKE ? OR change_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (changeType) { where += ' AND change_type = ?'; params.push(changeType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM change_management ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT c.*, u1.real_name as applicant_name FROM change_management c LEFT JOIN users u1 ON c.applicant_id=u1.id ${where} ORDER BY c.created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getChangeById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT c.*, u1.real_name as applicant_name, u2.real_name as reviewer_name, u3.real_name as approver_name FROM change_management c LEFT JOIN users u1 ON c.applicant_id=u1.id LEFT JOIN users u2 ON c.reviewer_id=u2.id LEFT JOIN users u3 ON c.approver_id=u3.id WHERE c.id=?', [req.params.id]);
  if (!rows || rows.length===0) return res.status(404).json({ success:false, message:'变更记录不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createChange = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { changeTitle, changeType, changeLevel, description, reason, riskAssessment, safetyMeasures, implementationPlan } = req.body;
  if (!changeTitle || !changeType) return res.status(400).json({ success:false, message:'变更标题和类型不能为空' });
  try {
  conn = await getConnection();
  const changeNo = `CHG${Date.now()}`;
  const userId = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO change_management (change_no, change_title, change_type, change_level, applicant_id, apply_date, description, reason, risk_assessment, safety_measures, implementation_plan, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
    [changeNo, changeTitle, changeType, changeLevel||'', userId||null, description||'', reason||'', riskAssessment||'', safetyMeasures||'', implementationPlan||'']
  );
  res.status(201).json({ success: true, data: { id: result.insertId, changeNo } });
  } finally { if (conn) conn.release(); }
});

export const updateChangeStatus = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { status, reviewComment, approvalComment, reviewerId, approverId, implementer, implementDate, completionDate, verificationResult } = req.body;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM change_management WHERE id=?', [id]);
  if (!existing || existing.length===0) return res.status(404).json({ success:false, message:'变更不存在' });
  const fieldMap: Record<string,string> = { status:'status', reviewComment:'review_comment', approvalComment:'approval_comment', reviewerId:'reviewer_id', approverId:'approver_id', implementer:'implementer', implementDate:'implement_date', completionDate:'completion_date', verificationResult:'verification_result' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [k, v] of Object.entries(req.body)) { if (fieldMap[k] && v!==undefined) { updateFields.push(`${fieldMap[k]}=?`); params.push(v); } }
  if (updateFields.length===0) return res.status(400).json({ success:false, message:'无更新字段' });
  const now = new Date();
  if (status==='reviewing') { updateFields.push('review_date=?'); params.push(now); }
  if (status==='approved') { updateFields.push('approval_date=?'); params.push(now); }
  params.push(id);
  await conn.execute(`UPDATE change_management SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '状态更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteChange = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM change_management WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
  } finally { if (conn) conn.release(); }
});

export const getChangeStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM change_management');
  const [byStatus] = await conn.execute<RowDataPacket[]>('SELECT status, COUNT(*) as count FROM change_management GROUP BY status');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT change_type, COUNT(*) as count FROM change_management GROUP BY change_type');
  res.json({ success: true, data: { totalCount: total[0]?.total||0, byStatus, byType } });
  } finally { if (conn) conn.release(); }
});
