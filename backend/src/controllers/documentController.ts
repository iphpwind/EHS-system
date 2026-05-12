import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getDocList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, fileType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (title LIKE ? OR doc_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (fileType) { where += ' AND file_type = ?'; params.push(fileType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM document_management ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM document_management ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getDocById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM document_management WHERE id=?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '文件不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createDoc = asyncHandler(async (req: Request, res: Response) => {
  const { title, fileType, category, keywords, filePath, fileSize, fileFormat, version, issuingDepartment, effectiveDate, expiryDate, isPublic, description } = req.body;
  if (!title || !fileType) return res.status(400).json({ success: false, message: '标题和文件类型不能为空' });
  const conn = await getConnection();
  const docNo = `DOC${Date.now()}`;
  const userId = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO document_management (doc_no, title, file_type, category, keywords, file_path, file_size, file_format, version, issuing_department, issuer_id, effective_date, expiry_date, is_public, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [docNo, title, fileType, category || '', keywords || '', filePath || '', fileSize || 0, fileFormat || '', version || 'V1.0', issuingDepartment || '', userId || null, effectiveDate || null, expiryDate || null, isPublic !== undefined ? (isPublic?1:0) : 1, description || '']
  );
  res.status(201).json({ success: true, data: { id: result.insertId, docNo } });
});

export const updateDoc = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, fileType, category, keywords, filePath, version, issuingDepartment, effectiveDate, expiryDate, isPublic, status, description } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM document_management WHERE id=?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '文件不存在' });
  await conn.execute(
    `UPDATE document_management SET title=?, file_type=?, category=?, keywords=?, file_path=?, version=?, issuing_department=?, effective_date=?, expiry_date=?, is_public=?, status=?, description=?, updated_at=NOW() WHERE id=?`,
    [title, fileType, category||'', keywords||'', filePath||'', version||'V1.0', issuingDepartment||'', effectiveDate||null, expiryDate||null, isPublic!==undefined?(isPublic?1:0):1, status??1, description||'', id]
  );
  res.json({ success: true, message: '文件更新成功' });
});

export const deleteDoc = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM document_management WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '文件已删除' });
});

export const getDocStats = asyncHandler(async (_req: Request, res: Response) => {
  const conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM document_management');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT file_type, COUNT(*) as count FROM document_management WHERE status=1 GROUP BY file_type');
  const [expiring] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM document_management WHERE status=1 AND expiry_date IS NOT NULL AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  res.json({ success: true, data: { totalCount: total[0]?.total || 0, byType, expiringCount: expiring[0]?.count || 0 } });
});
