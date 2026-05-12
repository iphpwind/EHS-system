import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../../config/database';
import { RowDataPacket } from 'mysql2';

/**
 * 获取用户完整培训档案
 * GET /api/training-v2/archive/:userId
 */
export const getUserArchive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId) || (req as any).user?.userId;
    if (!userId) return res.status(400).json({ success: false, message: '用户ID不能为空' });

    const conn = await getConnection();

    // 1. 用户基本信息
    const [userRows] = await conn.execute<RowDataPacket[]>(
      `SELECT u.id, u.real_name, u.user_name, u.department, u.position, u.phone
       FROM users u WHERE u.id = ?`, [userId]
    );
    const profile = userRows[0] || {};

    // 2. 学习记录汇总
    const [learnRows] = await conn.execute<RowDataPacket[]>(
      `SELECT lp.course_id, tc.title AS course_title, tc.duration,
              lp.watched_seconds, lp.is_completed, lp.updated_at
       FROM learning_progress lp
       INNER JOIN training_courses tc ON lp.course_id = tc.id
       WHERE lp.user_id = ? ORDER BY lp.updated_at DESC`, [userId]
    );

    // 3. 考试成绩汇总
    const [examRows] = await conn.execute<RowDataPacket[]>(
      `SELECT er.*, ep.title AS paper_title, ep.total_score
       FROM exam_results er
       LEFT JOIN exam_papers ep ON er.paper_id = ep.id
       WHERE er.user_id = ? ORDER BY er.submit_time DESC`, [userId]
    );

    // 4. 证书列表
    const [certRows] = await conn.execute<RowDataPacket[]>(
      `SELECT c.*, ct.name AS cert_type_name
       FROM certificates c
       LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
       WHERE c.user_id = ? ORDER BY c.expire_date DESC`, [userId]
    );

    // 5. 学时统计
    const [hourRows] = await conn.execute<RowDataPacket[]>(
      `SELECT learning_type, SUM(hours) AS total_hours
       FROM learning_hours WHERE user_id = ? GROUP BY learning_type`, [userId]
    );

    // 汇总统计
    const totalCourses = learnRows.length;
    const completedCourses = (learnRows as any[]).filter((r: any) => r.is_completed === 1).length;
    const totalExams = examRows.length;
    const passedExams = (examRows as any[]).filter((r: any) => r.is_passed === 1).length;
    const validCerts = (certRows as any[]).filter((r: any) => r.status === 1 && new Date(r.expire_date) > new Date()).length;
    const totalHours = (hourRows as any[]).reduce((sum: number, r: any) => sum + Number(r.total_hours || 0), 0);

    const archive = {
      profile,
      summary: { totalCourses, completedCourses, totalExams, passedExams, validCerts, totalHours },
      learningRecords: learnRows,
      examRecords: examRows.map((r: any) => ({
        ...r,
        answerDetails: r.answer_details ? JSON.parse(r.answer_details) : null,
      })),
      certificates: certRows,
      learningHours: hourRows,
    };

    res.json({ success: true, data: archive });
  } catch (e) { next(e); }
};

/**
 * 导出用户培训档案为 PDF（简化版：返回 JSON）
 * GET /api/training-v2/archive/:userId/pdf
 * 
 * 注：如需真实 PDF 生成，可启用 puppeteer（已在 package.json 依赖中）
 */
export const exportArchivePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = Number(req.params.userId) || (req as any).user?.userId;
    if (!userId) return res.status(400).json({ success: false, message: '用户ID不能为空' });

    const conn = await getConnection();

    const [userRows] = await conn.execute<RowDataPacket[]>(
      `SELECT u.id, u.real_name, u.user_name, u.department, u.position FROM users u WHERE u.id = ?`, [userId]
    );
    const profile = userRows[0] || {};

    const [learnRows] = await conn.execute<RowDataPacket[]>(
      `SELECT tc.title, lp.watched_seconds, lp.is_completed
       FROM learning_progress lp INNER JOIN training_courses tc ON lp.course_id = tc.id
       WHERE lp.user_id = ?`, [userId]
    );

    const [examRows] = await conn.execute<RowDataPacket[]>(
      `SELECT er.exam_score, er.is_passed, ep.title AS paper_title, er.submit_time
       FROM exam_results er LEFT JOIN exam_papers ep ON er.paper_id = ep.id
       WHERE er.user_id = ?`, [userId]
    );

    const [certRows] = await conn.execute<RowDataPacket[]>(
      `SELECT c.cert_name, c.expire_date, ct.name AS cert_type_name
       FROM certificates c LEFT JOIN certificate_type_dict ct ON c.cert_type_id = ct.id
       WHERE c.user_id = ?`, [userId]
    );

    // 尝试使用 puppeteer 生成 PDF
    try {
      const puppeteer = require('puppeteer-core');
      // 生成 HTML 报告
      const html = buildArchiveHtml(profile as any, learnRows as any[], examRows as any[], certRows as any[]);
      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch {
      // puppeteer 不可用，返回 JSON
      res.json({
        success: true,
        message: 'PDF 生成功能需要配置 Chromium 环境（puppeteer-core），当前返回 JSON 数据',
        data: { profile, learningRecords: learnRows, examRecords: examRows, certificates: certRows }
      });
    }
  } catch (e) { next(e); }
};

function buildArchiveHtml(profile: any, learns: any[], exams: any[], certs: any[]): string {
  const now = new Date().toLocaleDateString('zh-CN');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>安全培训档案</title>
<style>
  body{font-family:'Microsoft YaHei',sans-serif;padding:40px;color:#333}
  h1{text-align:center;font-size:24px;margin-bottom:5px}
  .subtitle{text-align:center;color:#666;margin-bottom:30px}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th,td{border:1px solid #ddd;padding:8px 12px;font-size:14px}
  th{background:#f0f5ff;font-weight:600}
  .section{margin-bottom:30px}
  .section-title{font-size:16px;font-weight:700;border-left:4px solid #1a56db;padding-left:10px;margin-bottom:10px}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}
  .info-item{display:flex}.info-label{color:#666;width:80px}.info-value{font-weight:600}
</style></head><body>
<h1>安全生产培训教育档案</h1>
<p class="subtitle">打印日期：${now}｜化工企业EHS平台</p>
<div class="section"><div class="section-title">基本信息</div>
<div class="info-grid">
<div class="info-item"><span class="info-label">姓名：</span><span class="info-value">${profile.real_name || '-'}</span></div>
<div class="info-item"><span class="info-label">部门：</span><span class="info-value">${profile.department || '-'}</span></div>
<div class="info-item"><span class="info-label">岗位：</span><span class="info-value">${profile.position || '-'}</span></div>
</div></div>
<div class="section"><div class="section-title">学习记录</div>
<table><thead><tr><th>课程名称</th><th>学习时长</th><th>完成状态</th></tr></thead><tbody>
${learns.map((l: any) => `<tr><td>${l.title}</td><td>${Math.floor((l.watched_seconds || 0) / 60)}分钟</td><td>${l.is_completed ? '✅ 已完成' : '⏳ 学习中'}</td></tr>`).join('')}
</tbody></table></div>
<div class="section"><div class="section-title">考试记录</div>
<table><thead><tr><th>试卷名称</th><th>分数</th><th>结果</th><th>考试时间</th></tr></thead><tbody>
${exams.map((e: any) => `<tr><td>${e.paper_title}</td><td>${e.exam_score}</td><td>${e.is_passed ? '✅ 通过' : '❌ 未通过'}</td><td>${e.submit_time}</td></tr>`).join('')}
</tbody></table></div>
<div class="section"><div class="section-title">持有的证书</div>
<table><thead><tr><th>证书名称</th><th>类型</th><th>有效期至</th></tr></thead><tbody>
${certs.map((c: any) => `<tr><td>${c.cert_name}</td><td>${c.cert_type_name || '-'}</td><td>${c.expire_date || '-'}</td></tr>`).join('')}
</tbody></table></div></body></html>`;
}
