import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getAssessmentList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, assessmentType, grade } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (a.assessment_no LIKE ? OR u.real_name LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (assessmentType) { where += ' AND a.assessment_type = ?'; params.push(assessmentType); }
  if (grade) { where += ' AND a.grade = ?'; params.push(grade); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM employee_assessments a LEFT JOIN users u ON a.user_id=u.id ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT a.*, u.real_name as user_name, u.department FROM employee_assessments a LEFT JOIN users u ON a.user_id=u.id ${where} ORDER BY a.created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getAssessmentById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT a.*, u.real_name as user_name, u.department FROM employee_assessments a LEFT JOIN users u ON a.user_id=u.id WHERE a.id=?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '考核记录不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createAssessment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { userId, assessmentType, assessmentDate, safetyKnowledge, safetyOperation, safetyAttitude, violationCount, hiddenDangerFound, assessmentContent, improvementSuggestion } = req.body;
  if (!userId || !assessmentType) return res.status(400).json({ success: false, message: '被考核人和考核类型不能为空' });
  try {
  conn = await getConnection();
  const totalScore = ((safetyKnowledge || 0) + (safetyOperation || 0) + (safetyAttitude || 0)) / 3;
  let grade = '不合格';
  if (totalScore >= 90) grade = '优秀';
  else if (totalScore >= 80) grade = '良好';
  else if (totalScore >= 60) grade = '合格';
  const assessmentNo = `ASM${Date.now()}`;
  const userIdNum = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO employee_assessments (assessment_no, user_id, assessment_type, assessment_date, assessor_id, safety_knowledge, safety_operation, safety_attitude, violation_count, hidden_danger_found, total_score, grade, assessment_content, improvement_suggestion, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [assessmentNo, userId, assessmentType, assessmentDate || null, userIdNum || null, safetyKnowledge || 0, safetyOperation || 0, safetyAttitude || 0, violationCount || 0, hiddenDangerFound || 0, totalScore, grade, assessmentContent || '', improvementSuggestion || '']
  );
  res.status(201).json({ success: true, message: '考核记录创建成功', data: { id: result.insertId, assessmentNo, totalScore, grade } });
  } finally { if (conn) conn.release(); }
});

export const updateAssessment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const fields = req.body;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM employee_assessments WHERE id=?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '考核记录不存在' });
  const fieldMap: Record<string, string> = { safetyKnowledge: 'safety_knowledge', safetyOperation: 'safety_operation', safetyAttitude: 'safety_attitude', violationCount: 'violation_count', hiddenDangerFound: 'hidden_danger_found', assessmentContent: 'assessment_content', improvementSuggestion: 'improvement_suggestion', status: 'status' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (fieldMap[key] && value !== undefined) { updateFields.push(`${fieldMap[key]}=?`); params.push(value); }
  }
  params.push(id);
  await conn.execute(`UPDATE employee_assessments SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '考核记录更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteAssessment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM employee_assessments WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '考核记录已删除' });
  } finally { if (conn) conn.release(); }
});

export const getAssessmentStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total, AVG(total_score) as avgScore FROM employee_assessments');
  const [byGrade] = await conn.execute<RowDataPacket[]>('SELECT grade, COUNT(*) as count FROM employee_assessments GROUP BY grade');
  const [byMonth] = await conn.execute<RowDataPacket[]>("SELECT DATE_FORMAT(assessment_date,'%Y-%m') as month, COUNT(*) as count FROM employee_assessments WHERE assessment_date>=DATE_SUB(CURDATE(),INTERVAL 12 MONTH) GROUP BY month ORDER BY month");
  res.json({ success: true, data: { totalCount: total[0]?.total || 0, avgScore: total[0]?.avgScore || 0, gradeDistribution: byGrade, monthlyTrend: byMonth } });
  } finally { if (conn) conn.release(); }
});
