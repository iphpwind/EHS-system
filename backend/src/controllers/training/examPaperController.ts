import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getPaperList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 20, keyword } = req.query;
    const conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (keyword) { where += ' AND (title LIKE ?)'; params.push(`%${keyword}%`); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM exam_papers ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT id, paper_no, title, total_score, pass_score, duration_minutes, question_count, is_random, allow_retake, max_attempts, status, created_at FROM exam_papers ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
};

export const getPaperById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM exam_papers WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ success: false, message: '试卷不存在' });
    const paper = rows[0];
    if (paper.fixed_questions) paper.fixedQuestions = typeof paper.fixed_questions === 'string' ? JSON.parse(paper.fixed_questions) : paper.fixed_questions;
    if (paper.random_rule) paper.randomRule = typeof paper.random_rule === 'string' ? JSON.parse(paper.random_rule) : paper.random_rule;
    // 加载固定题目
    let questions: any[] = [];
    if (!paper.is_random && paper.fixedQuestions && paper.fixedQuestions.length > 0) {
      const ids = paper.fixedQuestions.map((id: number) => id.toString());
      const [qRows] = await conn.execute<RowDataPacket[]>(`SELECT id, question_type, question_content, options, score, difficulty FROM education_questions WHERE id IN (${ids.join(',')})`);
      questions = qRows.map((q: any) => ({ ...q, options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options }));
    }
    res.json({ success: true, data: { ...paper, questions } });
  } catch (e) { next(e); }
};

export const createPaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, categoryId, totalScore, passScore, durationMinutes, isRandom, fixedQuestions, randomRule, allowRetake, maxAttempts } = req.body;
    if (!title) return res.status(400).json({ success: false, message: '试卷标题不能为空' });
    const conn = await getConnection();
    const userId = (req as any).user.userId;
    const paperNo = `EX${Date.now()}`;
    const qCount = isRandom ? 0 : (Array.isArray(fixedQuestions) ? fixedQuestions.length : 0);
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO exam_papers (paper_no, title, description, category_id, total_score, pass_score, duration_minutes, question_count, is_random, fixed_questions, random_rule, allow_retake, max_attempts, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [paperNo, title, description || '', categoryId || null, totalScore || 100, passScore || 60, durationMinutes || 60, qCount, isRandom ? 1 : 0, isRandom ? null : (fixedQuestions ? JSON.stringify(fixedQuestions) : null), isRandom ? JSON.stringify(randomRule) : null, allowRetake !== undefined ? (allowRetake ? 1 : 0) : 1, maxAttempts || 3, userId]);
    res.status(201).json({ success: true, message: '试卷创建成功', data: { id: result.insertId, paperNo } });
  } catch (e) { next(e); }
};

export const updatePaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, totalScore, passScore, durationMinutes, fixedQuestions, allowRetake, maxAttempts, status } = req.body;
    const conn = await getConnection();
    const qCount = Array.isArray(fixedQuestions) ? fixedQuestions.length : 0;
    await conn.execute(
      'UPDATE exam_papers SET title=?, description=?, total_score=?, pass_score=?, duration_minutes=?, question_count=?, fixed_questions=?, allow_retake=?, max_attempts=?, status=? WHERE id=?',
      [title, description, totalScore, passScore, durationMinutes, qCount, fixedQuestions ? JSON.stringify(fixedQuestions) : null, allowRetake ? 1 : 0, maxAttempts || 3, status || 1, req.params.id]);
    res.json({ success: true, message: '试卷更新成功' });
  } catch (e) { next(e); }
};

export const deletePaper = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM exam_papers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '试卷删除成功' });
  } catch (e) { next(e); }
};
