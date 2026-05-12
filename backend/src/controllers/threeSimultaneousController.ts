import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getProjectList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1';
  const params: any[] = [];
  if (keyword) { where += ' AND (project_name LIKE ? OR project_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (status) { where += ' AND overall_status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM three_simultaneous_archives ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM three_simultaneous_archives ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM three_simultaneous_archives WHERE id = ?', [req.params.id]);
  if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: '项目不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const { projectName, projectType, investmentAmount, safetyInvestment, projectLeader, constructionUnit, designUnit, supervisionUnit, startDate, completionDate, remark } = req.body;
  if (!projectName) return res.status(400).json({ success: false, message: '项目名称不能为空' });
  const conn = await getConnection();
  const projectNo = `PS${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO three_simultaneous_archives (project_no, project_name, project_type, investment_amount, safety_investment, project_leader, construction_unit, design_unit, supervision_unit, start_date, completion_date, remark, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [projectNo, projectName, projectType || '', investmentAmount || 0, safetyInvestment || 0, projectLeader || '', constructionUnit || '', designUnit || '', supervisionUnit || '', startDate || null, completionDate || null, remark || '']
  );
  res.status(201).json({ success: true, message: '项目创建成功', data: { id: result.insertId, projectNo } });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM three_simultaneous_archives WHERE id = ?', [id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '项目不存在' });
  const updateFields: string[] = []; const params: any[] = [];
  const fieldMap: Record<string, string> = { projectName: 'project_name', projectType: 'project_type', investmentAmount: 'investment_amount', safetyInvestment: 'safety_investment', projectLeader: 'project_leader', constructionUnit: 'construction_unit', designUnit: 'design_unit', supervisionUnit: 'supervision_unit', startDate: 'start_date', completionDate: 'completion_date', overallStatus: 'overall_status', feasibilityReviewStatus: 'feasibility_review_status', feasibilityReviewDate: 'feasibility_review_date', feasibilityReviewFile: 'feasibility_review_file', preliminaryDesignStatus: 'preliminary_design_status', preliminaryDesignDate: 'preliminary_design_date', preliminaryDesignFile: 'preliminary_design_file', completionAcceptanceStatus: 'completion_acceptance_status', completionAcceptanceDate: 'completion_acceptance_date', completionAcceptanceFile: 'completion_acceptance_file', remark: 'remark' };
  for (const [key, value] of Object.entries(fields)) {
    if (fieldMap[key] && value !== undefined) { updateFields.push(`${fieldMap[key]}=?`); params.push(value); }
  }
  if (updateFields.length === 0) return res.status(400).json({ success: false, message: '无更新字段' });
  params.push(id);
  await conn.execute(`UPDATE three_simultaneous_archives SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '项目更新成功' });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM three_simultaneous_archives WHERE id = ?', [req.params.id]);
  if (!existing || existing.length === 0) return res.status(404).json({ success: false, message: '项目不存在' });
  await conn.execute('DELETE FROM three_simultaneous_archives WHERE id = ?', [req.params.id]);
  res.json({ success: true, message: '项目已删除' });
});

export const getProjectStats = asyncHandler(async (_req: Request, res: Response) => {
  const conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM three_simultaneous_archives');
  const [byStatus] = await conn.execute<RowDataPacket[]>('SELECT overall_status, COUNT(*) as count FROM three_simultaneous_archives GROUP BY overall_status');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT project_type, COUNT(*) as count FROM three_simultaneous_archives GROUP BY project_type');
  const [totalInvestment] = await conn.execute<RowDataPacket[]>('SELECT COALESCE(SUM(investment_amount),0) as total FROM three_simultaneous_archives');
  res.json({ success: true, data: { totalCount: total[0]?.total || 0, byStatus, byType, totalInvestment: totalInvestment[0]?.total || 0 } });
});
