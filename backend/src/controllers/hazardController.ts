import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

/**
 * 获取隐患列表（分页+筛选）
 */
export const getHazardList = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { page = 1, pageSize = 20, level, status, department, keyword, startDate, endDate } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const where: string[] = [];
  const params: any[] = [];

  if (level) {
    where.push('hazard_level = ?');
    params.push(level);
  }
  if (status !== undefined && status !== '') {
    where.push('status = ?');
    params.push(Number(status));
  }
  if (department) {
    where.push('department = ?');
    params.push(department);
  }
  if (keyword) {
    where.push('hazard_description LIKE ?');
    params.push(`%${keyword}%`);
  }
  if (startDate) {
    where.push('discovery_time >= ?');
    params.push(startDate);
  }
  if (endDate) {
    where.push('discovery_time <= ?');
    params.push(endDate + ' 23:59:59');
  }

  const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT h.*, u.real_name AS discoverer_name 
     FROM hazard_inspection h 
     LEFT JOIN users u ON h.discoverer_id = u.id 
     ${whereClause} 
     ORDER BY h.created_at DESC 
     LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const [countResult] = await conn.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as total FROM hazard_inspection ' + whereClause,
    params
  );

  res.json({
    success: true,
    data: {
      list: rows,
      pagination: {
        page: Number(page),
        pageSize: Number(pageSize),
        total: countResult[0].total
      }
    }
  });
});

/**
 * 获取隐患详情
 */
export const getHazardById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT h.*, u.real_name AS discoverer_name, uv.real_name AS verifier_name 
     FROM hazard_inspection h 
     LEFT JOIN users u ON h.discoverer_id = u.id 
     LEFT JOIN users uv ON h.verifier_id = uv.id 
     WHERE h.id = ?`,
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: '隐患记录不存在' });
  }
  res.json({ success: true, data: rows[0] });
});

/**
 * 新增隐患
 */
export const createHazard = asyncHandler(async (req: Request, res: Response) => {
  const { inspection_no, hazard_description, hazard_level, location, department, discoverer_id, rectification_deadline, rectification_responsible } = req.body;
  if (!hazard_description) {
    return res.status(400).json({ success: false, message: '隐患描述不能为空' });
  }
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO hazard_inspection (inspection_no, hazard_description, hazard_level, location, department, discoverer_id, rectification_deadline, rectification_responsible, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
    [inspection_no || ('HZ-' + Date.now()), hazard_description, hazard_level || 'general', location, department, discoverer_id || null, rectification_deadline || null, rectification_responsible || null]
  );
  res.status(201).json({ success: true, message: '隐患登记成功', data: { id: result.insertId } });
});

/**
 * 更新隐患
 */
export const updateHazard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { hazard_description, hazard_level, location, department, status, rectification_measure, rectification_deadline, rectification_responsible } = req.body;
  const conn = await getConnection();
  const fields: string[] = [];
  const params: any[] = [];
  if (hazard_description !== undefined) { fields.push('hazard_description = ?'); params.push(hazard_description); }
  if (hazard_level !== undefined) { fields.push('hazard_level = ?'); params.push(hazard_level); }
  if (location !== undefined) { fields.push('location = ?'); params.push(location); }
  if (department !== undefined) { fields.push('department = ?'); params.push(department); }
  if (status !== undefined) { fields.push('status = ?'); params.push(status); }
  if (rectification_measure !== undefined) { fields.push('rectification_measure = ?'); params.push(rectification_measure); }
  if (rectification_deadline !== undefined) { fields.push('rectification_deadline = ?'); params.push(rectification_deadline); }
  if (rectification_responsible !== undefined) { fields.push('rectification_responsible = ?'); params.push(rectification_responsible); }
  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: '没有要更新的字段' });
  }
  fields.push('updated_at = NOW()');
  params.push(id);
  await conn.execute(`UPDATE hazard_inspection SET ${fields.join(', ')} WHERE id = ?`, params);
  res.json({ success: true, message: '隐患记录已更新' });
});

/**
 * 删除隐患
 */
export const deleteHazard = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM hazard_inspection WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '隐患记录已删除' });
});

/**
 * 整改隐患
 */
export const rectifyHazard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rectification_measure, rectification_deadline, rectification_responsible } = req.body;
  const conn = await getConnection();
  await conn.execute(
    `UPDATE hazard_inspection SET status = 2, rectification_measure = ?, rectification_deadline = ?, rectification_responsible = ?, rectification_time = NOW(), updated_at = NOW() WHERE id = ? AND status = 1`,
    [rectification_measure || null, rectification_deadline || null, rectification_responsible || null, id]
  );
  res.json({ success: true, message: '隐患已提交整改' });
});

/**
 * 验收隐患
 */
export const acceptHazard = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { verification_result, verifier_id } = req.body;
  const conn = await getConnection();
  await conn.execute(
    `UPDATE hazard_inspection SET status = 4, verification_result = ?, verifier_id = ?, verification_time = NOW(), updated_at = NOW() WHERE id = ? AND status = 3`,
    [verification_result || 1, verifier_id || null, id]
  );
  res.json({ success: true, message: '隐患验收完成' });
});

/**
 * 隐患统计
 */
export const getHazardStats = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT 
       COUNT(*) AS total,
       SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS processing,
       SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS review,
       SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN hazard_level = 'major' AND status < 4 THEN 1 ELSE 0 END) AS urgent
     FROM hazard_inspection`
  );
  res.json({ success: true, data: rows[0] });
});
