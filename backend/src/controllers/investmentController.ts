import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

export const getInvestmentList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, keyword, investmentType, status } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const conn = await getConnection();
  let where = 'WHERE 1=1'; const params: any[] = [];
  if (keyword) { where += ' AND (project_name LIKE ? OR investment_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
  if (investmentType) { where += ' AND investment_type = ?'; params.push(investmentType); }
  if (status) { where += ' AND status = ?'; params.push(status); }
  const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM safety_investment ${where}`, params);
  const total = countRows[0]?.total || 0;
  const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM safety_investment ${where} ORDER BY investment_date DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
  res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
});

export const getInvestmentById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM safety_investment WHERE id=?', [req.params.id]);
  if (!rows || rows.length===0) return res.status(404).json({ success:false, message:'投入记录不存在' });
  res.json({ success: true, data: rows[0] });
});

export const createInvestment = asyncHandler(async (req: Request, res: Response) => {
  const { investmentType, projectName, amount, budgetSource, investmentDate, responsibleDepartment, responsiblePerson, vendor, description, effectEvaluation } = req.body;
  if (!projectName || !investmentType || !amount) return res.status(400).json({ success:false, message:'项目名称、类型和金额不能为空' });
  const conn = await getConnection();
  const investmentNo = `SI${Date.now()}`;
  const userId = (req as any).user?.userId;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO safety_investment (investment_no, investment_type, project_name, amount, budget_source, investment_date, responsible_department, responsible_person, vendor, description, effect_evaluation, created_by, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
    [investmentNo, investmentType, projectName, amount, budgetSource||'', investmentDate||null, responsibleDepartment||'', responsiblePerson||'', vendor||'', description||'', effectEvaluation||'', userId||null]
  );
  res.status(201).json({ success: true, data: { id: result.insertId, investmentNo } });
});

export const updateInvestment = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const fields = req.body;
  const conn = await getConnection();
  const fieldMap: Record<string,string> = { investmentType:'investment_type', projectName:'project_name', amount:'amount', budgetSource:'budget_source', investmentDate:'investment_date', responsibleDepartment:'responsible_department', responsiblePerson:'responsible_person', vendor:'vendor', description:'description', effectEvaluation:'effect_evaluation', status:'status' };
  const updateFields: string[] = []; const params: any[] = [];
  for (const [k, v] of Object.entries(fields)) { if (fieldMap[k] && v!==undefined) { updateFields.push(`${fieldMap[k]}=?`); params.push(v); } }
  if (updateFields.length===0) return res.status(400).json({ success:false, message:'无更新字段' });
  params.push(id);
  await conn.execute(`UPDATE safety_investment SET ${updateFields.join(', ')}, updated_at=NOW() WHERE id=?`, params);
  res.json({ success: true, message: '更新成功' });
});

export const deleteInvestment = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM safety_investment WHERE id=?', [req.params.id]);
  res.json({ success: true, message: '已删除' });
});

export const getInvestmentStats = asyncHandler(async (_req: Request, res: Response) => {
  const conn = await getConnection();
  const [total] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total, COALESCE(SUM(amount),0) as totalAmount, COALESCE(AVG(amount),0) as avgAmount FROM safety_investment');
  const [byType] = await conn.execute<RowDataPacket[]>('SELECT investment_type, COUNT(*) as count, COALESCE(SUM(amount),0) as amount FROM safety_investment WHERE status=1 GROUP BY investment_type ORDER BY amount DESC');
  const [byMonth] = await conn.execute<RowDataPacket[]>("SELECT DATE_FORMAT(investment_date,'%Y-%m') as month, COALESCE(SUM(amount),0) as amount FROM safety_investment WHERE investment_date>=DATE_SUB(CURDATE(),INTERVAL 12 MONTH) GROUP BY month ORDER BY month");
  res.json({ success: true, data: { totalCount: total[0]?.total||0, totalAmount: total[0]?.totalAmount||0, avgAmount: total[0]?.avgAmount||0, byType, monthlyTrend: byMonth } });
});
