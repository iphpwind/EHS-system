import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

// 获取培训记录列表
export const getTrainingRecords = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, planId, keyword, result, startDate, endDate } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (planId) { where += ' AND r.plan_id = ?'; params.push(planId); }
  if (keyword) { where += ' AND (tp.title LIKE ? OR u.real_name LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (result === 'pass') { where += ' AND r.is_passed = 1'; }
  else if (result === 'fail') { where += ' AND r.is_passed = 0'; }
  if (startDate) { where += ' AND r.created_at >= ?'; params.push(startDate); }
  if (endDate) { where += ' AND r.created_at <= ?'; params.push(endDate); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM training_records r LEFT JOIN training_plans tp ON r.plan_id = tp.id LEFT JOIN users u ON r.user_id = u.id ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT r.*, tp.title as trainingName, u.real_name as participant, u.department, r.attendance, r.exam_score as score, r.is_passed, r.certificate_no, r.certificate_valid_until, r.remarks, r.created_at
     FROM training_records r LEFT JOIN training_plans tp ON r.plan_id = tp.id LEFT JOIN users u ON r.user_id = u.id ${where}
     ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );
  res.json({ success: true, data: { list: rows.map((r: any) => ({ ...r, result: r.is_passed ? '合格' : '不合格' })), pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

// 获取单个培训记录
export const getTrainingRecordById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT r.*, tp.title as trainingName, u.real_name as participant, u.department
     FROM training_records r LEFT JOIN training_plans tp ON r.plan_id = tp.id LEFT JOIN users u ON r.user_id = u.id WHERE r.id = ?`, [id]
  );
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '培训记录不存在' });
  res.json({ success: true, data: rows[0] });
});

// 创建培训记录
export const createTrainingRecord = asyncHandler(async (req: Request, res: Response) => {
  const { planId, userId, attendance, examScore, isPassed, certificateNo, certificateValidUntil, remarks } = req.body;
  if (!planId || !userId) return res.status(400).json({ success: false, message: '培训计划和参加人不能为空' });
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO training_records (plan_id, user_id, attendance, exam_score, is_passed, certificate_no, certificate_valid_until, remarks, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [planId, userId, attendance || 0, examScore || 0, isPassed ? 1 : 0, certificateNo || null, certificateValidUntil || null, remarks || '']
  );
  res.status(201).json({ success: true, message: '培训记录创建成功', data: { id: result.insertId } });
});

// 更新培训记录
export const updateTrainingRecord = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { planId, userId, attendance, examScore, isPassed, certificateNo, certificateValidUntil, remarks } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM training_records WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '培训记录不存在' });
  await conn.execute(
    `UPDATE training_records SET plan_id = ?, user_id = ?, attendance = ?, exam_score = ?, is_passed = ?, certificate_no = ?, certificate_valid_until = ?, remarks = ?, updated_at = NOW() WHERE id = ?`,
    [planId, userId, attendance, examScore, isPassed ? 1 : 0, certificateNo, certificateValidUntil, remarks, id]
  );
  res.json({ success: true, message: '培训记录更新成功' });
});

// 删除培训记录
export const deleteTrainingRecord = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM training_records WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '培训记录不存在' });
  await conn.execute('DELETE FROM training_records WHERE id = ?', [id]);
  res.json({ success: true, message: '培训记录删除成功' });
});
