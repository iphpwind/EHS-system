import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface JsaAnalysis extends RowDataPacket {
  id: number;
  jsa_no: string;
  title: string;
  work_type: string;
  hazard_source?: string;
  hazard_control?: string;
  creator_id?: number;
  status: number;
  created_at: Date;
  updated_at: Date;
}

interface JsaLibrary extends RowDataPacket {
  id: number;
  work_type: string;
  work_step: string;
  hazard_desc?: string;
  risk_level: string;
  control_measures?: string;
  status: number;
}

export const getJsaAnalysisList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const { page = 1, limit = 20, work_type, status } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (work_type) { where += ' AND work_type = ?'; params.push(work_type); }
  if (status !== undefined && status !== '') { where += ' AND status = ?'; params.push(Number(status)); }
  const [rows] = await conn.execute<JsaAnalysis[]>(
    `SELECT * FROM jsa_analysis ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(limit), offset]
  );
  const [countRows] = await conn.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM jsa_analysis ${where}`, params
  );
  res.json({ success: true, data: { list: rows, total: countRows[0].total, page: Number(page), limit: Number(limit) } });
  } finally { if (conn) conn.release(); }
});

export const getJsaAnalysisById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<JsaAnalysis[]>('SELECT * FROM jsa_analysis WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: 'JSA分析记录不存在' });
  const [items] = await conn.execute<RowDataPacket[]>('SELECT * FROM jsa_record_items WHERE jsa_id = ? ORDER BY step_no', [req.params.id]);
  res.json({ success: true, data: { ...rows[0], items } });
  } finally { if (conn) conn.release(); }
});

export const createJsaAnalysis = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const userId = (req as any).user?.userId;
  const { title, work_type, hazard_source, hazard_control, items } = req.body;
  if (!title || !work_type) return res.status(400).json({ success: false, message: '标题和作业类型必填' });
  try {
  conn = await getConnection();
  await conn.beginTransaction();
  try {
    const jsaNo = 'JSA' + Date.now();
    const [result] = await conn.execute<ResultSetHeader>(
      'INSERT INTO jsa_analysis (jsa_no, title, work_type, hazard_source, hazard_control, creator_id, status) VALUES (?,?,?,?,?,?,1)',
      [jsaNo, title, work_type, hazard_source || null, hazard_control || null, userId]
    );
    const jsaId = result.insertId;
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        await conn.execute(
          'INSERT INTO jsa_record_items (jsa_id, step_no, work_step, hazard_desc, risk_level, control_measures) VALUES (?,?,?,?,?,?)',
          [jsaId, i + 1, item.work_step || '', item.hazard_desc || null, item.risk_level || 'low', item.control_measures || null]
        );
      }
    }
    await conn.commit();
    res.json({ success: true, data: { id: jsaId, jsa_no: jsaNo }, message: 'JSA分析创建成功' });
  } catch (e) {
    await conn.rollback();
    throw e;
  }
  } finally { if (conn) conn.release(); }
});

export const updateJsaAnalysis = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { title, work_type, hazard_source, hazard_control, status } = req.body;
  try {
  conn = await getConnection();
  await conn.execute(
    'UPDATE jsa_analysis SET title=?, work_type=?, hazard_source=?, hazard_control=?, status=? WHERE id=?',
    [title, work_type, hazard_source || null, hazard_control || null, status ?? 1, req.params.id]
  );
  res.json({ success: true, message: 'JSA分析更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteJsaAnalysis = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM jsa_record_items WHERE jsa_id = ?', [req.params.id]);
  await conn.execute('DELETE FROM jsa_analysis WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: 'JSA分析删除成功' });
  } finally { if (conn) conn.release(); }
});

export const approveJsaAnalysis = asyncHandler(async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('UPDATE jsa_analysis SET status=2 WHERE id=?', [req.params.id]);
    res.json({ success: true, message: 'JSA分析已批准' });
  } finally { if (conn) conn.release(); }
});
