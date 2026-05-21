import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getKnowledgeList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, knowledgeType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (knowledgeType) { where += ' AND knowledge_type = ?'; params.push(knowledgeType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM safety_knowledge_base ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT id, knowledge_no, title, knowledge_type, category, tags, summary, source, view_count, like_count, status, created_by, created_at, updated_at FROM safety_knowledge_base ${where} ORDER BY view_count DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getKnowledgeById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM safety_knowledge_base WHERE id=?', [req.params.id]);
  if (!rows || rows.length===0) return res.status(404).json({ success:false, message:'知识条目不存在' });
  await conn.execute('UPDATE safety_knowledge_base SET view_count=view_count+1 WHERE id=?', [req.params.id]);
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createKnowledge = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { title, knowledgeType, category, tags, content, summary, source, referenceUrl, isPublic } = req.body;
  if (!title || !knowledgeType) return res.status(400).json({ success:false, message:'标题和类型不能为空' });
  try {
  conn = await getConnection();
  const knowledgeNo = `KB${Date.now()}`;
  const userId = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO safety_knowledge_base (knowledge_no, title, knowledge_type, category, tags, content, summary, source, reference_url, is_public, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [knowledgeNo, title, knowledgeType, category||'', tags||'', content||'', summary||'', source||'', referenceUrl||'', isPublic!==undefined?(isPublic?1:0):1, userId||null]
  );
  res.status(201).json({ success: true, data: { id: result.insertId, knowledgeNo } });
  } finally { if (conn) conn.release(); }
});

export const updateKnowledge = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const fields = req.body;
  try {
  conn = await getConnection();
  const fieldMap: Record<string,string> = { title:'title', knowledgeType:'knowledge_type', category:'category', tags:'tags', content:'content', summary:'summary', source:'source', referenceUrl:'reference_url', isPublic:'is_public', status:'status' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [k, v] of Object.entries(fields)) { if (fieldMap[k] && v!==undefined) { updateFields.push(`${fieldMap[k]}=?`); params.push(v); } }
  if (updateFields.length===0) return res.status(400).json({ success:false, message:'无更新字段' });
  params.push(id);
  await conn.execute(`UPDATE safety_knowledge_base SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteKnowledge = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM safety_knowledge_base WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
  } finally { if (conn) conn.release(); }
});

export const getKnowledgeStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total, SUM(view_count) as totalViews FROM safety_knowledge_base');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT knowledge_type, COUNT(*) as count FROM safety_knowledge_base WHERE status=1 GROUP BY knowledge_type');
  res.json({ success: true, data: { totalCount: total[0]?.total||0, totalViews: total[0]?.totalViews||0, byType } });
  } finally { if (conn) conn.release(); }
});

export const likeKnowledge = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('UPDATE safety_knowledge_base SET like_count=like_count+1 WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '点赞成功' });
  } finally { if (conn) conn.release(); }
});
