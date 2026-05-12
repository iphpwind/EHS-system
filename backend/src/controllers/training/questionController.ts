import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { NotFoundError } from '../../utils/errors';

export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 20, keyword, questionType, categoryId, difficulty } = req.query;
    const conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (keyword) { where += ' AND (question_content LIKE ?)'; params.push(`%${keyword}%`); }
    if (questionType) { where += ' AND question_type = ?'; params.push(questionType); }
    if (categoryId) { where += ' AND category_id = ?'; params.push(Number(categoryId)); }
    if (difficulty) { where += ' AND difficulty = ?'; params.push(difficulty); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM education_questions ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM education_questions ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`, [...params, Number(pageSize), offset]);
    // 解析JSON选项
    const list = rows.map((r: any) => ({ ...r, options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options }));
    res.json({ success: true, data: { list, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionType, categoryId, difficulty, questionContent, options, correctAnswer, analysis, score } = req.body;
    if (!questionType || !questionContent || !correctAnswer) return res.status(400).json({ success: false, message: '题型、题目内容和正确答案不能为空' });
    const conn = await getConnection();
    const userId = (req as any).user.userId;
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO education_questions (question_type, category_id, difficulty, question_content, options, correct_answer, analysis, score, created_by) VALUES (?,?,?,?,?,?,?,?,?)',
      [questionType, categoryId || null, difficulty || 'medium', questionContent, options ? JSON.stringify(options) : null, correctAnswer, analysis || '', score || 1, userId]);
    res.status(201).json({ success: true, message: '题目创建成功', data: { id: result.insertId } });
  } catch (e) { next(e); }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questionType, categoryId, difficulty, questionContent, options, correctAnswer, analysis, score, status } = req.body;
    const conn = await getConnection();
    await conn.execute(
      'UPDATE education_questions SET question_type=?, category_id=?, difficulty=?, question_content=?, options=?, correct_answer=?, analysis=?, score=?, status=? WHERE id=?',
      [questionType, categoryId || null, difficulty, questionContent, options ? JSON.stringify(options) : null, correctAnswer, analysis, score || 1, status !== undefined ? status : 1, req.params.id]);
    res.json({ success: true, message: '题目更新成功' });
  } catch (e) { next(e); }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    await conn.execute('DELETE FROM education_questions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '题目删除成功' });
  } catch (e) { next(e); }
};

export const batchImportQuestions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) return res.status(400).json({ success: false, message: '题目列表不能为空' });
    const conn = await getConnection();
    let imported = 0;
    for (const q of questions) {
      if (!q.questionType || !q.questionContent || !q.correctAnswer) continue;
      const userId = (req as any).user.userId;
      await conn.execute(
        'INSERT INTO education_questions (question_type, category_id, difficulty, question_content, options, correct_answer, analysis, score, created_by) VALUES (?,?,?,?,?,?,?,?,?)',
        [q.questionType, q.categoryId || null, q.difficulty || 'medium', q.questionContent, q.options ? JSON.stringify(q.options) : null, q.correctAnswer, q.analysis || '', q.score || 1, userId]);
      imported++;
    }
    res.status(201).json({ success: true, message: `成功导入 ${imported} 道题目` });
  } catch (e) { next(e); }
};
