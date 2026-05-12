import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface Equipment extends RowDataPacket {
  id: number; equipment_no: string; name: string; type?: string;
  location?: string; department?: string; status: number;
}

export const getEquipmentList = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const pageSize = Number(req.query.pageSize) || 20;
  const { page = 1, limit, type, keyword, status: filterStatus } = req.query;
  const finalLimit = pageSize || Number(limit) || 20;
  const offset = (Number(page) - 1) * finalLimit;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (filterStatus === 'normal') { where += ' AND status = 1'; }
  else if (filterStatus === 'repair') { where += ' AND status = 2'; }
  else if (filterStatus === 'stopped') { where += ' AND status = 0'; }
  if (type) { where += ' AND type = ?'; params.push(type); }
  if (keyword) { where += ' AND (name LIKE ? OR equipment_no LIKE ?)'; params.push('%'+keyword+'%', '%'+keyword+'%'); }
  const [rows] = await conn.execute<Equipment[]>(`SELECT * FROM equipment ${where} ORDER BY id LIMIT ? OFFSET ?`, [...params, finalLimit, offset]);
  const [c] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM equipment ' + where, params);
  res.json({ success: true, data: { list: rows, pagination: { total: c[0].total, page: Number(page), pageSize: finalLimit } } });
});

export const getEquipmentById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<Equipment[]>('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ success: false, message: '设备不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { equipment_no, name, type, model, manufacturer, install_date, location, department, responsible_person, maintenance_cycle } = req.body;
  if (!equipment_no || !name) return res.status(400).json({ success: false, message: '设备编号和名称必填' });
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO equipment (equipment_no,name,type,model,manufacturer,install_date,location,department,responsible_person,maintenance_cycle,status) VALUES (?,?,?,?,?,?,?,?,?,?,1)',
    [equipment_no, name, type || null, model || null, manufacturer || null, install_date || null, location || null, department || null, responsible_person || null, maintenance_cycle || null]
  );
  res.json({ success: true, data: { id: result.insertId }, message: '设备创建成功' });
});

export const updateEquipment = asyncHandler(async (req: Request, res: Response) => {
  const { equipment_no, name, type, model, manufacturer, install_date, location, department, responsible_person, maintenance_cycle, status } = req.body;
  const conn = await getConnection();
  await conn.execute(
    'UPDATE equipment SET equipment_no=?,name=?,type=?,model=?,manufacturer=?,install_date=?,location=?,department=?,responsible_person=?,maintenance_cycle=?,status=? WHERE id=?',
    [equipment_no, name, type || null, model || null, manufacturer || null, install_date || null, location || null, department || null, responsible_person || null, maintenance_cycle || null, status ?? 1, req.params.id]
  );
  res.json({ success: true, message: '设备更新成功' });
});

export const deleteEquipment = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('UPDATE equipment SET status=0 WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '设备已删除' });
});
