import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { NotFoundError } from '../../utils/errors';

interface CourseRow extends RowDataPacket { id: number; }

export const getCourseList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword, status, categoryId } = req.query;
    conn = await getConnection();
    let where = 'WHERE is_deleted = 0';
    const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ? OR course_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (status) { where += ' AND status = ?'; params.push(Number(status)); }
    if (categoryId) { where += ' AND category_id = ?'; params.push(Number(categoryId)); }
    const [countRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM training_courses ' + where, params);
    const total = (countRows as any[])[0]?.total || 0;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM training_courses ' + where + ' ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [...params, Number(pageSize), offset]
    );
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const getCourseById = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM training_courses WHERE id = ?', [req.params.id]);
    if (!rows[0]) throw new NotFoundError('课程不存在');
    const [sections] = await conn.execute<RowDataPacket[]>('SELECT * FROM course_sections WHERE course_id = ? ORDER BY section_no ASC', [req.params.id]);
    res.json({ success: true, data: { ...rows[0], sections } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const createCourse = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { title, categoryId, courseType, description, duration, videoUrl, coverUrl, instructor, difficulty, isMandatory, targetDepartments } = req.body;
    const userId = (req as any).user?.userId;
    if (!title) return res.status(400).json({ success: false, message: '课程标题不能为空' });
    conn = await getConnection();
    const courseNo = `C${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO training_courses (course_no, title, category_id, course_type, description, duration, video_url, cover_url, instructor, difficulty, is_mandatory, target_departments, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [courseNo, title, categoryId || null, courseType || 'video', description || '', duration || 0, videoUrl || '', coverUrl || '', instructor || '', difficulty || 'medium', isMandatory ? 1 : 0, targetDepartments ? JSON.stringify(targetDepartments) : null, userId]
    );
    res.status(201).json({ success: true, message: '课程创建成功', data: { id: result.insertId, courseNo } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { title, categoryId, description, duration, videoUrl, coverUrl, instructor, difficulty, status } = req.body;
    conn = await getConnection();
    const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM training_courses WHERE id = ?', [req.params.id]);
    if (!existing[0]) throw new NotFoundError('课程不存在');
    await conn.execute(
      'UPDATE training_courses SET title=?, category_id=?, description=?, duration=?, video_url=?, cover_url=?, instructor=?, difficulty=?, status=?, updated_at=NOW() WHERE id=?',
      [title, categoryId || null, description, duration, videoUrl, coverUrl, instructor, difficulty, status !== undefined ? status : 1, req.params.id]
    );
    res.json({ success: true, message: '课程更新成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('UPDATE training_courses SET is_deleted = 1, updated_at = NOW() WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '课程删除成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};
