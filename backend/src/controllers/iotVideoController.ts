import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getDevices = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { keyword, status } = req.query;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR device_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM iot_video_devices ${where} ORDER BY created_at DESC`, params);
  const [totalRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM iot_video_devices');
  const [onlineRows] = await conn.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM iot_video_devices WHERE status='online'");
  const [offlineRows] = await conn.execute<RowDataPacket[]>("SELECT COUNT(*) as count FROM iot_video_devices WHERE status='offline'");
  res.json({
    success: true,
    data: rows,
    stats: { total: totalRows[0].total, online: onlineRows[0].count, offline: offlineRows[0].count, storage: 65 }
  });
  } finally { if (conn) conn.release(); }
});

export const createDevice = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { name, device_no, location, ip_address, channel_count, status, remark } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '设备名称不能为空' });
  await conn.execute<ResultSetHeader>(
    'INSERT INTO iot_video_devices (device_no, name, location, ip_address, channel_count, status, remark) VALUES (?,?,?,?,?,?,?)',
    [device_no || `VID${Date.now()}`, name, location || '', ip_address || '', channel_count || 1, status || 'online', remark || '']
  );
  res.status(201).json({ success: true, message: '创建成功' });
  } finally { if (conn) conn.release(); }
});

export const updateDevice = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { name, device_no, location, ip_address, channel_count, status, remark } = req.body;
  await conn.execute(
    'UPDATE iot_video_devices SET name=?, device_no=?, location=?, ip_address=?, channel_count=?, status=?, remark=? WHERE id=?',
    [name, device_no, location, ip_address, channel_count, status, remark, req.params.id]
  );
  res.json({ success: true, message: '更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteDevice = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM iot_video_devices WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '删除成功' });
  } finally { if (conn) conn.release(); }
});
