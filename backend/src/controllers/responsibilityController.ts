/**
 * 安全生产责任制签署控制器
 *
 * 按层级逐级签署：
 *   主要负责人(main) → 分管领导(leadership) → 部门负责人(dept) → 岗位员工(post)
 *
 * API:
 * - GET    /api/responsibility/list          - 责任制文档列表
 * - GET    /api/responsibility/:id           - 文档详情+签署状态
 * - POST   /api/responsibility/create        - 创建文档
 * - POST   /api/responsibility/:id/publish   - 发布签署
 * - POST   /api/responsibility/:id/sign      - 签署
 * - POST   /api/responsibility/:id/revision  - 触发修订
 * - GET    /api/responsibility/my-tasks      - 待签署列表
 */

import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';
import { logger } from '../utils/logger';

import {
  createResponsibilityDoc,
  publishResponsibilityDoc,
  signResponsibility,
  triggerRevision,
  getMySignTasks,
  getDocSignStatus,
} from '../services/responsibilityService';

// ============ 责任制文档列表 ============
export const getResponsibilityList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { page = 1, pageSize = 10, status, keyword } = req.query;
  try {
  conn = await getConnection();

  let sql = `SELECT r.*, u.real_name as creator_name 
             FROM responsibilities r 
             LEFT JOIN users u ON r.created_by = u.id 
             WHERE 1=1`;
  const params: any[] = [];

  if (status) { sql += ' AND r.status = ?'; params.push(status); }
  if (keyword) { sql += ' AND r.title LIKE ?'; params.push(`%${keyword}%`); }

  // 统计总数
  const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
  const [countRows] = await conn.execute(countSql, params);
  const total = (countRows as any[])[0].total;

  // 分页
  sql += ' ORDER BY r.updated_at DESC LIMIT ? OFFSET ?';
  params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

  const [rows] = await conn.execute(sql, params);

  res.json({ code: 200, msg: 'success', data: rows, total: Number(total) });
  } finally { if (conn) conn.release(); }
});

// ============ 责任制文档详情 ============
export const getResponsibilityDetail = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const statusData = await getDocSignStatus(Number(id));

  res.json({ code: 200, msg: 'success', data: statusData });
});

// ============ 创建责任制文档 ============
export const createResponsibility = asyncHandler(async (req: Request, res: Response) => {
  const { title, content, version } = req.body;
  const userId = (req as any).user?.userId;

  if (!title || !content) {
    return res.status(400).json({ code: 400, msg: '标题和内容不能为空' });
  }

  const { docId } = await createResponsibilityDoc(title, content, userId, version);

  res.status(201).json({ code: 200, msg: '创建成功', data: { id: docId } });
});

// ============ 发布签署 ============
export const publishResponsibility = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await publishResponsibilityDoc(Number(id));

  res.json({ code: 200, msg: '发布成功，签署流程已启动' });
});

// ============ 签署 ============
export const handleSign = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { level, signatureData } = req.body;
  const user = (req as any).user;
  const userId = user?.userId;
  const realName = user?.realName || user?.username || '';

  if (!level) {
    return res.status(400).json({ code: 400, msg: '请指定签署层级(main/leadership/dept/post)' });
  }

  try {
    await signResponsibility(Number(id), userId, realName, level, signatureData);
    res.json({ code: 200, msg: '签署成功' });
  } catch (error: any) {
    logger.warn('[ResponsibilityController] 签署失败', {
      docId: id, userId, level, error: error.message,
    });
    res.status(400).json({ code: 400, msg: error.message || '签署失败' });
  }
});

// ============ 触发修订 ============
export const handleRevision = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ code: 400, msg: '请填写修订原因' });
  }

  await triggerRevision(Number(id), reason);

  res.json({ code: 200, msg: '修订已触发，需重新签署所有层级' });
});

// ============ 待签署任务列表 ============
export const getMySignList = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const role = (req as any).user?.role || 5;

  const tasks = await getMySignTasks(userId, role);

  res.json({ code: 200, msg: 'success', data: tasks, total: tasks.length });
});

export default {
  getResponsibilityList,
  getResponsibilityDetail,
  createResponsibility,
  publishResponsibility,
  handleSign,
  handleRevision,
  getMySignList,
};
