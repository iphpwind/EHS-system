import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getMeetingList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, contentType, publishStatus } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND title LIKE ?'; params.push(`%${keyword}%`); }
  if (contentType) { where += ' AND content_type = ?'; params.push(contentType); }
  if (publishStatus !== undefined) { where += ' AND publish_status = ?'; params.push(publishStatus); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM meetings_announcements ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM meetings_announcements ${where} ORDER BY is_top DESC, created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getMeetingById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM meetings_announcements WHERE id=?', [req.params.id]);
  if (!rows || rows.length===0) return res.status(404).json({ success:false, message:'不存在' });
  await conn.execute('UPDATE meetings_announcements SET read_count=read_count+1 WHERE id=?', [req.params.id]);
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createMeeting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { contentType, title, content, meetingDate, meetingLocation, organizer, participants, minutes, priority, isTop, publishDate, publishStatus } = req.body;
  if (!title || !contentType) return res.status(400).json({ success:false, message:'标题和类型不能为空' });
  try {
  conn = await getConnection();
  const userId = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO meetings_announcements (content_type, title, content, meeting_date, meeting_location, organizer, participants, minutes, priority, is_top, publish_date, publish_status, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [contentType, title, content||'', meetingDate||null, meetingLocation||'', organizer||'', participants?JSON.stringify(participants):null, minutes||'', priority||'normal', isTop?1:0, publishDate||null, publishStatus!==undefined?publishStatus:0, userId||null]
  );
  res.status(201).json({ success: true, data: { id: result.insertId } });
  } finally { if (conn) conn.release(); }
});

export const updateMeeting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const fields = req.body;
  try {
  conn = await getConnection();
  const fieldMap: Record<string,string> = { title:'title', contentType:'content_type', content:'content', meetingDate:'meeting_date', meetingLocation:'meeting_location', organizer:'organizer', participants:'participants', minutes:'minutes', priority:'priority', isTop:'is_top', publishDate:'publish_date', publishStatus:'publish_status' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [k, v] of Object.entries(fields)) {
    if (fieldMap[k] && v!==undefined) { updateFields.push(`${fieldMap[k]}=?`); params.push(k==='participants'?JSON.stringify(v):v); }
  }
  if (updateFields.length===0) return res.status(400).json({ success:false, message:'无更新字段' });
  params.push(id);
  await conn.execute(`UPDATE meetings_announcements SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteMeeting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  await conn.execute('DELETE FROM meetings_announcements WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
  } finally { if (conn) conn.release(); }
});
