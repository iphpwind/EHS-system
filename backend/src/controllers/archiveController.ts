import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface ArchivedPermit extends RowDataPacket {
  id: number; permit_no: string; work_type: string; status: string;
}

export const getArchivedPermits = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { page = 1, limit = 20, work_type } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  const params: any[] = [];
  let mainWhere = "WHERE p.status IN ('completed','cancelled')";
  let countWhere = "WHERE status IN ('completed','cancelled')";
  if (work_type) {
    mainWhere += ' AND p.work_type = ?';
    countWhere += ' AND work_type = ?';
    params.push(work_type);
  }
  const [rows] = await conn.execute<ArchivedPermit[]>(
    `SELECT p.*, u1.real_name as applicant_name, u2.real_name as approver_name FROM work_permits p 
     LEFT JOIN users u1 ON p.applicant_id=u1.id LEFT JOIN users u2 ON p.approver_id=u2.id 
     ${mainWhere} ORDER BY p.updated_at DESC LIMIT ? OFFSET ?`, [...params, Number(limit), offset]
  );
  const [c] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM work_permits ' + countWhere, params);
  res.json({ success: true, data: { list: rows, total: c[0].total, page: Number(page), limit: Number(limit) } });
  } finally { if (conn) conn.release(); }
});

export const getArchiveById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<ArchivedPermit[]>('SELECT * FROM work_permits WHERE id = ? AND status IN ("completed","cancelled")', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: '归档记录不存在' });
  const [measures] = await conn.execute('SELECT * FROM permit_measures WHERE permit_id = ?', [req.params.id]);
  const [logs] = await conn.execute('SELECT * FROM permit_process_log WHERE permit_id = ? ORDER BY action_time', [req.params.id]);
  res.json({ success: true, data: { ...rows[0], measures, logs } });
  } finally { if (conn) conn.release(); }
});

export const createArchive = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { permit_id } = req.body;
  if (!permit_id) return res.status(400).json({ success: false, message: '作业票ID必填' });
  try {
  conn = await getConnection();
  await conn.execute("UPDATE work_permits SET status='completed' WHERE id=? AND status='approved'", [permit_id]);
  res.json({ success: true, message: '作业票已归档' });
  } finally { if (conn) conn.release(); }
});

export const deleteArchive = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute("UPDATE work_permits SET status='cancelled' WHERE id=? AND status='completed'", [req.params.id]);
  res.json({ success: true, message: '归档已删除' });
  } finally { if (conn) conn.release(); }
});
