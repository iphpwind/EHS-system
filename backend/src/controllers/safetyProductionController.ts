import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getSafetyArchiveList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, archiveType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (title LIKE ? OR doc_no LIKE ? OR keywords LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (archiveType) { where += ' AND archive_type = ?'; params.push(archiveType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM safety_production_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM safety_production_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getSafetyArchiveById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM safety_production_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '文档不存在' });
  // 增加浏览次数
  await conn.execute('UPDATE safety_production_archives SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);
  res.json({ success: true, data: rows[0] });
});

export const createSafetyArchive = asyncHandler(async (req: Request, res: Response) => {
  const { title, archiveType, archiveCategory, issuingDepartment, effectiveDate, expiryDate, signingAuthority, docLevel, fileUrl, keywords, contentSummary, isPublic } = req.body;
  if (!title || !archiveType) return res.status(400).json({ success: false, message: '标题和类型不能为空' });
  const userId = (req as any).user?.userId;
  const conn = await getConnection();
  const docNo = `SA${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO safety_production_archives (doc_no, title, archive_type, archive_category, issuing_department, effective_date, expiry_date, signing_authority, doc_level, file_url, keywords, content_summary, is_public, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [docNo, title, archiveType, archiveCategory || '', issuingDepartment || '', effectiveDate || null, expiryDate || null, signingAuthority || '', docLevel || '', fileUrl || '', keywords || '', contentSummary || '', isPublic !== undefined ? (isPublic ? 1 : 0) : 1, userId || null]
  );
  res.status(201).json({ success: true, message: '文档创建成功', data: { id: result.insertId, docNo } });
});

export const updateSafetyArchive = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, archiveType, archiveCategory, issuingDepartment, effectiveDate, expiryDate, signingAuthority, docLevel, fileUrl, keywords, contentSummary, isPublic, status } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM safety_production_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '文档不存在' });
  await conn.execute(
    `UPDATE safety_production_archives SET title=?, archive_type=?, archive_category=?, issuing_department=?, effective_date=?, expiry_date=?, signing_authority=?, doc_level=?, file_url=?, keywords=?, content_summary=?, is_public=?, status=?, updated_at=NOW() WHERE id=?`,
    [title, archiveType, archiveCategory || '', issuingDepartment || '', effectiveDate || null, expiryDate || null, signingAuthority || '', docLevel || '', fileUrl || '', keywords || '', contentSummary || '', isPublic !== undefined ? (isPublic ? 1 : 0) : 1, status ?? 1, id]
  );
  res.json({ success: true, message: '文档更新成功' });
});

export const deleteSafetyArchive = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM safety_production_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '文档不存在' });
  await conn.execute('DELETE FROM safety_production_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '文档已删除' });
});

export const getSafetyArchiveStats = asyncHandler(async (_req: Request, res: Response) => {
  const conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM safety_production_archives');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT archive_type, COUNT(*) as count FROM safety_production_archives WHERE status=1 GROUP BY archive_type ORDER BY count DESC');
  const [expiring] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM safety_production_archives WHERE status=1 AND expiry_date IS NOT NULL AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  res.json({ success: true, data: { totalCount: total[0]?.total || 0, byType, expiringCount: expiring[0]?.count || 0 } });
});
