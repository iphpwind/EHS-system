import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// ===== 应急物资管理 =====
export const getSuppliesList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword, type } = req.query;
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (keyword) { where += ' AND (name LIKE ? OR supply_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (type) { where += ' AND supply_type = ?'; params.push(type); }
    conn = await getConnection();
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM emergency_supplies ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM emergency_supplies ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const createSupply = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { name, supplyType, specification, quantity, unit, location, responsiblePerson, contactPhone, expireDate, supplier, minAlertQuantity } = req.body;
    if (!name) return res.status(400).json({ success: false, message: '物资名称不能为空' });
    conn = await getConnection();
    const supplyNo = `EM${Date.now()}`;
    await conn.execute<OkPacket>('INSERT INTO emergency_supplies (supply_no, name, supply_type, specification, quantity, unit, location, responsible_person, contact_phone, expire_date, supplier, min_alert_quantity) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [supplyNo, name, supplyType || '', specification || '', quantity || 0, unit || '', location || '', responsiblePerson || '', contactPhone || '', expireDate || null, supplier || '', minAlertQuantity || 1]);
    res.status(201).json({ success: true, message: '物资创建成功' });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const updateSupply = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { name, supplyType, specification, quantity, unit, location, responsiblePerson, expireDate, status } = req.body;
    conn = await getConnection();
    await conn.execute('UPDATE emergency_supplies SET name=?, supply_type=?, specification=?, quantity=?, unit=?, location=?, responsible_person=?, expire_date=?, status=? WHERE id=?',
      [name, supplyType, specification, quantity, unit, location, responsiblePerson, expireDate, status || 1, req.params.id]);
    res.json({ success: true, message: '更新成功' });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const deleteSupply = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try { conn = await getConnection(); await conn.execute('DELETE FROM emergency_supplies WHERE id = ?', [req.params.id]); res.json({ success: true }); }
  catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};

// ===== 应急通讯录 =====
export const getContactsList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { type } = req.query; let where = 'WHERE 1=1'; const params: any[] = [];
    if (type) { where += ' AND contact_type = ?'; params.push(type); }
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM emergency_contacts ${where} ORDER BY priority ASC`, params);
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const createContact = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { contactType, name, department, position, phone, priority } = req.body;
    if (!name || !phone) return res.status(400).json({ success: false, message: '姓名和电话不能为空' });
    conn = await getConnection();
    await conn.execute<OkPacket>('INSERT INTO emergency_contacts (contact_type, name, department, position, phone, priority) VALUES (?,?,?,?,?,?)',
      [contactType || 'internal', name, department || '', position || '', phone, priority || 99]);
    res.status(201).json({ success: true, message: '创建成功' });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};

// ===== 法律法规 =====
export const getLawList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword, typeId, level } = req.query;
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ? OR document_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (typeId) { where += ' AND law_type_id = ?'; params.push(Number(typeId)); }
    if (level) { where += ' AND level = ?'; params.push(level); }
    conn = await getConnection();
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM laws_regulations ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM laws_regulations ${where} ORDER BY effective_date DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const getLawTypes = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try { conn = await getConnection(); const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM law_types WHERE status = 1 ORDER BY sort_order'); res.json({ success: true, data: rows }); }
  catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const createLaw = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { title, documentNo, lawTypeId, issuingAuthority, publishDate, effectiveDate, level, content, summary, keywords } = req.body;
    if (!title) return res.status(400).json({ success: false, message: '标题不能为空' });
    conn = await getConnection();
    const userId = (req as any).user.userId;
    await conn.execute<OkPacket>('INSERT INTO laws_regulations (title, document_no, law_type_id, issuing_authority, publish_date, effective_date, level, content, summary, keywords, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [title, documentNo || '', lawTypeId || null, issuingAuthority || '', publishDate || null, effectiveDate || null, level || '', content || '', summary || '', keywords || '', userId]);
    res.status(201).json({ success: true, message: '创建成功' });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};

// ===== 隐患举报 =====
export const getHazardReportList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, status } = req.query;
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (status) { where += ' AND status = ?'; params.push(status); }
    conn = await getConnection();
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM hazard_reports ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM hazard_reports ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
export const createHazardReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { hazardLocation, hazardDescription, hazardType, hazardLevel, isAnonymous, reporterName } = req.body;
    if (!hazardLocation || !hazardDescription) return res.status(400).json({ success: false, message: '位置和描述不能为空' });
    conn = await getConnection();
    const userId = (req as any).user?.userId;
    const reportNo = `HR${Date.now()}`;
    await conn.execute<OkPacket>('INSERT INTO hazard_reports (report_no, reporter_id, reporter_name, is_anonymous, hazard_location, hazard_description, hazard_type, hazard_level) VALUES (?,?,?,?,?,?,?,?)',
      [reportNo, userId || 0, isAnonymous ? '匿名' : (reporterName || '匿名'), isAnonymous ? 1 : 0, hazardLocation, hazardDescription, hazardType || '', hazardLevel || '']);
    res.status(201).json({ success: true, message: '举报提交成功' });
  } catch (e) { next(e); }
  finally { if (conn) conn.release(); }
};
