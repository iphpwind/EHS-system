import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

// 扩展 Request 类型以包含 user
interface AuthRequest extends Request {
  user?: { userId: number; username: string; role: number };
}

interface TrainingProgressRow extends RowDataPacket {
  id: number;
  user_id: number;
  plan_id: number;
  watched_time: number;
  last_position: number;
  completed: number;
  updated_at: Date;
}

interface PlanCountRow extends RowDataPacket {
  total: number;
  completed: number;
  ongoing: number;
  passCount: number;
  totalExams: number;
  avgScore: number;
}

/**
 * 保存学习进度
 * POST /api/training/progress
 */
export const saveProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { planId, watchedTime, lastPosition, completed } = req.body;

  if (!planId) {
    return res.status(400).json({ success: false, message: '课程ID不能为空' });
  }

  const conn = await getConnection();

  // 检查是否已有进度记录
  const [existing] = await conn.execute<RowDataPacket[]>(
    'SELECT id FROM learning_progress WHERE course_id = ? AND user_id = ?',
    [planId, userId]
  );

  if (existing && existing.length > 0) {
    // 更新已有进度
    await conn.execute(
      'UPDATE learning_progress SET watched_seconds = ?, last_position = ?, is_completed = ?, updated_at = NOW() WHERE id = ?',
      [watchedTime || 0, lastPosition || 0, completed ? 1 : 0, existing[0].id]
    );
  } else {
    // 创建新进度记录
    await conn.execute<ResultSetHeader>(
      'INSERT INTO learning_progress (course_id, user_id, watched_seconds, last_position, is_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [planId, userId, watchedTime || 0, lastPosition || 0, completed ? 1 : 0]
    );
  }

  res.json({ success: true, message: '学习进度已保存' });
});

/**
 * 获取学习进度
 * GET /api/training/progress?planId=&userId=
 */
export const getProgress = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { planId } = req.query;

  if (!planId) {
    return res.status(400).json({ success: false, message: '课程ID不能为空' });
  }

  const conn = await getConnection();

  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT id, course_id, watched_seconds, last_position, is_completed, created_at, updated_at FROM learning_progress WHERE course_id = ? AND user_id = ?',
    [planId, userId]
  );

  if (rows && rows.length > 0) {
    res.json({
      success: true,
      data: {
        watchedTime: rows[0].watched_seconds,
        lastPosition: rows[0].last_position,
        completed: rows[0].is_completed === 1,
        updatedAt: rows[0].updated_at
      }
    });
  } else {
    res.json({
      success: true,
      data: { watchedTime: 0, lastPosition: 0, completed: false }
    });
  }
});

/**
 * 获取培训统计分析数据
 * GET /api/training/analysis?startDate=&endDate=&department=
 */
export const getAnalysis = asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, department } = req.query;
  const conn = await getConnection();

  let whereClause = 'WHERE 1=1';
  const params: any[] = [];

  if (startDate) {
    whereClause += ' AND p.start_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    whereClause += ' AND p.end_date <= ?';
    params.push(endDate);
  }
  if (department) {
    whereClause += ' AND p.target_department = ?';
    params.push(department);
  }

  // 1. 总体统计
  const [overall] = await conn.execute<PlanCountRow[]>(
    `SELECT
       COUNT(*) as total,
       SUM(IF(p.status = 3, 1, 0)) as completed,
       SUM(IF(p.status = 2, 1, 0)) as ongoing
     FROM training_plans p ${whereClause}`,
    params
  );

  // 2. 考试通过率统计
  const [examStats] = await conn.execute<PlanCountRow[]>(
    `SELECT
       COUNT(r.id) as totalExams,
       SUM(IF(r.is_passed = 1, 1, 0)) as passCount,
       COALESCE(AVG(r.exam_score), 0) as avgScore
     FROM training_records r
     LEFT JOIN training_plans p ON r.plan_id = p.id
     ${whereClause}`,
    params
  );

  // 3. 月度培训统计（按月份分组）
  const [monthlyStats] = await conn.execute<RowDataPacket[]>(
    `SELECT
       DATE_FORMAT(p.start_date, '%Y-%m') as month,
       COUNT(*) as total
     FROM training_plans p
     WHERE p.start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
     GROUP BY DATE_FORMAT(p.start_date, '%Y-%m')
     ORDER BY month`,
    []
  );

  // 4. 部门培训排名
  const [deptRanking] = await conn.execute<RowDataPacket[]>(
    `SELECT
       COALESCE(p.target_department, '未分配') as department,
       COUNT(*) as count
     FROM training_plans p
     ${whereClause}
     GROUP BY p.target_department
     ORDER BY count DESC
     LIMIT 10`,
    params
  );

  // 5. 月度通过率趋势（最近12个月）
  const [passRateTrend] = await conn.execute<RowDataPacket[]>(
    `SELECT
       DATE_FORMAT(p.start_date, '%Y-%m') as month,
       COUNT(r.id) as total,
       SUM(IF(r.is_passed = 1, 1, 0)) as passed
     FROM training_plans p
     LEFT JOIN training_records r ON p.id = r.plan_id
     WHERE p.start_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
     GROUP BY DATE_FORMAT(p.start_date, '%Y-%m')
     ORDER BY month`,
    []
  );

  const total = overall[0]?.total || 0;
  const examTotal = examStats[0]?.totalExams || 0;

  res.json({
    success: true,
    data: {
      kpi: {
        totalPlans: total,
        completedPlans: overall[0]?.completed || 0,
        ongoingPlans: overall[0]?.ongoing || 0,
        passRate: examTotal > 0 ? ((examStats[0]?.passCount || 0) / examTotal * 100).toFixed(1) + '%' : '0%',
        avgScore: examStats[0]?.avgScore ? Number(examStats[0].avgScore).toFixed(1) : '0',
        totalExams: examTotal
      },
      monthlyStats: monthlyStats.map((item: any) => ({
        month: item.month,
        count: item.total
      })),
      deptRanking: deptRanking.map((item: any) => ({
        department: item.department,
        count: item.count
      })),
      passRateTrend: passRateTrend.map((item: any) => ({
        month: item.month,
        total: item.total,
        passed: item.passed,
        rate: item.total > 0 ? ((item.passed / item.total) * 100).toFixed(1) : '0'
      }))
    }
  });
});

/**
 * 获取培训列表（含分页）
 * GET /api/training?page=&pageSize=&type=&status=&keyword=&startDate=&endDate=
 */
export const getTrainingList = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, pageSize = 20, type, status, keyword, startDate, endDate } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);

  const conn = await getConnection();

  let where = 'WHERE 1=1';
  const params: any[] = [];

  if (type) {
    where += ' AND p.type = ?';
    params.push(type);
  }
  if (status) {
    const statusMap: Record<string, number> = { pending: 1, ongoing: 2, completed: 3, cancelled: 4 };
    where += ' AND p.status = ?';
    params.push(statusMap[status as string] || 1);
  }
  if (keyword) {
    where += ' AND (p.title LIKE ? OR p.description LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }
  if (startDate) {
    where += ' AND p.start_date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    where += ' AND p.end_date <= ?';
    params.push(endDate);
  }

  const [countRows] = await conn.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM training_plans p ${where}`,
    params
  );
  const total = countRows[0]?.total || 0;

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT p.*,
       (SELECT COUNT(*) FROM training_records r WHERE r.plan_id = p.id) as participantCount
     FROM training_plans p ${where}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const statusNames: Record<number, string> = { 1: 'pending', 2: 'ongoing', 3: 'completed', 4: 'cancelled' };

  res.json({
    success: true,
    data: {
      list: rows.map((item: any) => ({
        ...item,
        statusText: statusNames[item.status] || 'unknown'
      })),
      pagination: { page: Number(page), pageSize: Number(pageSize), total }
    }
  });
});

/**
 * 获取单个培训计划
 * GET /api/training/:id
 */
export const getTrainingById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT p.*, (SELECT COUNT(*) FROM training_records r WHERE r.plan_id = p.id) as participantCount FROM training_plans p WHERE p.id = ?',
    [id]
  );
  if (!rows || rows.length === 0) {
    return res.status(404).json({ success: false, message: '培训计划不存在' });
  }
  const statusNames: Record<number, string> = { 1: 'pending', 2: 'ongoing', 3: 'completed', 4: 'cancelled' };
  res.json({
    success: true,
    data: { ...rows[0], statusText: statusNames[rows[0].status] || 'unknown' }
  });
});

/**
 * 创建培训计划
 * POST /api/training
 */
export const createTraining = asyncHandler(async (req: Request, res: Response) => {
  const { title, type, targetDepartment, startDate, endDate, hours, instructor, location, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: '培训主题不能为空' });
  }
  const conn = await getConnection();
  const planNo = `TR${Date.now()}`;
  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO training_plans (plan_no, title, type, target_department, start_date, end_date, hours, instructor, location, status, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())`,
    [planNo, title, type || '', targetDepartment || '', startDate || null, endDate || null, hours || 0, instructor || '', location || '', description || '']
  );
  res.status(201).json({
    success: true,
    message: '培训计划创建成功',
    data: { id: result.insertId, planNo }
  });
});

/**
 * 更新培训计划
 * PUT /api/training/:id
 */
export const updateTraining = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, type, targetDepartment, startDate, endDate, hours, instructor, location, status, description } = req.body;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM training_plans WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    return res.status(404).json({ success: false, message: '培训计划不存在' });
  }
  const statusMap: Record<string, number> = { pending: 1, ongoing: 2, completed: 3, cancelled: 4 };
  const statusValue = status ? (statusMap[status] || 1) : undefined;
  await conn.execute(
    `UPDATE training_plans SET title = ?, type = ?, target_department = ?, start_date = ?, end_date = ?, hours = ?, instructor = ?, location = ?, description = ?${statusValue ? ', status = ?' : ''}, updated_at = NOW() WHERE id = ?`,
    [title, type, targetDepartment, startDate, endDate, hours, instructor, location, description, ...(statusValue ? [statusValue] : []), id].filter(v => v !== undefined)
  );
  res.json({ success: true, message: '培训计划更新成功' });
});

/**
 * 删除培训计划（软删除：将状态设为已取消）
 * DELETE /api/training/:id
 */
export const deleteTraining = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const conn = await getConnection();
  const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM training_plans WHERE id = ?', [id]);
  if (!existing || existing.length === 0) {
    return res.status(404).json({ success: false, message: '培训计划不存在' });
  }
  // 软删除：将状态设为已取消
  await conn.execute('UPDATE training_plans SET status = 4, updated_at = NOW() WHERE id = ?', [id]);
  res.json({ success: true, message: '培训计划已取消' });
});

/**
 * 防挂机心跳 — 学习过程中定时上报
 * POST /api/training/heartbeat
 * Body: { courseId, sectionId, currentTime }
 * 
 * 每30秒调用一次，后端累计学习时长并防止挂机
 */
export const heartbeat = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { courseId, sectionId, currentTime } = req.body;

  if (!courseId) {
    return res.status(400).json({ success: false, message: '课程ID不能为空' });
  }

  const conn = await getConnection();

  // 1. 更新 learning_progress 表（如果存在则更新，不存在则创建）
  const [existing] = await conn.execute<RowDataPacket[]>(
    'SELECT id, watched_seconds, is_completed FROM learning_progress WHERE user_id = ? AND course_id = ?',
    [userId, courseId]
  );

  const heartbeatInterval = 30; // 每次心跳累加30秒

  if (existing && existing.length > 0) {
    const newWatched = (existing[0].watched_seconds || 0) + heartbeatInterval;
    await conn.execute(
      'UPDATE learning_progress SET watched_seconds = ?, last_position = ?, updated_at = NOW() WHERE id = ?',
      [newWatched, currentTime || 0, existing[0].id]
    );

    // 检查是否已完成（累计时长 >= 课程总时长）
    const [courseRows] = await conn.execute<RowDataPacket[]>(
      'SELECT duration FROM training_courses WHERE id = ?', [courseId]
    );
    const courseDuration = (courseRows[0] as any)?.duration || 0;

    if (courseDuration > 0 && newWatched >= courseDuration && existing[0].is_completed !== 1) {
      await conn.execute(
        'UPDATE learning_progress SET is_completed = 1, completed_at = NOW(), updated_at = NOW() WHERE id = ?',
        [existing[0].id]
      );
    }
  } else {
    await conn.execute(
      'INSERT INTO learning_progress (user_id, course_id, section_id, watched_seconds, last_position, is_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, NOW(), NOW())',
      [userId, courseId, sectionId || null, heartbeatInterval, currentTime || 0]
    );
  }

  // 2. 写入 learning_hours 学时记录（每日一条，累计时长）
  const today = new Date().toISOString().split('T')[0];
  const [hourRows] = await conn.execute<RowDataPacket[]>(
    'SELECT id, hours FROM learning_hours WHERE user_id = ? AND course_id = ? AND learning_date = ?',
    [userId, courseId, today]
  );

  if (hourRows && hourRows.length > 0) {
    const newHours = (Number(hourRows[0].hours) || 0) + heartbeatInterval / 3600;
    await conn.execute(
      'UPDATE learning_hours SET hours = ?, updated_at = NOW() WHERE id = ?',
      [newHours, hourRows[0].id]
    );
  } else {
    await conn.execute(
      'INSERT INTO learning_hours (user_id, course_id, learning_type, hours, learning_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [userId, courseId, 'online', heartbeatInterval / 3600, today]
    );
  }

  res.json({ code: 200, success: true, msg: '心跳已记录' });
});
