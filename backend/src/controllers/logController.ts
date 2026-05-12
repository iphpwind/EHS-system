import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface SystemLog extends RowDataPacket {
  id: number; user_id: number; action: string; module: string;
  content?: string; ip?: string; created_at: Date;
  user_name?: string;
}

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { page = 1, limit = 20, pageSize, module, username } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(pageSize || limit);
  const offset = (pageNum - 1) * limitNum;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (module) { where += ' AND l.module = ?'; params.push(module); }
  if (username) { where += ' AND (u.real_name LIKE ? OR l.user_id = ?)'; params.push(`%${username}%`, isNaN(Number(username)) ? 0 : Number(username)); }
  const [rows] = await conn.execute<SystemLog[]>(
    `SELECT l.*, u.real_name as username FROM system_logs l LEFT JOIN users u ON l.user_id=u.id ${where} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
    [...params, limitNum, offset]
  );
  const [c] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM system_logs l ' + where, params);
  res.json({
    success: true,
    data: {
      list: rows,
      pagination: { page: pageNum, pageSize: limitNum, total: c[0].total }
    }
  });
});

export const deleteLog = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM system_logs WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '日志已删除' });
});
