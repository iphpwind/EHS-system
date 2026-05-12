import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface MeasureLib extends RowDataPacket {
  id: number; work_type: string; measure_text: string; is_required: number; sort_order: number; status: number;
}

export const getMeasureLib = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { work_type } = req.query;
  let sql = 'SELECT * FROM permit_measure_lib WHERE status=1';
  const params: any[] = [];
  if (work_type) { sql += ' AND work_type = ?'; params.push(work_type); }
  sql += ' ORDER BY work_type, sort_order';
  const [rows] = await conn.execute<MeasureLib[]>(sql, params);
  res.json({ success: true, data: rows });
});

export const createMeasure = asyncHandler(async (req: Request, res: Response) => {
  const { work_type, measure_text, is_required = 1, sort_order = 0 } = req.body;
  if (!work_type || !measure_text) return res.status(400).json({ success: false, message: '作业类型和措施内容必填' });
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO permit_measure_lib (work_type, measure_text, is_required, sort_order, status) VALUES (?,?,?,?,1)',
    [work_type, measure_text, is_required, sort_order]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '安全措施创建成功' });
});

export const updateMeasure = asyncHandler(async (req: Request, res: Response) => {
  const { work_type, measure_text, is_required, sort_order, status } = req.body;
  const conn = await getConnection();
  await conn.execute(
    'UPDATE permit_measure_lib SET work_type=?, measure_text=?, is_required=?, sort_order=?, status=? WHERE id=?',
    [work_type, measure_text, is_required ?? 1, sort_order ?? 0, status ?? 1, req.params.id]
  );
  res.json({ success: true, message: '安全措施更新成功' });
});

export const deleteMeasure = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('UPDATE permit_measure_lib SET status=0 WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '安全措施已删除' });
});
