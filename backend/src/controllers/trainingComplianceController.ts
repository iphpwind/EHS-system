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
  const { id } = req.params;
  const { name, required_hours, content, course_ids } = req.body;
  const { getConnection } = require('../config/database');
  const conn = await getConnection();

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
