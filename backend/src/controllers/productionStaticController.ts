import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getProductionStaticList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, archiveType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR archive_no LIKE ? OR code LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (archiveType) { where += ' AND archive_type = ?'; params.push(archiveType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM production_static_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM production_static_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getProductionStaticById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM production_static_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '档案不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createProductionStatic = asyncHandler(async (req: Request, res: Response) => {
  const { name, archiveType, code, specification, material, manufacturer, installDate, commissionDate, designLife, location, department, responsiblePerson, maintenanceCycle, remark } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '档案名称不能为空' });
  const conn = await getConnection();
  const archiveNo = `PS${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO production_static_archives (archive_no, name, archive_type, code, specification, material, manufacturer, install_date, commission_date, design_life, location, department, responsible_person, maintenance_cycle, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [archiveNo, name, archiveType || '', code || '', specification || '', material || '', manufacturer || '', installDate || null, commissionDate || null, designLife || 0, location || '', department || '', responsiblePerson || '', maintenanceCycle || 0, remark || '']
  );
  res.status(201).json({ success: true, message: '档案创建成功', data: { id: result.insertId, archiveNo } });
});

export const updateProductionStatic = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, archiveType, code, specification, material, manufacturer, installDate, commissionDate, designLife, location, department, responsiblePerson, lastMaintenanceDate, nextMaintenanceDate, maintenanceCycle, status, remark } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM production_static_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '档案不存在' });
  await conn.execute(
    `UPDATE production_static_archives SET name=?, archive_type=?, code=?, specification=?, material=?, manufacturer=?, install_date=?, commission_date=?, design_life=?, location=?, department=?, responsible_person=?, last_maintenance_date=?, next_maintenance_date=?, maintenance_cycle=?, status=?, remark=?, updated_at=NOW() WHERE id=?`,
    [name, archiveType || '', code || '', specification || '', material || '', manufacturer || '', installDate || null, commissionDate || null, designLife || 0, location || '', department || '', responsiblePerson || '', lastMaintenanceDate || null, nextMaintenanceDate || null, maintenanceCycle || 0, status ?? 1, remark || '', id]
  );
  res.json({ success: true, message: '档案更新成功' });
});

export const deleteProductionStatic = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM production_static_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '档案不存在' });
  await conn.execute('DELETE FROM production_static_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '档案已删除' });
});
