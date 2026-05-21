import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getReminderSettings = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, reminderType, isEnabled } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (reminderType) { where += ' AND reminder_type = ?'; params.push(reminderType); }
  if (isEnabled !== undefined) { where += ' AND is_enabled = ?'; params.push(isEnabled); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM expiry_reminder_settings ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM expiry_reminder_settings ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const createReminderSetting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { reminderType, targetModule, targetTable, targetField, reminderName, advanceDays, reminderInterval, remindMethod, remindRoles, remindUsers, description } = req.body;
  if (!reminderType || !reminderName) return res.status(400).json({ success: false, message: '提醒类型和名称不能为空' });
  try {
  conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO expiry_reminder_settings (reminder_type, target_module, target_table, target_field, reminder_name, advance_days, reminder_interval, remind_method, remind_roles, remind_users, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [reminderType, targetModule || '', targetTable || '', targetField || '', reminderName, advanceDays || 30, reminderInterval || 7, remindMethod || 'system', remindRoles ? JSON.stringify(remindRoles) : null, remindUsers ? JSON.stringify(remindUsers) : null, description || '']
  );
  res.status(201).json({ success: true, message: '提醒设置创建成功', data: { id: result.insertId } });
  } finally { if (conn) conn.release(); }
});

export const updateReminderSetting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { reminderType, targetModule, targetTable, targetField, reminderName, advanceDays, reminderInterval, remindMethod, remindRoles, remindUsers, isEnabled, description } = req.body;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM expiry_reminder_settings WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '提醒设置不存在' });
  await conn.execute(
    `UPDATE expiry_reminder_settings SET reminder_type=?, target_module=?, target_table=?, target_field=?, reminder_name=?, advance_days=?, reminder_interval=?, remind_method=?, remind_roles=?, remind_users=?, is_enabled=?, description=?, updated_at=NOW() WHERE id=?`,
    [reminderType, targetModule || '', targetTable || '', targetField || '', reminderName, advanceDays || 30, reminderInterval || 7, remindMethod || 'system', remindRoles ? JSON.stringify(remindRoles) : null, remindUsers ? JSON.stringify(remindUsers) : null, isEnabled !== undefined ? (isEnabled ? 1 : 0) : 1, description || '', id]
  );
  res.json({ success: true, message: '提醒设置更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteReminderSetting = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM expiry_reminder_settings WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '提醒设置不存在' });
  await conn.execute('DELETE FROM expiry_reminder_settings WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '提醒设置已删除' });
  } finally { if (conn) conn.release(); }
});

export const getExpiringItems = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const days = Number(req.query.days) || 30;
  const results: any[] = [];

  // 化学品到期
  const [chemicals] = await conn.execute<RowDataPacket[]>(
    'SELECT id, name as title, chemical_no as code, valid_until as expiry_date, "chemical" as source FROM chemical_archives WHERE status=1 AND valid_until IS NOT NULL AND valid_until <= DATE_ADD(CURDATE(), INTERVAL ? DAY)',
    [days]
  );
  chemicals.forEach((c: any) => results.push({ ...c, module: '化学品档案' }));

  // 设备维护到期
  const [equipment] = await conn.execute<RowDataPacket[]>(
    'SELECT id, name as title, equipment_no as code, next_maintenance as expiry_date, "equipment" as source FROM equipment WHERE status=1 AND next_maintenance IS NOT NULL AND next_maintenance <= DATE_ADD(CURDATE(), INTERVAL ? DAY)',
    [days]
  );
  equipment.forEach((e: any) => results.push({ ...e, module: '设备台账' }));

  // 相关方合同到期
  const [contracts] = await conn.execute<RowDataPacket[]>(
    'SELECT id, name as title, party_no as code, contract_end as expiry_date, "contract" as source FROM related_party_archives WHERE status=1 AND contract_end IS NOT NULL AND contract_end <= DATE_ADD(CURDATE(), INTERVAL ? DAY)',
    [days]
  );
  contracts.forEach((c: any) => results.push({ ...c, module: '相关方(合同)' }));

  // 相关方资质到期
  const [quals] = await conn.execute<RowDataPacket[]>(
    'SELECT id, name as title, party_no as code, qualification_valid_until as expiry_date, "qualification" as source FROM related_party_archives WHERE status=1 AND qualification_valid_until IS NOT NULL AND qualification_valid_until <= DATE_ADD(CURDATE(), INTERVAL ? DAY)',
    [days]
  );
  quals.forEach((q: any) => results.push({ ...q, module: '相关方(资质)' }));

  // 安全生产档案到期
  const [docs] = await conn.execute<RowDataPacket[]>(
    'SELECT id, title, doc_no as code, expiry_date, "document" as source FROM safety_production_archives WHERE status=1 AND expiry_date IS NOT NULL AND expiry_date <= DATE_ADD(CURDATE(), INTERVAL ? DAY)',
    [days]
  );
  docs.forEach((d: any) => results.push({ ...d, module: '安全生产档案' }));

  results.sort((a: any, b: any) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());

  res.json({ success: true, data: { list: results, total: results.length } });
  } finally { if (conn) conn.release(); }
});
