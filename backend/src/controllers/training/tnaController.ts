import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

/**
 * 获取用户必修课程列表（基于岗位匹配）
 * GET /api/training-v2/tna/required-courses?userId=
 */
export const getRequiredCourses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.query.userId) || (req as any).user?.userId;
    if (!userId) return res.status(400).json({ success: false, message: '用户ID不能为空' });

    const conn = await getConnection();

    // 获取用户岗位
    const [userRows] = await conn.execute<RowDataPacket[]>(
      'SELECT position FROM users WHERE id = ?', [userId]
    );
    const position = (userRows[0] as any)?.position || '';

    // 查询岗位匹配的课程
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT pcm.*, tc.title AS course_title, tc.course_no, tc.duration, tc.instructor,
              lp.is_completed, lp.watched_seconds, lp.updated_at AS progress_updated
       FROM position_course_mapping pcm
       INNER JOIN training_courses tc ON pcm.course_id = tc.id
       LEFT JOIN learning_progress lp ON lp.course_id = tc.id AND lp.user_id = ?
       WHERE pcm.position_name = ? OR pcm.position_name = '全员'
       ORDER BY pcm.requirement_level = 'required' DESC, tc.title`,
      [userId, position]
    );

    const courses = rows.map((r: any) => ({
      mappingId: r.id,
      courseId: r.course_id,
      courseTitle: r.course_title,
      courseNo: r.course_no,
      duration: r.duration,
      instructor: r.instructor,
      requirementLevel: r.requirement_level,
      isCompleted: r.is_completed === 1,
      watchedSeconds: r.watched_seconds || 0,
      progressUpdated: r.progress_updated,
    }));

    res.json({ success: true, data: { position, courses } });
  } catch (e) { next(e); }
};

/**
 * 自动检测岗位变动并下发培训任务
 * 由定时任务调用
 */
export async function autoAssignTasks(): Promise<{ assigned: number; errors: string[] }> {
  let assigned = 0;
  const errors: string[] = [];
  const conn = await getConnection();

  try {
    // 查询最近岗位变动的用户（简化版：直接从 training_tasks 未下发的新岗位判断）
    const [users] = await conn.execute<RowDataPacket[]>(
      `SELECT u.id, u.position FROM users u WHERE u.position IS NOT NULL AND u.position != ''`
    );

    for (const user of users as any[]) {
      try {
        // 查询该岗位的必修课程
        const [courses] = await conn.execute<RowDataPacket[]>(
          `SELECT pcm.course_id FROM position_course_mapping pcm
           WHERE (pcm.position_name = ? OR pcm.position_name = '全员')
             AND pcm.requirement_level = 'required'`,
          [user.position]
        );

        for (const course of courses as any[]) {
          // 检查是否已有未完成的任务
          const [existing] = await conn.execute<RowDataPacket[]>(
            `SELECT id FROM training_tasks WHERE user_id = ? AND course_id = ? AND status IN ('pending','in_progress')`,
            [user.id, course.course_id]
          );

          if (!existing || existing.length === 0) {
            // 检查是否已完成学习
            const [progress] = await conn.execute<RowDataPacket[]>(
              `SELECT id FROM learning_progress WHERE user_id = ? AND course_id = ? AND is_completed = 1`,
              [user.id, course.course_id]
            );

            if (!progress || progress.length === 0) {
              await conn.execute(
                `INSERT INTO training_tasks (user_id, course_id, task_type, status, due_date, assigned_at)
                 VALUES (?, ?, 'position_change', 'pending', DATE_ADD(NOW(), INTERVAL 30 DAY), NOW())`,
                [user.id, course.course_id]
              );
              assigned++;
            }
          }
        }
      } catch (e) {
        errors.push(`用户${user.id}: ${(e as Error).message}`);
      }
    }
  } finally {
    conn.release();
  }

  return { assigned, errors };
}

/**
 * 获取培训矩阵总表（管理后台用）
 * GET /api/training-v2/tna/matrix
 */
export const getTrainingMatrix = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT pcm.id, pcm.position_name, pcm.course_id, tc.title AS course_title,
              pcm.requirement_level, pcm.created_at
       FROM position_course_mapping pcm
       INNER JOIN training_courses tc ON pcm.course_id = tc.id
       ORDER BY pcm.position_name, tc.title`
    );
    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
};

/**
 * 获取用户的培训任务列表
 * GET /api/training-v2/tna/tasks?userId=&status=
 */
export const getTrainingTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.query.userId) || (req as any).user?.userId;
    const { status } = req.query;
    const conn = await getConnection();

    let where = 'WHERE tt.user_id = ?';
    const params: any[] = [userId];
    if (status) { where += ' AND tt.status = ?'; params.push(status); }

    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT tt.*, tc.title AS course_title, tc.course_no, tc.duration
       FROM training_tasks tt
       INNER JOIN training_courses tc ON tt.course_id = tc.id
       ${where} ORDER BY tt.assigned_at DESC`,
      params
    );

    res.json({ success: true, data: rows });
  } catch (e) { next(e); }
};
