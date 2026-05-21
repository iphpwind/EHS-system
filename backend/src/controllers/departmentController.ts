import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface Department extends RowDataPacket {
  id: number; name: string; parent_id: number; leader?: string; sort: number; status: number;
}

export const getDepartments = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<Department[]>('SELECT * FROM departments WHERE status=1 ORDER BY sort, id');
  res.json({ success: true, data: rows });
  } finally { if (conn) conn.release(); }
});

export const createDepartment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { name, parent_id = 0, leader, sort = 0 } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '部门名称必填' });
  try {
  conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO departments (name, parent_id, leader, sort, status) VALUES (?,?,?,?,1)',
    [name, parent_id, leader || null, sort]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '部门创建成功' });
  } finally { if (conn) conn.release(); }
});

export const updateDepartment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { name, parent_id, leader, sort, status } = req.body;
  try {
  conn = await getConnection();
  await conn.execute('UPDATE departments SET name=?, parent_id=?, leader=?, sort=?, status=? WHERE id=?',
    [name, parent_id ?? 0, leader || null, sort ?? 0, status ?? 1, req.params.id]);
  res.json({ success: true, message: '部门更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteDepartment = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('UPDATE departments SET status=0 WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '部门已删除' });
  } finally { if (conn) conn.release(); }
});
