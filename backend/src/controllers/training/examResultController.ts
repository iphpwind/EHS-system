import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

export const getExamResultList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 20, userId, paperId, isPassed } = req.query;
    const conn = await getConnection();
    let where = 'WHERE 1=1';
    const params: any[] = [];
    if (userId) { where += ' AND r.user_id = ?'; params.push(Number(userId)); }
    if (paperId) { where += ' AND r.paper_id = ?'; params.push(Number(paperId)); }
    if (isPassed !== undefined) { where += ' AND r.is_passed = ?'; params.push(isPassed === 'true' ? 1 : 0); }
    const [countRows] = await conn.execute<RowDataPacket[]>(`SELECT COUNT(*) as total FROM exam_results r ${where}`, params);
    const total = countRows[0].total;
    const offset = (Number(page) - 1) * Number(pageSize);
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT r.*, u.real_name as user_name, p.title as paper_title FROM exam_results r LEFT JOIN users u ON r.user_id = u.id LEFT JOIN exam_papers p ON r.paper_id = p.id ${where} ORDER BY r.created_at DESC LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]);
    res.json({ success: true, data: { list: rows, pagination: { page: Number(page), pageSize: Number(pageSize), total } } });
  } catch (e) { next(e); }
};

export const startExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paperId } = req.body;
    const userId = (req as any).user.userId;
    if (!paperId) return res.status(400).json({ success: false, message: '试卷ID不能为空' });
    const conn = await getConnection();
    // 检查试卷
    const [papers] = await conn.execute<RowDataPacket[]>('SELECT * FROM exam_papers WHERE id = ? AND status = 1', [paperId]);
    if (!papers[0]) return res.status(404).json({ success: false, message: '试卷不存在或已禁用' });
    const paper = papers[0];
    // 检查考试次数
    if (!paper.allow_retake) {
      const [existing] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as cnt FROM exam_results WHERE user_id = ? AND paper_id = ? AND status = ?', [userId, paperId, 'completed']);
      if (existing[0].cnt > 0) return res.status(400).json({ success: false, message: '已参加过此考试，不允许重考' });
    }
    // 生成题目
    let questions: any[] = [];
    if (paper.is_random && paper.random_rule) {
      const rule = typeof paper.random_rule === 'string' ? JSON.parse(paper.random_rule) : paper.random_rule;
      for (const r of rule) {
        const [qRows] = await conn.execute<RowDataPacket[]>(
          'SELECT id, question_type, question_content, options, score FROM education_questions WHERE question_type = ? AND status = 1 ORDER BY RAND() LIMIT ?', [r.type, r.count]);
        questions = questions.concat(qRows);
      }
    } else if (paper.fixed_questions) {
      const ids = (typeof paper.fixed_questions === 'string' ? JSON.parse(paper.fixed_questions) : paper.fixed_questions);
      if (ids.length > 0) {
        const placeholders = ids.map(() => '?').join(',');
        const [qRows] = await conn.execute<RowDataPacket[]>(`SELECT id, question_type, question_content, options, score FROM education_questions WHERE id IN (${placeholders}) AND status = 1`, ids);
        questions = qRows;
      }
    }
    // 创建考试记录
    const [result] = await conn.execute<OkPacket>(
      'INSERT INTO exam_results (user_id, paper_id, attempt_no, total_score, start_time, status) VALUES (?,?,(SELECT COALESCE(MAX(attempt_no),0)+1 FROM exam_results WHERE user_id=? AND paper_id=?),?,NOW(),?)',
      [userId, paperId, userId, paperId, paper.total_score, 'in_progress']);
    // 返回题目（不含答案）
    const safeQuestions = questions.map((q: any) => ({
      id: q.id, questionType: q.question_type, questionContent: q.question_content,
      options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options, score: q.score
    }));
    res.json({ success: true, data: { examId: result.insertId, paperTitle: paper.title, totalScore: paper.total_score, passScore: paper.pass_score, durationMinutes: paper.duration_minutes, questions: safeQuestions } });
  } catch (e) { next(e); }
};

export const submitExam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { examId, answers } = req.body;
    const userId = (req as any).user.userId;
    if (!examId || !answers) return res.status(400).json({ success: false, message: '参数不完整' });
    const conn = await getConnection();
    const [records] = await conn.execute<RowDataPacket[]>('SELECT er.*, p.pass_score, p.is_random, p.fixed_questions, p.random_rule FROM exam_results er LEFT JOIN exam_papers p ON er.paper_id = p.id WHERE er.id = ? AND er.user_id = ?', [examId, userId]);
    if (!records[0]) return res.status(404).json({ success: false, message: '考试记录不存在' });
    const exam = records[0];
    // 自动评分
    let totalScore = 0;
    const gradedAnswers: any[] = [];
    for (const ans of answers) {
      const [qRows] = await conn.execute<RowDataPacket[]>('SELECT id, question_type, correct_answer, score FROM education_questions WHERE id = ?', [ans.questionId]);
      if (qRows[0]) {
        const q = qRows[0];
        const isCorrect = q.correct_answer.trim().toLowerCase() === String(ans.answer).trim().toLowerCase();
        if (isCorrect) totalScore += q.score;
        gradedAnswers.push({ questionId: q.id, userAnswer: ans.answer, correctAnswer: q.correct_answer, score: isCorrect ? q.score : 0, isCorrect });
      }
    }
    const isPassed = totalScore >= (exam.pass_score || 60);
    const durationSecs = Math.floor((Date.now() - new Date(exam.start_time).getTime()) / 1000);
    await conn.execute(
      "UPDATE exam_results SET score=?, is_passed=?, answers_json=?, submit_time=NOW(), duration_seconds=?, auto_grade=1, status='completed' WHERE id=?",
      [totalScore, isPassed ? 1 : 0, JSON.stringify(gradedAnswers), durationSecs, examId]);
    res.json({ success: true, message: '考试提交成功', data: { score: totalScore, totalScore: exam.total_score, isPassed, durationSeconds: durationSecs } });
  } catch (e) { next(e); }
};
