import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getTargetList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, targetType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  let conn;
  try {
    conn = await getConnection();
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ? OR target_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (targetType) { where += ' AND target_type = ?'; params.push(targetType); }
    if (status) { where += ' AND status = ?'; params.push(status); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM target_responsibility ${where}`, params);
    const total = countRows[0]?.total || 0;
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM target_responsibility ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } finally {
    if (conn) conn.release();
  }
});

export const getTargetById = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM target_responsibility WHERE id=?', [req.params.id]);
    if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '目标/责任书不存在' });
    res.json({ success: true, data: rows[0] });
  } finally {
    if (conn) conn.release();
  }
});

export const createTarget = asyncHandler(async (req: Request, res: Response) => {
  const { title, targetType, targetYear, responsibleDepartment, responsiblePerson, signingDate, expiryDate, targetContent, keyIndicators, remark } = req.body;
  if (!title || !targetType) return res.status(400).json({ success: false, message: '标题和类型不能为空' });
  let conn;
  try {
    conn = await getConnection();
    const targetNo = `TGT${Date.now()}`;
    const userId = (req as any).user?.userId;
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO target_responsibility (target_no, title, target_type, target_year, responsible_department, responsible_person, signing_date, expiry_date, target_content, key_indicators, remark, created_by, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [targetNo, title, targetType, targetYear || new Date().getFullYear(), responsibleDepartment || '', responsiblePerson || '', signingDate || null, expiryDate || null, targetContent || '', keyIndicators ? JSON.stringify(keyIndicators) : null, remark || '', userId || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, targetNo } });
  } finally {
    if (conn) conn.release();
  }
});

export const updateTarget = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  let conn;
  try {
    conn = await getConnection();
    const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM target_responsibility WHERE id=?', [id]);
    if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '目标/责任书不存在' });
    const fieldMap: Record<string,string> = { title:'title', targetType:'target_type', targetYear:'target_year', responsibleDepartment:'responsible_department', responsiblePerson:'responsible_person', signingDate:'signing_date', expiryDate:'expiry_date', targetContent:'target_content', keyIndicators:'key_indicators', completionRate:'completion_rate', assessmentResult:'assessment_result', status:'status', remark:'remark' };
    const updateFields: string[] = []; const params: any[] = [];
    for (const [k, v] of Object.entries(fields)) { if (fieldMap[k] && v!==undefined) { updateFields.push(`${fieldMap[k]}=?`); params.push(k==='keyIndicators'?JSON.stringify(v):v); } }
    if (updateFields.length===0) return res.status(400).json({ success:false, message:'无更新字段' });
    params.push(id);
    await conn.execute(`UPDATE target_responsibility SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
    res.json({ success: true, message: '更新成功' });
  } finally {
    if (conn) conn.release();
  }
});

export const deleteTarget = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute('DELETE FROM target_responsibility WHERE id=?', [req.params.id]);
    res.json({ success: true, message: '已删除' });
  } finally {
    if (conn) conn.release();
  }
});

export const getTargetStats = asyncHandler(async (_req: Request, res: Response) => {
  let conn;
  try {
    conn = await getConnection();
    const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total, AVG(completion_rate) as avgRate FROM target_responsibility');
    const [byStatus] = await conn.execute<RowDataPacket[]>('SELECT status, COUNT(*) as count FROM target_responsibility GROUP BY status');
    res.json({ success: true, data: { totalCount: total[0]?.total||0, avgCompletionRate: total[0]?.avgRate||0, byStatus } });
  } finally {
    if (conn) conn.release();
  }
});

// ==================== 责任书模板管理 ====================

export const getTemplateList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, positionType } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  let conn;
  try {
    conn = await getConnection();
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ? OR template_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (positionType) { where += ' AND position_type = ?'; params.push(positionType); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM target_templates ${where}`, params);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM target_templates ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total: countRows[0]?.total || 0 } } });
  } finally {
    if (conn) conn.release();
  }
});

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { title, targetType, positionType, department, content, fileUrl } = req.body;
  if (!title) return res.status(400).json({ success: false, message: '模板名称必填' });
  let conn;
  try {
    conn = await getConnection();
    const templateNo = `TPL${Date.now()}`;
    const userId = (req as any).user?.userId;
    const [result] = await conn.execute<ResultSetHeader>(
      'INSERT INTO target_templates (template_no, title, target_type, position_type, department, content, file_url, created_by, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,NOW(),NOW())',
      [templateNo, title, targetType || '责任书', positionType || '', department || '', content || '', fileUrl || '', userId || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, templateNo } });
  } finally {
    if (conn) conn.release();
  }
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { title, targetType, positionType, department, content, fileUrl, status } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const fields: string[] = ['updated_at=NOW()']; const params: any[] = [];
    if (title !== undefined) { fields.push('title=?'); params.push(title); }
    if (targetType !== undefined) { fields.push('target_type=?'); params.push(targetType); }
    if (positionType !== undefined) { fields.push('position_type=?'); params.push(positionType); }
    if (department !== undefined) { fields.push('department=?'); params.push(department); }
    if (content !== undefined) { fields.push('content=?'); params.push(content); }
    if (fileUrl !== undefined) { fields.push('file_url=?'); params.push(fileUrl); }
    if (status !== undefined) { fields.push('status=?'); params.push(status); }
    params.push(req.params.id);
    await conn.execute(`UPDATE target_templates SET ${fields.join(',')} WHERE id=?`, params);
    res.json({ success: true, message: '模板更新成功' });
  } finally {
    if (conn) conn.release();
  }
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await getConnection();
    await conn.execute('DELETE FROM target_templates WHERE id=?', [req.params.id]);
    res.json({ success: true, message: '模板已删除' });
  } finally {
    if (conn) conn.release();
  }
});

// ==================== 签订流程管理 ====================

export const getSigningList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, signStatus, targetId } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  let conn;
  try {
    conn = await getConnection();
    let where = 'WHERE 1=1'; const params: any[] = [];
    if (signStatus) { where += ' AND s.sign_status = ?'; params.push(signStatus); }
    if (targetId) { where += ' AND s.target_id = ?'; params.push(targetId); }
    const [countRows] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM target_signings s ${where}`, params
    );
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT s.*, t.title as target_title, u1.real_name as initiator_name, u2.real_name as target_user_name
       FROM target_signings s
       LEFT JOIN target_responsibility t ON s.target_id = t.id
       LEFT JOIN users u1 ON s.initiator_id = u1.id
       LEFT JOIN users u2 ON s.target_user_id = u2.id
       ${where} ORDER BY s.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total: countRows[0]?.total || 0 } } });
  } finally {
    if (conn) conn.release();
  }
});

export const initiateSigning = asyncHandler(async (req: Request, res: Response) => {
  const { targetId, templateId, targetUserId, targetDepartment } = req.body;
  if (!targetId || !targetUserId) return res.status(400).json({ success: false, message: '目标责任书和目标责任人必填' });
  let conn;
  try {
    conn = await getConnection();
    const userId = (req as any).user?.userId;
    const [result] = await conn.execute<ResultSetHeader>(
      'INSERT INTO target_signings (target_id, template_id, initiator_id, target_user_id, target_department, sign_status, created_at, updated_at) VALUES (?,?,?,?,?,\'pending\',NOW(),NOW())',
      [targetId, templateId || null, userId || null, targetUserId, targetDepartment || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId }, message: '已发起签订' });
  } finally {
    if (conn) conn.release();
  }
});

export const confirmSigning = asyncHandler(async (req: Request, res: Response) => {
  const { signatureImage } = req.body;
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id, target_id FROM target_signings WHERE id=? AND sign_status=\'pending\'', [req.params.id]);
    if (!rows.length) return res.status(400).json({ success: false, message: '签订记录不存在或状态不正确' });
    // 保存签名图片URL（简化：直接存base64，实际应上传文件服务器）
    await conn.execute(
      "UPDATE target_signings SET sign_status='confirmed', confirm_time=NOW(), updated_at=NOW(), signature_url_b=? WHERE id=?",
      [signatureImage || '', req.params.id]
    );
    // 同时更新目标责任书的乙方签名
    await conn.execute(
      "UPDATE target_responsibility SET signature_url_b=?, status=2 WHERE id=?",
      [signatureImage || '', rows[0].target_id]
    );
    res.json({ success: true, message: '已确认签订' });
  } finally {
    if (conn) conn.release();
  }
});

export const approveSigning = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id FROM target_signings WHERE id=? AND sign_status=\'confirmed\'', [req.params.id]);
    if (!rows.length) return res.status(400).json({ success: false, message: '签订记录不存在或尚未确认' });
    await conn.execute("UPDATE target_signings SET sign_status='approved', approve_time=NOW(), updated_at=NOW() WHERE id=?", [req.params.id]);
    // 同时更新目标责任书状态为已签订
    await conn.execute("UPDATE target_responsibility t JOIN target_signings s ON t.id=s.target_id SET t.status=5 WHERE s.id=?", [req.params.id]);
    res.json({ success: true, message: '已批准签订' });
  } finally {
    if (conn) conn.release();
  }
});

export const rejectSigning = asyncHandler(async (req: Request, res: Response) => {
  const { reason } = req.body;
  let conn;
  try {
    conn = await getConnection();
    await conn.execute("UPDATE target_signings SET sign_status='rejected', reject_reason=?, updated_at=NOW() WHERE id=?", [reason || '', req.params.id]);
    res.json({ success: true, message: '已驳回' });
  } finally {
    if (conn) conn.release();
  }
});
