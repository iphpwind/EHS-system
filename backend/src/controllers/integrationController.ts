import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';

/**
 * 隐患→培训联动：某部门违章排行靠前时，自动推送定向培训
 * POST /api/integration/hazard-to-training
 * Body: { deptId, hazardType, reason }
 */
export const hazardToTraining = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { deptId, hazardType, reason } = req.body;
    if (!deptId) return res.status(400).json({ success: false, message: '部门ID不能为空' });

    const conn = await getConnection();

    // 查找与该隐患类型相关的课程
    const [courses] = await conn.execute<RowDataPacket[]>(
      `SELECT id, title FROM training_courses WHERE title LIKE ? AND status = 1 LIMIT 5`,
      [`%${hazardType || ''}%`]
    );

    // 获取该部门所有用户
    const [users] = await conn.execute<RowDataPacket[]>(
      `SELECT id FROM users WHERE department_id = ?`, [deptId]
    );

    let assigned = 0;
    for (const course of courses as any[]) {
      for (const user of users as any[]) {
        const [existing] = await conn.execute<RowDataPacket[]>(
          `SELECT id FROM training_tasks WHERE user_id = ? AND course_id = ? AND status IN ('pending','in_progress')`,
          [user.id, course.id]
        );
        if (!existing || existing.length === 0) {
          await conn.execute(
            `INSERT INTO training_tasks (user_id, course_id, task_type, status, assigned_by) VALUES (?, ?, 'moc', 'pending', ?)`,
            [user.id, course.id, (req as any).user?.userId || 0]
          );
          assigned++;
        }
      }
    }

    res.json({
      success: true,
      message: `已为部门推送 ${assigned} 条定向培训任务`,
      data: { deptId, coursesCount: (courses as any[]).length, assigned }
    });
  } catch (e) { next(e); }
};

/**
 * 事故→培训联动：事故发生后，一键推送全员安全教育
 * POST /api/integration/accident-to-training
 * Body: { accidentId, title, reason, targetUserIds? }
 */
export const accidentToTraining = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { accidentId, title, reason, targetUserIds } = req.body;
    if (!title && !accidentId) return res.status(400).json({ success: false, message: '事故标题或ID不能为空' });

    const conn = await getConnection();

    // 查找以案促教相关课程
    const [courses] = await conn.execute<RowDataPacket[]>(
      `SELECT id, title FROM training_courses WHERE title LIKE '%事故%' OR title LIKE '%案例%' OR title LIKE ? AND status = 1 LIMIT 5`,
      [`%${title || ''}%`]
    );

    // 目标用户：指定列表 或 全员
    let userIds: number[] = [];
    if (targetUserIds && Array.isArray(targetUserIds) && targetUserIds.length > 0) {
      userIds = targetUserIds;
    } else {
      const [allUsers] = await conn.execute<RowDataPacket[]>(
        `SELECT id FROM users WHERE status = 1`
      );
      userIds = (allUsers as any[]).map((u: any) => u.id);
    }

    let assigned = 0;
    for (const course of courses as any[]) {
      for (const uid of userIds) {
        await conn.execute(
          `INSERT INTO training_tasks (user_id, course_id, task_type, status, assigned_by) VALUES (?, ?, 'moc', 'pending', ?)`,
          [uid, course.id, (req as any).user?.userId || 0]
        );
        assigned++;
      }
    }

    res.json({
      success: true,
      message: `已为 ${userIds.length} 名员工推送 "${title || reason || '以案促教'}" 培训`,
      data: { userIdsCount: userIds.length, assigned }
    });
  } catch (e) { next(e); }
};

/**
 * PTW 联动检查：返回用户是否有资格执行某类作业
 * GET /api/integration/ptw-check?userId=&workType=
 */
export const ptwCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.query.userId) || (req as any).user?.userId;
    const { workType } = req.query;
    if (!workType) return res.status(400).json({ success: false, message: '作业类型不能为空' });

    const { checkTrainingEligibility } = require('./trainingChecker');
    const result = await checkTrainingEligibility(userId, workType as string);

    const conn = await getConnection();
    // 额外获取用户的证书列表
    const [certs] = await conn.execute<RowDataPacket[]>(
      `SELECT c.*, ct.name AS cert_type_name, DATEDIFF(c.expire_date, NOW()) AS days_remaining
       FROM certificates c LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
       WHERE c.user_id = ? AND c.status = 1 ORDER BY c.expire_date ASC`, [userId]
    );

    res.json({
      success: true,
      data: {
        ...result,
        userId,
        workType,
        certificates: certs,
      }
    });
  } catch (e) { next(e); }
};
