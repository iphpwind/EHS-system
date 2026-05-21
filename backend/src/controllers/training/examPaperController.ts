import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getPaperList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword } = req.query;
    conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ? OR paper_no LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM exam_papers ${where}`, params);
    const total = (countRows as any[])[0]?.total || 0;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM exam_papers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const getPaperById = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM exam_papers WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: '试卷不存在' });
    const paper = (rows as any[])[0];
    if (paper.fixed_questions) paper.fixedQuestions = typeof paper.fixed_questions === 'string' ? JSON.parse(paper.fixed_questions) : paper.fixed_questions;
    if (paper.random_rule) paper.randomRule = typeof paper.random_rule === 'string' ? JSON.parse(paper.random_rule) : paper.random_rule;
    res.json({ success: true, data: paper });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const createPaper = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { title, description, totalScore, passScore, durationMinutes, isRandom, fixedQuestions, randomRule, allowRetake, maxAttempts } = req.body;
    if (!title) return res.status(400).json({ success: false, message: '试卷标题不能为空' });
    conn = await getConnection();
    const paperNo = `EX${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const qCount = isRandom ? 0 : (Array.isArray(fixedQuestions) ? fixedQuestions.length : 0);
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO exam_papers (paper_no, title, description, total_score, pass_score, duration_minutes, question_count, is_random, fixed_questions, random_rule, allow_retake, max_attempts, status, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, NOW(), NOW())',
      [paperNo, title, description || '', totalScore || 100, passScore || 60, durationMinutes || 60, qCount, isRandom ? 1 : 0, isRandom ? null : (fixedQuestions ? JSON.stringify(fixedQuestions) : null), isRandom ? JSON.stringify(randomRule) : null, allowRetake ? 1 : 0, maxAttempts || 3, (req as any).user?.userId]
    );
    res.status(201).json({ success: true, message: '试卷创建成功', data: { id: (result as any).insertId, paperNo } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const updatePaper = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { title, description, totalScore, passScore, durationMinutes, fixedQuestions, allowRetake, maxAttempts, status } = req.body;
    conn = await getConnection();
    const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM exam_papers WHERE id = ?', [req.params.id]);
    if (!(existing as any[])[0]) return res.status(404).json({ success: false, message: '试卷不存在' });
    const fields: string[] = [];
    const params: any[] = [];
    if (title !== undefined) { fields.push('title = ?'); params.push(title); }
    if (description !== undefined) { fields.push('description = ?'); params.push(description); }
    if (totalScore !== undefined) { fields.push('total_score = ?'); params.push(totalScore); }
    if (passScore !== undefined) { fields.push('pass_score = ?'); params.push(passScore); }
    if (durationMinutes !== undefined) { fields.push('duration_minutes = ?'); params.push(durationMinutes); }
    if (fixedQuestions !== undefined) { fields.push('fixed_questions = ?'); params.push(fixedQuestions ? JSON.stringify(fixedQuestions) : null); }
    if (allowRetake !== undefined) { fields.push('allow_retake = ?'); params.push(allowRetake ? 1 : 0); }
    if (maxAttempts !== undefined) { fields.push('max_attempts = ?'); params.push(maxAttempts); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    fields.push('updated_at = NOW()');
    params.push(req.params.id);
    if (fields.length > 0) {
      await conn.execute(`UPDATE exam_papers SET ${fields.join(', ')} WHERE id = ?`, params);
    }
    res.json({ success: true, message: '试卷更新成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const deletePaper = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('DELETE FROM exam_papers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '试卷删除成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};
