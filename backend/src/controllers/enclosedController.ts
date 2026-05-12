import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { keyword, status } = req.query;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR device_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM enclosed_devices ${where} ORDER BY created_at DESC`, params);
  const [totalRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM enclosed_devices');
  const [onlineRows] = await conn.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM enclosed_devices WHERE status='online'");
  const [offlineRows] = await conn.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM enclosed_devices WHERE status='offline'");
  res.json({
    success: true,
    data: rows,
    stats: { total: totalRows[0].total, online: onlineRows[0].count, offline: offlineRows[0].count, today: 0 }
  });
});

export const createDevice = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { name, device_no, location, device_type, status, remark } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '设备名称不能为空' });
  await conn.execute<ResultSetHeader>(
    'INSERT INTO enclosed_devices (device_no, name, location, device_type, status, remark) VALUES (?,?,?,?,?,?)',
    [device_no || `ENC${Date.now()}`, name, location || '', device_type || 'face', status || 'online', remark || '']
  );
  res.status(201).json({ success: true, message: '创建成功' });
});

export const updateDevice = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { name, device_no, location, device_type, status, remark } = req.body;
  await conn.execute(
    'UPDATE enclosed_devices SET name=?, device_no=?, location=?, device_type=?, status=?, remark=? WHERE id=?',
    [name, device_no, location, device_type, status, remark, req.params.id]
  );
  res.json({ success: true, message: '更新成功' });
});

export const deleteDevice = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM enclosed_devices WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '删除成功' });
});
