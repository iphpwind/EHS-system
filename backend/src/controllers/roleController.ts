import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface Role extends RowDataPacket {
  id: number; name: string; code: string; description?: string;
  permissions?: string; created_at: Date;
}

export const getRoles = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<Role[]>('SELECT * FROM roles ORDER BY id');
  res.json({ success: true, data: rows });
});

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, code, description, permissions = [] } = req.body;
  if (!name || !code) return res.status(400).json({ success: false, message: '角色名称和代码必填' });
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO roles (name, code, description, permissions) VALUES (?,?,?,?)',
    [name, code, description || null, JSON.stringify(permissions)]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '角色创建成功' });
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const { name, code, description, permissions } = req.body;
  const conn = await getConnection();
  await conn.execute('UPDATE roles SET name=?, code=?, description=?, permissions=? WHERE id=?',
    [name, code, description || null, JSON.stringify(permissions || []), req.params.id]);
  res.json({ success: true, message: '角色更新成功' });
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM roles WHERE id=? AND id > 5', [req.params.id]);
  res.json({ success: true, message: '角色删除成功' });
});
