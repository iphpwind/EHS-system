import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getAreaList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, areaType } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR area_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (areaType) { where += ' AND area_type = ?'; params.push(areaType); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM area_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM area_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getAreaById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM area_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '区域不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createArea = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { name, areaType, parentId, location, areaSize, floor, fireLevel, explosionHazard, responsibleDepartment, responsiblePerson, contactPhone, safetyLevel, remark } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '区域名称不能为空' });
  try {
  conn = await getConnection();
  const areaNo = `AREA${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO area_archives (area_no, name, area_type, parent_id, location, area_size, floor, fire_level, explosion_hazard, responsible_department, responsible_person, contact_phone, safety_level, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [areaNo, name, areaType || '', parentId || 0, location || '', areaSize || 0, floor || '', fireLevel || '', explosionHazard || '', responsibleDepartment || '', responsiblePerson || '', contactPhone || '', safetyLevel || '', remark || '']
  );
  res.status(201).json({ success: true, message: '区域创建成功', data: { id: result.insertId, areaNo } });
  } finally { if (conn) conn.release(); }
});

export const updateArea = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { name, areaType, parentId, location, areaSize, floor, fireLevel, explosionHazard, responsibleDepartment, responsiblePerson, contactPhone, safetyLevel, status, remark } = req.body;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM area_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '区域不存在' });
  await conn.execute(
    `UPDATE area_archives SET name=?, area_type=?, parent_id=?, location=?, area_size=?, floor=?, fire_level=?, explosion_hazard=?, responsible_department=?, responsible_person=?, contact_phone=?, safety_level=?, status=?, remark=?, updated_at=NOW() WHERE id=?`,
    [name, areaType || '', parentId || 0, location || '', areaSize || 0, floor || '', fireLevel || '', explosionHazard || '', responsibleDepartment || '', responsiblePerson || '', contactPhone || '', safetyLevel || '', status ?? 1, remark || '', id]
  );
  res.json({ success: true, message: '区域更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteArea = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM area_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '区域不存在' });
  await conn.execute('DELETE FROM area_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '区域已删除' });
  } finally { if (conn) conn.release(); }
});

export const getAreaTree = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM area_archives WHERE status=1 ORDER BY area_type, name');
  const tree = buildTree(rows as any[]);
  res.json({ success: true, data: tree });
  } finally { if (conn) conn.release(); }
});

function buildTree(items: any[], parentId = 0): any[] {
  return items.filter(item => item.parent_id === parentId).map(item => ({
    ...item,
    children: buildTree(items, item.id)
  }));
}
