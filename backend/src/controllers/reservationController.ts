import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface Reservation extends RowDataPacket {
  id: number; reservation_no: string; work_type: string; work_location?: string;
  plan_start?: string; plan_end?: string; applicant_id: number; status: string;
}

export const getReservations = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { page = 1, limit = 20, status, work_type } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let mainWhere = 'WHERE 1=1'; let countWhere = 'WHERE 1=1'; const params: any[] = [];
  if (status) { mainWhere += ' AND r.status = ?'; countWhere += ' AND status = ?'; params.push(status); }
  if (work_type) { mainWhere += ' AND r.work_type = ?'; countWhere += ' AND work_type = ?'; params.push(work_type); }
  const [rows] = await conn.execute<Reservation[]>(`SELECT r.*, u.real_name as applicant_name FROM permit_reservations r LEFT JOIN users u ON r.applicant_id=u.id ${mainWhere} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]);
  const [c] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM permit_reservations ' + countWhere, params);
  res.json({ success: true, data: { list: rows, total: c[0].total, page: Number(page), limit: Number(limit) } });
  } finally { if (conn) conn.release(); }
});

export const getReservationById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<Reservation[]>('SELECT * FROM permit_reservations WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: '预约不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createReservation = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const userId = (req as any).user?.userId;
  const { work_type, work_location, work_content, plan_start, plan_end } = req.body;
  if (!work_type) return res.status(400).json({ success: false, message: '作业类型必填' });
  try {
  conn = await getConnection();
  const rno = 'R' + Date.now();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO permit_reservations (reservation_no, work_type, work_location, work_content, plan_start, plan_end, applicant_id, status) VALUES (?,?,?,?,?,?,?,?)',
    [rno, work_type, work_location || null, work_content || null, plan_start || null, plan_end || null, userId, 'pending']
  );
  res.json({ success: true, data: { id: result.insertId, reservation_no: rno }, message: '预约创建成功' });
  } finally { if (conn) conn.release(); }
});

export const updateReservation = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { work_type, work_location, work_content, plan_start, plan_end } = req.body;
  try {
  conn = await getConnection();
  await conn.execute('UPDATE permit_reservations SET work_type=?, work_location=?, work_content=?, plan_start=?, plan_end=? WHERE id=? AND status=?',
    [work_type, work_location || null, work_content || null, plan_start || null, plan_end || null, req.params.id, 'pending']);
  res.json({ success: true, message: '预约更新成功' });
  } finally { if (conn) conn.release(); }
});

export const approveReservation = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const userId = (req as any).user?.userId;
  try {
  conn = await getConnection();
  await conn.execute("UPDATE permit_reservations SET status='approved', approver_id=?, approved_at=NOW() WHERE id=? AND status='pending'", [userId, req.params.id]);
  res.json({ success: true, message: '预约已批准' });
  } finally { if (conn) conn.release(); }
});

export const rejectReservation = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { reason } = req.body;
  try {
  conn = await getConnection();
  await conn.execute("UPDATE permit_reservations SET status='rejected', reject_reason=? WHERE id=? AND status='pending'", [reason || null, req.params.id]);
  res.json({ success: true, message: '预约已拒绝' });
  } finally { if (conn) conn.release(); }
});

export const deleteReservation = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute("DELETE FROM permit_reservations WHERE id=? AND status IN ('pending','rejected')", [req.params.id]);
  res.json({ success: true, message: '预约已删除' });
  } finally { if (conn) conn.release(); }
});
