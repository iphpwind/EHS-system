/**
 * 三级安全教育 & 年度学时统计 控制器（化工企业合规版）
 */

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/errors';
import {
  getThreeLevelTemplates,
  autoAssignThreeLevelEducation,
  checkThreeLevelCompletion,
  getAnnualCreditReport,
  calculateCreditHours,
} from '../services/threeLevelEducationService';
import { preCheckTrainingStatus } from '../middleware/ticketTrainingValidator';
import { logger } from '../utils/logger';

// ============ 三级教育模板 ============

/** 获取三级教育模板列表 */
export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const templates = await getThreeLevelTemplates();
  res.json({ code: 200, msg: 'success', data: templates });
});

/** 更新模板 */
export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { name, required_hours, content, course_ids } = req.body;
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  await conn.execute(
    `UPDATE three_level_templates 
     SET name = COALESCE(?, name),
         required_hours = COALESCE(?, required_hours),
         content = COALESCE(?, content),
         course_ids = COALESCE(?, course_ids),
         updated_at = NOW()
     WHERE id = ?`,
    [name, required_hours, content, course_ids ? JSON.stringify(course_ids) : null, id]
  );

  res.json({ code: 200, msg: '模板更新成功' });
  } finally { if (conn) conn.release(); }
});

// ============ 三级教育记录 ============

/** 为用户分配三级教育 */
export const assignEducation = asyncHandler(async (req: Request, res: Response) => {
  const { userId, projectId } = req.body;
  if (!userId) return res.status(400).json({ code: 400, msg: '用户ID不能为空' });

  const result = await autoAssignThreeLevelEducation(userId, undefined, projectId);
  res.json({ code: 200, msg: '分配成功', data: result });
});

/** 获取用户三级教育状态 */
export const getEducationStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId) || (req as any).user?.userId;
  if (!userId) return res.status(400).json({ code: 400, msg: '用户ID不能为空' });

  const status = await checkThreeLevelCompletion(userId);
  res.json({ code: 200, msg: 'success', data: status });
});

/** 获取当前登录用户的三级教育状态 */
export const getMyEducationStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) return res.status(401).json({ code: 401, msg: '未登录' });

  const status = await checkThreeLevelCompletion(userId);
  res.json({ code: 200, msg: 'success', data: status });
});

// ============ 年度学时报表 ============

/** 年度学时统计报表 */
export { getAnnualCreditReport };

/** 年度学时报表接口适配 */
export const annualReport = asyncHandler(async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined;

  const data = await getAnnualCreditReport(year, departmentId);
  res.json({
    code: 200,
    msg: 'success',
    data,
    meta: {
      year,
      requiredHours: 20,
      totalUsers: data.length,
      passedCount: data.filter((d: any) => d.status === '达标').length,
      failedCount: data.filter((d: any) => d.status === '未达标').length,
    },
  });
});

// ============ 学时工具 ============

/** 学时换算计算器 */
export const creditCalculator = asyncHandler(async (req: Request, res: Response) => {
  const { minutes } = req.query;
  const mins = parseInt(minutes as string) || 0;
  const hours = calculateCreditHours(mins);

  res.json({
    code: 200,
    msg: 'success',
    data: {
      minutes: mins,
      creditHours: hours,
      formula: `${mins} 分钟 ÷ 45 分钟/学时 = ${hours} 学时`,
    },
  });
});

// ============ 预校验（给前端用）============
export { preCheckTrainingStatus };

export default {
  getTemplates,
  updateTemplate,
  assignEducation,
  getEducationStatus,
  getMyEducationStatus,
  annualReport,
  creditCalculator,
  preCheckTrainingStatus,
};

// ============ 三级教育记录 CRUD ============

/** 分页查询三级教育记录 */
export const listThreeLevelRecords = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { pageNum = 1, pageSize = 10, employeeName, deptId, status, educationLevel } = req.query;
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  const offset = (Number(pageNum) - 1) * Number(pageSize);
  let sql = `SELECT r.id, r.employee_id, r.dept_id, r.education_level, r.course_id,
               r.educator_id, r.education_date, r.duration, r.score, r.assess_result,
               r.assess_comment, r.content_summary, r.status, r.remark, r.created_at,
               u.real_name AS employeeName, u.position,
               d.dept_name AS deptName,
               c.title AS courseName,
               e.real_name AS educatorName
             FROM training_three_level_records r
             LEFT JOIN sys_users u ON r.employee_id = u.id
             LEFT JOIN sys_dept d ON r.dept_id = d.dept_id
             LEFT JOIN training_courses c ON r.course_id = c.id
             LEFT JOIN sys_users e ON r.educator_id = e.id
             WHERE 1=1`;
  const params: any[] = [];
  if (employeeName) { sql += ' AND u.real_name LIKE ?'; params.push(`%${employeeName}%`); }
  if (deptId) { sql += ' AND r.dept_id = ?'; params.push(Number(deptId)); }
  if (status) { sql += ' AND r.status = ?'; params.push(status as string); }
  if (educationLevel) { sql += ' AND r.education_level = ?'; params.push(educationLevel as string); }

  const [countRows] = await conn.execute(`SELECT COUNT(*) AS total FROM (${sql}) t`, params);
  const total = (countRows as any[])[0].total;

  sql += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
  params.push(Number(pageSize), offset);
  const [rows] = await conn.execute(sql, params);

  res.json({ code: 200, msg: 'success', data: { rows, total } });
  } finally { if (conn) conn.release(); }
});

/** 获取单条三级教育记录 */
export const getThreeLevelRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  const [rows] = await conn.execute(
    `SELECT r.*, u.real_name AS employeeName, c.title AS courseName, e.real_name AS educatorName
     FROM training_three_level_records r
     LEFT JOIN sys_users u ON r.employee_id = u.id
     LEFT JOIN training_courses c ON r.course_id = c.id
     LEFT JOIN sys_users e ON r.educator_id = e.id
     WHERE r.id = ?`,
    [Number(req.params.id)]
  );
  const row = (rows as any[])[0];
  if (!row) return res.status(404).json({ code: 404, msg: '记录不存在' });
  res.json({ code: 200, msg: 'success', data: row });
  } finally { if (conn) conn.release(); }
});

/** 新增三级教育记录 */
export const createThreeLevelRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { employeeId, deptId, educationLevel, courseId, educatorId,
          educationDate, duration, contentSummary, remark } = req.body;
  if (!employeeId || !educationLevel) {
    return res.status(400).json({ code: 400, msg: '员工ID和教育级别不能为空' });
  }
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  const [result] = await conn.execute(
    `INSERT INTO training_three_level_records
     (employee_id, dept_id, education_level, course_id, educator_id,
      education_date, duration, content_summary, remark, status, created_at)
     VALUES (?,?,?,?,?,?,?,?,?,'in_progress', NOW())`,
    [employeeId, deptId || null, educationLevel, courseId || null, educatorId || null,
     educationDate || null, duration || 2, contentSummary || '', remark || '']
  );
  res.json({ code: 200, msg: '新增成功', data: { id: (result as any).insertId } });
  } finally { if (conn) conn.release(); }
});

/** 更新三级教育记录 */
export const updateThreeLevelRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { courseId, educatorId, educationDate, duration, contentSummary, remark } = req.body;
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  await conn.execute(
    `UPDATE training_three_level_records
     SET course_id=?, educator_id=?, education_date=?, duration=?,
         content_summary=?, remark=?, updated_at=NOW()
     WHERE id=?`,
    [courseId || null, educatorId || null, educationDate || null,
     duration || 2, contentSummary || '', remark || '', Number(req.params.id)]
  );
  res.json({ code: 200, msg: '更新成功' });
  } finally { if (conn) conn.release(); }
});

/** 提交考核结果 */
export const assessThreeLevelRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { score, assessResult, assessComment } = req.body;
  if (!assessResult) return res.status(400).json({ code: 400, msg: '考核结果不能为空' });

  const status = assessResult === 'pass' ? 'completed' : 'in_progress';
  const { getConnection } = require('../config/database');
  try {
  conn = await getConnection();

  await conn.execute(
    `UPDATE training_three_level_records
     SET score=?, assess_result=?, assess_comment=?, status=?, updated_at=NOW()
     WHERE id=?`,
    [score || 0, assessResult, assessComment || '', status, Number(req.params.id)]
  );
  res.json({ code: 200, msg: '考核完成' });
  } finally { if (conn) conn.release(); }
});

