import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

/**
 * 获取风险点列表（分页+筛选）
 */
export const getRiskPoints = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const pageSize = Number(req.query.pageSize) || 20;
  const { page = 1, limit, level, keyword, department } = req.query;
  const finalLimit = pageSize || Number(limit) || 20;
  const offset = (Number(page) - 1) * finalLimit;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (level) { where += ' AND risk_level = ?'; params.push(level); }
  if (keyword) { where += ' AND (name LIKE ? OR code LIKE ? OR location LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`); }
  if (department) { where += ' AND department_id = ?'; params.push(department); }
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT p.*, d.name as dept_name FROM risk_points p LEFT JOIN departments d ON p.department_id = d.id ${where} ORDER BY p.created_at DESC LIMIT ? OFFSET ?`,
    [...params, finalLimit, offset]
  );
  const [countResult] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM risk_points ' + where, params);
  res.json({ success: true, data: { list: rows, pagination: { total: countResult[0].total, page: Number(page), pageSize: finalLimit } } });
});

/**
 * 获取风险等级统计
 */
export const getRiskStats = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
       risk_level, COUNT(*) as count 
     FROM risk_points WHERE status = 1 
     GROUP BY risk_level`
  );
  const levelNames: Record<string, { name: string; label: string; color: string }> = {
    '1': { name: '红', label: '重大风险', color: '#ef4444' },
    '2': { name: '橙', label: '较大风险', color: '#f97316' },
    '3': { name: '黄', label: '一般风险', color: '#eab308' },
    '4': { name: '蓝', label: '低风险', color: '#3b82f6' }
  };
  const stats = rows.map((r: any) => ({
    level: String(r.risk_level),
    ...(levelNames[String(r.risk_level)] || { name: '-', label: '未知', color: '#94a3b8' }),
    count: r.count
  }));
  res.json({ success: true, data: stats });
});

/**
 * 获取风险分布统计（按区域/部门）
 */
export const getRiskDistribution = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT d.name as department, COUNT(*) as count 
     FROM risk_points p LEFT JOIN departments d ON p.department_id = d.id 
     WHERE p.status = 1 
     GROUP BY p.department_id, d.name 
     ORDER BY count DESC`
  );
  res.json({ success: true, data: rows.map((r: any) => ({ department: r.department || '未分配', count: r.count })) });
});

/**
 * 创建风险点
 */
export const createRiskPoint = asyncHandler(async (req: Request, res: Response) => {
  const { code, name, location, department_id, type, activity, hazard_desc, possible_accident,
    l_value, e_value, c_value, risk_level, control_measures, responsible_person, emergency_measures } = req.body;
  if (!code || !name) return res.status(400).json({ success: false, message: '编号和名称必填' });
  const conn = await getConnection();
  const d_value = Number(l_value || 1) * Number(e_value || 1) * Number(c_value || 1);
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO risk_points (code, name, location, department_id, type, activity, hazard_desc, possible_accident,
      l_value, e_value, c_value, d_value, risk_level, control_measures, responsible_person, emergency_measures, status)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`,
    [code, name, location || null, department_id || 0, type || null, activity || null,
      hazard_desc || null, possible_accident || null, l_value || 1, e_value || 1, c_value || 1,
      d_value, risk_level || 3, control_measures || null, responsible_person || null, emergency_measures || null]
  );
  res.status(201).json({ success: true, data: { id: result.insertId }, message: '风险点创建成功' });
});

/**
 * 更新风险点
 */
export const updateRiskPoint = asyncHandler(async (req: Request, res: Response) => {
  const fields: string[] = ['updated_at = NOW()']; const params: any[] = [];
  const { name, location, type, hazard_desc, control_measures, risk_level, status } = req.body;
  if (name !== undefined) { fields.push('name = ?'); params.push(name); }
  if (location !== undefined) { fields.push('location = ?'); params.push(location); }
  if (type !== undefined) { fields.push('type = ?'); params.push(type); }
  if (hazard_desc !== undefined) { fields.push('hazard_desc = ?'); params.push(hazard_desc); }
  if (control_measures !== undefined) { fields.push('control_measures = ?'); params.push(control_measures); }
  if (risk_level !== undefined) { fields.push('risk_level = ?'); params.push(risk_level); }
  if (status !== undefined) { fields.push('status = ?'); params.push(status); }
  params.push(req.params.id);
  const conn = await getConnection();
  await conn.execute(`UPDATE risk_points SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ success: true, message: '风险点已更新' });
});

/**
 * 删除风险点
 */
export const deleteRiskPoint = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('UPDATE risk_points SET status = 0 WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '风险点已删除' });
});

/**
 * 获取隐患排查列表
 */
export const getInspectionList = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const pageSize = Number(req.query.pageSize) || 20;
  const { page = 1, type, status, keyword } = req.query;
  const finalLimit = pageSize;
  const offset = (Number(page) - 1) * finalLimit;
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (type) { where += ' AND plan_type = ?'; params.push(type); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  if (keyword) { where += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT * FROM inspection_plans ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, finalLimit, offset]
  );
  const [countResult] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM inspection_plans ' + where, params);
  res.json({ success: true, data: { list: rows, pagination: { total: countResult[0].total, page: Number(page), pageSize: finalLimit } } });
});
