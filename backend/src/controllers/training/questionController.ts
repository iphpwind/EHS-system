import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { NotFoundError } from '../../utils/errors';

export const getQuestionList = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword, questionType, categoryId, difficulty } = req.query;
    conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (keyword) { where += ' AND (question_content LIKE ?)'; params.push(`%${keyword}%`); }
    if (questionType) { where += ' AND question_type = ?'; params.push(questionType); }
    if (categoryId) { where += ' AND category_id = ?'; params.push(Number(categoryId)); }
    if (difficulty) { where += ' AND difficulty = ?'; params.push(difficulty); }
    const [countRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM education_questions ' + where, params);
    const total = (countRows as any[])[0]?.total || 0;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM education_questions ' + where + ' ORDER BY created_at DESC LIMIT ? OFFSET ?', [...params, Number(pageSize), offset]);
    const list = (rows as any[]).map(r => ({ ...r, options: typeof r.options === 'string' ? JSON.parse(r.options) : r.options }));
    res.json({ success: true, data: { list, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM education_questions WHERE id = ?', [req.params.id]);
    if (!rows[0]) throw new NotFoundError('题目不存在');
    const q = rows[0] as any;
    if (q.options && typeof q.options === 'string') q.options = JSON.parse(q.options);
    res.json({ success: true, data: q });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { questionType, categoryId, difficulty, questionContent, options, correctAnswer, analysis, score } = req.body;
    if (!questionType || !questionContent || !correctAnswer) return res.status(400).json({ success: false, message: '题型、题目内容和正确答案不能为空' });
    conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO education_questions (question_type, category_id, difficulty, question_content, options, correct_answer, analysis, score, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [questionType, categoryId || null, difficulty || 'medium', questionContent, options ? JSON.stringify(options) : null, correctAnswer, analysis || '', score || 1, (req as any).user?.userId]
    );
    res.status(201).json({ success: true, message: '题目创建成功', data: { id: result.insertId } });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { questionType, categoryId, difficulty, questionContent, options, correctAnswer, analysis, score, status } = req.body;
    conn = await getConnection();
    const [existing] = await conn.execute<RowDataPacket[]>('SELECT id FROM education_questions WHERE id = ?', [req.params.id]);
    if (!existing[0]) throw new NotFoundError('题目不存在');
    const fields: string[] = [];
    const params: any[] = [];
    if (questionType !== undefined) { fields.push('question_type = ?'); params.push(questionType); }
    if (categoryId !== undefined) { fields.push('category_id = ?'); params.push(categoryId); }
    if (difficulty !== undefined) { fields.push('difficulty = ?'); params.push(difficulty); }
    if (questionContent !== undefined) { fields.push('question_content = ?'); params.push(questionContent); }
    if (options !== undefined) { fields.push('options = ?'); params.push(JSON.stringify(options)); }
    if (correctAnswer !== undefined) { fields.push('correct_answer = ?'); params.push(correctAnswer); }
    if (analysis !== undefined) { fields.push('analysis = ?'); params.push(analysis); }
    if (score !== undefined) { fields.push('score = ?'); params.push(score); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    fields.push('updated_at = NOW()');
    params.push(req.params.id);
    if (fields.length > 0) {
      await conn.execute('UPDATE education_questions SET ' + fields.join(', ') + ' WHERE id = ?', params);
    }
    res.json({ success: true, message: '题目更新成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    await conn.execute('DELETE FROM education_questions WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: '题目删除成功' });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};

export const batchImportQuestions = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) return res.status(400).json({ success: false, message: '题目列表不能为空' });
    conn = await getConnection();
    let imported = 0;
    for (const q of questions) {
      if (!q.questionType || !q.questionContent || !q.correctAnswer) continue;
      await conn.execute(
        'INSERT INTO education_questions (question_type, category_id, difficulty, question_content, options, correct_answer, analysis, score, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [q.questionType, q.categoryId || null, q.difficulty || 'medium', q.questionContent, q.options ? JSON.stringify(q.options) : null, q.correctAnswer, q.analysis || '', q.score || 1, (req as any).user?.userId]
      );
      imported++;
    }
    res.status(201).json({ success: true, message: `成功导入 ${imported} 道题目` });
  } catch (e) { next(e); } finally {
    if (conn) conn.release();
  }
};
