import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface ProcessLog extends RowDataPacket {
  id: number; permit_id: number; action_type: string; action_time: string;
  operator_id: number; description?: string; photos?: string;
}

export const getProcessLogs = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const permitId = req.query.permit_id || req.params.id;
  let sql = 'SELECT l.*, u.real_name as operator_name FROM permit_process_log l LEFT JOIN users u ON l.operator_id=u.id WHERE 1=1';
  const params: any[] = [];
  if (permitId) { sql += ' AND l.permit_id = ?'; params.push(permitId); }
  sql += ' ORDER BY l.action_time DESC';
  const [rows] = await conn.execute<ProcessLog[]>(sql, params);
  res.json({ success: true, data: rows });
});

export const createProcessLog = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { permit_id, action_type, action_time, description, photos } = req.body;
  if (!permit_id || !action_type) return res.status(400).json({ success: false, message: '作业票ID和操作类型必填' });
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO permit_process_log (permit_id, action_type, action_time, operator_id, description, photos) VALUES (?,?,?,?,?,?)',
    [permit_id, action_type, action_time || new Date(), userId, description || null, photos ? JSON.stringify(photos) : null]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '过程记录创建成功' });
});

export const deleteProcessLog = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM permit_process_log WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '过程记录删除成功' });
});
