import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getPatrolPlans = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { keyword, type, status } = req.query;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR plan_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (type) { where += ' AND type = ?'; params.push(type); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM patrol_plans ${where} ORDER BY created_at DESC`, params);
  res.json({ success: true, data: rows });
});

export const createPatrolPlan = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { name, type, frequency, executor, points, content, status } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '计划名称不能为空' });
  const planNo = `PL${Date.now()}`;
  await conn.execute<ResultSetHeader>(
    'INSERT INTO patrol_plans (plan_no, name, type, frequency, executor, points, content, status) VALUES (?,?,?,?,?,?,?,?)',
    [planNo, name, type || 'daily', frequency || '每日', executor || '', points || '', content || '', status || 'active']
  );
  res.status(201).json({ success: true, message: '创建成功' });
});

export const updatePatrolPlan = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { name, type, frequency, executor, points, content, status } = req.body;
  await conn.execute(
    'UPDATE patrol_plans SET name=?, type=?, frequency=?, executor=?, points=?, content=?, status=? WHERE id=?',
    [name, type, frequency, executor, points, content, status, req.params.id]
  );
  res.json({ success: true, message: '更新成功' });
});

export const deletePatrolPlan = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM patrol_plans WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '删除成功' });
});
