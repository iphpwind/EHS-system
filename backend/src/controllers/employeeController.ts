import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface Employee extends RowDataPacket {
  id: number; username: string; name: string; department: string;
  position?: string; phone?: string; email?: string; status: number;
}

export const getEmployees = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const pageSize = Number(req.query.pageSize) || 20;
  const { page = 1, limit, department, keyword, status: filterStatus } = req.query;
  const finalLimit = pageSize || Number(limit) || 20;
  const offset = (Number(page) - 1) * finalLimit;
  let where = 'WHERE role>=4'; const params: any[] = [];
  if (filterStatus === 'active') { where += ' AND status = 1'; }
  else if (filterStatus === 'leave') { where += ' AND status = 2'; }
  else if (filterStatus === 'resigned') { where += ' AND status = 0'; }
  else { where += ' AND status >= 0'; }
  if (department) { where += ' AND department = ?'; params.push(department); }
  if (keyword) { where += ' AND (real_name LIKE ? OR username LIKE ?)'; params.push('%'+keyword+'%', '%'+keyword+'%'); }
  const [rows] = await conn.execute<Employee[]>(`SELECT id,username,real_name as name,department,position,phone,email,created_at FROM users ${where} ORDER BY id LIMIT ? OFFSET ?`, [...params, finalLimit, offset]);
  const [c] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM users ' + where, params);
  res.json({ success: true, data: { list: rows, pagination: { total: c[0].total, page: Number(page), pageSize: finalLimit } } });
});

export const getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<Employee[]>('SELECT id,username,real_name as name,department,position,phone,email FROM users WHERE id=? AND status=1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: '员工不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { username, name, password, department, position, phone, email } = req.body;
  if (!username || !name || !password) return res.status(400).json({ success: false, message: '用户名、姓名、密码必填' });
  const conn = await getConnection();
  const bcrypt = require('bcrypt');
  const hash = await bcrypt.hash(password, 10);
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO users (username,real_name,password,department,position,phone,email,role,status) VALUES (?,?,?,?,?,?,?,4,1)',
    [username, name, hash, department || null, position || null, phone || null, email || null]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '员工创建成功' });
});

export const updateEmployee = asyncHandler(async (req: Request, res: Response) => {
  const { name, department, position, phone, email, password } = req.body;
  const conn = await getConnection();
  if (password) {
    const bcrypt = require('bcrypt'); const hash = await bcrypt.hash(password, 10);
    await conn.execute('UPDATE users SET real_name=?,department=?,position=?,phone=?,email=?,password=? WHERE id=? AND role>=4', [name, department || null, position || null, phone || null, email || null, hash, req.params.id]);
  } else {
    await conn.execute('UPDATE users SET real_name=?,department=?,position=?,phone=?,email=? WHERE id=? AND role>=4', [name, department || null, position || null, phone || null, email || null, req.params.id]);
  }
  res.json({ success: true, message: '员工更新成功' });
});

export const deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('UPDATE users SET status=0 WHERE id=? AND role>=4', [req.params.id]);
  res.json({ success: true, message: '员工已删除' });
});
