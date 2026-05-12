import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getChemicalList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, dangerType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR chemical_no LIKE ? OR cas_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (dangerType) { where += ' AND danger_type = ?'; params.push(dangerType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM chemical_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM chemical_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getChemicalById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM chemical_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '化学品不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createChemical = asyncHandler(async (req: Request, res: Response) => {
  const { name, alias, casNo, formula, dangerType, dangerLevel, physicalState, flashPoint, meltingPoint, boilingPoint, density, explosionLimit, toxicity, hazardStatement, precautionaryStatement, storageCondition, emergencyMeasure, department, responsiblePerson, quantity, maxStorage, manufacturer, supplier, validUntil, remark } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '化学品名称不能为空' });
  const conn = await getConnection();
  const chemicalNo = `CHEM${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO chemical_archives (chemical_no, name, alias, cas_no, formula, danger_type, danger_level, physical_state, flash_point, melting_point, boiling_point, density, explosion_limit, toxicity, hazard_statement, precautionary_statement, storage_condition, emergency_measure, department, responsible_person, quantity, max_storage, manufacturer, supplier, valid_until, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [chemicalNo, name, alias || '', casNo || '', formula || '', dangerType || '', dangerLevel || '', physicalState || '', flashPoint || '', meltingPoint || '', boilingPoint || '', density || '', explosionLimit || '', toxicity || '', hazardStatement || '', precautionaryStatement || '', storageCondition || '', emergencyMeasure || '', department || '', responsiblePerson || '', quantity || 0, maxStorage || 0, manufacturer || '', supplier || '', validUntil || null, remark || '']
  );
  res.status(201).json({ success: true, message: '化学品创建成功', data: { id: result.insertId, chemicalNo } });
});

export const updateChemical = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, alias, casNo, formula, dangerType, dangerLevel, physicalState, flashPoint, meltingPoint, boilingPoint, density, explosionLimit, toxicity, hazardStatement, precautionaryStatement, storageCondition, emergencyMeasure, department, responsiblePerson, quantity, maxStorage, manufacturer, supplier, validUntil, status, remark } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM chemical_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '化学品不存在' });
  await conn.execute(
    `UPDATE chemical_archives SET name=?, alias=?, cas_no=?, formula=?, danger_type=?, danger_level=?, physical_state=?, flash_point=?, melting_point=?, boiling_point=?, density=?, explosion_limit=?, toxicity=?, hazard_statement=?, precautionary_statement=?, storage_condition=?, emergency_measure=?, department=?, responsible_person=?, quantity=?, max_storage=?, manufacturer=?, supplier=?, valid_until=?, status=?, remark=?, updated_at=NOW() WHERE id=?`,
    [name, alias || '', casNo || '', formula || '', dangerType || '', dangerLevel || '', physicalState || '', flashPoint || '', meltingPoint || '', boilingPoint || '', density || '', explosionLimit || '', toxicity || '', hazardStatement || '', precautionaryStatement || '', storageCondition || '', emergencyMeasure || '', department || '', responsiblePerson || '', quantity || 0, maxStorage || 0, manufacturer || '', supplier || '', validUntil || null, status ?? 1, remark || '', id]
  );
  res.json({ success: true, message: '化学品更新成功' });
});

export const deleteChemical = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM chemical_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '化学品不存在' });
  await conn.execute('DELETE FROM chemical_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '化学品已删除' });
});

export const getChemicalStats = asyncHandler(async (_req: Request, res: Response) => {
  const conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM chemical_archives');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT danger_type, COUNT(*) as count FROM chemical_archives WHERE status=1 GROUP BY danger_type ORDER BY count DESC');
  const [expiring] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM chemical_archives WHERE status=1 AND valid_until IS NOT NULL AND valid_until <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  const [expired] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM chemical_archives WHERE status=3');
  res.json({
    success: true,
    data: {
      totalCount: total[0]?.total || 0,
      expiringCount: expiring[0]?.count || 0,
      expiredCount: expired[0]?.count || 0,
      dangerTypeDistribution: byType
    }
  });
});
