import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getPartyList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 20, keyword, partyType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  try {
  conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (name LIKE ? OR party_no LIKE ? OR contact_person LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (partyType) { where += ' AND party_type = ?'; params.push(partyType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM related_party_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM related_party_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally { if (conn) conn.release(); }
});

export const getPartyById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM related_party_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '相关方不存在' });
  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

export const createParty = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { name, partyType, partyLevel, legalPerson, contactPerson, contactPhone, email, address, businessScope, qualificationCert, qualificationValidUntil, contractNo, contractStart, contractEnd, safetyAgreementSigned, safetyTrainingDone, remark } = req.body;
  if (!name || !partyType) return res.status(400).json({ success: false, message: '名称和类型不能为空' });
  try {
  conn = await getConnection();
  const partyNo = `PT${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO related_party_archives (party_no, name, party_type, party_level, legal_person, contact_person, contact_phone, email, address, business_scope, qualification_cert, qualification_valid_until, contract_no, contract_start, contract_end, safety_agreement_signed, safety_training_done, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [partyNo, name, partyType, partyLevel || '', legalPerson || '', contactPerson || '', contactPhone || '', email || '', address || '', businessScope || '', qualificationCert || '', qualificationValidUntil || null, contractNo || '', contractStart || null, contractEnd || null, safetyAgreementSigned ? 1 : 0, safetyTrainingDone ? 1 : 0, remark || '']
  );
  res.status(201).json({ success: true, message: '相关方创建成功', data: { id: result.insertId, partyNo } });
  } finally { if (conn) conn.release(); }
});

export const updateParty = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const fields = req.body;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM related_party_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '相关方不存在' });
  const fieldMap: Record<string, string> = { name: 'name', partyType: 'party_type', partyLevel: 'party_level', legalPerson: 'legal_person', contactPerson: 'contact_person', contactPhone: 'contact_phone', email: 'email', address: 'address', businessScope: 'business_scope', qualificationCert: 'qualification_cert', qualificationValidUntil: 'qualification_valid_until', contractNo: 'contract_no', contractStart: 'contract_start', contractEnd: 'contract_end', safetyAgreementSigned: 'safety_agreement_signed', safetyTrainingDone: 'safety_training_done', evaluationScore: 'evaluation_score', evaluationLevel: 'evaluation_level', status: 'status', remark: 'remark' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (fieldMap[key] && value !== undefined) { updateFields.push(`${fieldMap[key]}=?`); params.push(value); }
  }
  if (updateFields.length === 0) return res.status(400).json({ success: false, message: '无更新字段' });
  params.push(id);
  await conn.execute(`UPDATE related_party_archives SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '相关方更新成功' });
  } finally { if (conn) conn.release(); }
});

export const deleteParty = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM related_party_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '相关方不存在' });
  await conn.execute('DELETE FROM related_party_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '相关方已删除' });
  } finally { if (conn) conn.release(); }
});

export const getPartyStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM related_party_archives');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT party_type, COUNT(*) as count FROM related_party_archives GROUP BY party_type');
  const [expiringContract] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM related_party_archives WHERE contract_end IS NOT NULL AND contract_end BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  const [expiringQual] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as count FROM related_party_archives WHERE qualification_valid_until IS NOT NULL AND qualification_valid_until BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY)');
  res.json({ success: true, data: { totalCount: total[0]?.total || 0, byType, expiringContract: expiringContract[0]?.count || 0, expiringQualification: expiringQual[0]?.count || 0 } });
  } finally { if (conn) conn.release(); }
});
