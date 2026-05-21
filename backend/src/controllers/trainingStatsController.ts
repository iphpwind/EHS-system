import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

/**
 * 教育培训统计与可视化 API (P2-3)
 * 完善培训体系，增强统计分析和可视化
 */

// ============ 培训统计概览 ============

/**
 * 获取培训统计概览
 */
export const getTrainingStats = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // 培训记录统计
    const [trainingStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
         SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
         SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired
       FROM training_records`
    );
    
    // 课程统计
    const [courseStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft,
         SUM(CASE WHEN type = 'video' THEN 1 ELSE 0 END) as video,
         SUM(CASE WHEN type = 'document' THEN 1 ELSE 0 END) as document,
         SUM(CASE WHEN type = 'offline' THEN 1 ELSE 0 END) as offline
       FROM training_courses
       WHERE is_deleted = 0`
    );
    
    // 考试统计
    const [examStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN score >= passing_score THEN 1 ELSE 0 END) as passed,
         SUM(CASE WHEN score < passing_score THEN 1 ELSE 0 END) as failed,
         ROUND(AVG(score), 1) as avg_score,
         ROUND(AVG(score) * 100 / total_score, 1) as avg_score_rate
       FROM exam_results`
    );
    
    // 证书统计
    const [certStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN status = 'valid' THEN 1 ELSE 0 END) as valid,
         SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
         SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
       FROM certificates`
    );
    
    // 月度培训趋势
    const [monthlyTrend] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         DATE_FORMAT(training_date, '%Y-%m') as month,
         COUNT(*) as count,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
       FROM training_records
       WHERE training_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(training_date, '%Y-%m')
       ORDER BY month`
    );
    
    // 培训类型分布
    const [typeDistribution] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         tc.name as type,
         COUNT(*) as count
       FROM training_records tr
       LEFT JOIN training_courses tc ON tr.course_id = tc.id
       WHERE tc.is_deleted = 0
       GROUP BY tr.course_id, tc.name
       ORDER BY count DESC
       LIMIT 10`
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        training: trainingStats[0],
        course: courseStats[0],
        exam: examStats[0],
        certificate: certStats[0],
        monthlyTrend,
        typeDistribution
      }
    });
  } catch (error: any) {
    console.error('获取培训统计失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取部门培训统计
 */
export const getDeptTrainingStats = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { dept_id, start_date, end_date } = req.query;
    
    let where = 'WHERE 1=1';
    const params: any[] = [];
    
    if (dept_id) {
      where += ' AND u.department_id = ?';
      params.push(dept_id);
    }
    
    if (start_date) {
      where += ' AND tr.training_date >= ?';
      params.push(start_date);
    }
    
    if (end_date) {
      where += ' AND tr.training_date <= ?';
      params.push(end_date);
    }
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         d.id as dept_id,
         d.name as dept_name,
         COUNT(DISTINCT u.id) as user_count,
         COUNT(tr.id) as training_count,
         SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
         ROUND(COUNT(tr.id) / COUNT(DISTINCT u.id), 1) as avg_training_per_user,
         SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END) * 100 / COUNT(tr.id) as completion_rate
       FROM departments d
       LEFT JOIN users u ON u.department_id = d.id
       LEFT JOIN training_records tr ON tr.user_id = u.id
       ${where}
       GROUP BY d.id, d.name
       HAVING user_count > 0
       ORDER BY completion_rate ASC, training_count DESC`,
      params
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows
    });
  } catch (error: any) {
    console.error('获取部门培训统计失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取培训合规率
 */
export const getTrainingCompliance = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // 获取需要培训的岗位
    const [requiredTraining] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         u.id as user_id,
         u.username,
         u.real_name,
         d.name as dept_name,
         r.name as role_name,
         COUNT(DISTINCT rc.course_id) as required_count
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN roles r ON u.role = r.id
       LEFT JOIN role_required_courses rrc ON rrc.role_id = u.role
       LEFT JOIN required_courses rc ON rc.id = rrc.course_id
       WHERE u.status = 1
       GROUP BY u.id, u.username, u.real_name, d.name, r.name
       HAVING required_count > 0`
    );
    
    // 获取已完成的培训
    const [completedTraining] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         user_id,
         COUNT(*) as completed_count
       FROM training_records
       WHERE status = 'completed'
       GROUP BY user_id`
    );
    
    // 计算合规率
    const complianceMap = new Map();
    completedTraining.forEach((c: any) => {
      complianceMap.set(c.user_id, c.completed_count);
    });
    
    const complianceData = requiredTraining.map((r: any) => ({
      ...r,
      completed_count: complianceMap.get(r.user_id) || 0,
      compliance_rate: r.required_count > 0 
        ? Math.round((complianceMap.get(r.user_id) || 0) / r.required_count * 100)
        : 100
    }));
    
    // 合规率统计
    const compliant = complianceData.filter(c => c.compliance_rate >= 100).length;
    const partial = complianceData.filter(c => c.compliance_rate > 0 && c.compliance_rate < 100).length;
    const nonCompliant = complianceData.filter(c => c.compliance_rate === 0).length;
    const overallRate = complianceData.length > 0 
      ? Math.round(compliant / complianceData.length * 100) 
      : 100;
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        summary: {
          total: complianceData.length,
          compliant,
          partial,
          nonCompliant,
          overall_compliance_rate: overallRate
        },
        details: complianceData
      }
    });
  } catch (error: any) {
    console.error('获取培训合规率失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取培训待办任务
 */
export const getTrainingTasks = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // 待完成培训
    const [pendingTraining] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         tr.id,
         tr.user_id,
         u.real_name,
         tc.name as course_name,
         tc.type as course_type,
         tr.deadline,
         tr.status,
         DATEDIFF(tr.deadline, CURDATE()) as days_remaining
       FROM training_records tr
       LEFT JOIN users u ON tr.user_id = u.id
       LEFT JOIN training_courses tc ON tr.course_id = tc.id
       WHERE tr.status IN ('pending', 'in_progress')
         AND tr.deadline IS NOT NULL
       ORDER BY days_remaining ASC
       LIMIT 20`
    );
    
    // 即将过期证书
    const [expiringCerts] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         c.id,
         c.certificate_no,
         c.certificate_name,
         u.real_name,
         c.expiry_date,
         DATEDIFF(c.expiry_date, CURDATE()) as days_remaining
       FROM certificates c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.status = 'valid'
         AND c.expiry_date IS NOT NULL
         AND c.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 30 DAY)
       ORDER BY c.expiry_date ASC
       LIMIT 20`
    );
    
    // 未通过考试
    const [failedExams] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         er.id,
         er.user_id,
         u.real_name,
         er.exam_name,
         er.score,
         er.passing_score,
         er.exam_date
       FROM exam_results er
       LEFT JOIN users u ON er.user_id = u.id
       WHERE er.score < er.passing_score
       ORDER BY er.exam_date DESC
       LIMIT 10`
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        pendingTraining,
        expiringCerts,
        failedExams
      }
    });
  } catch (error: any) {
    console.error('获取培训待办任务失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取培训完成率趋势
 */
export const getCompletionTrend = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const months = Number(req.query.months) || 6;
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT
         DATE_FORMAT(training_date, '%Y-%m') as month,
         COUNT(*) as total,
         SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
         SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expired,
         ROUND(SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) * 100 / COUNT(*), 1) as completion_rate
       FROM training_records
       WHERE training_date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
       GROUP BY DATE_FORMAT(training_date, '%Y-%m')
       ORDER BY month`,
      [months]
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows
    });
  } catch (error: any) {
    console.error('获取培训完成率趋势失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取培训类型分布
 */
export const getTrainingTypeDistribution = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         tc.type,
         tc.name as course_name,
         COUNT(tr.id) as training_count,
         SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END) as completed,
         ROUND(SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END) * 100 / COUNT(tr.id), 1) as completion_rate,
         ROUND(AVG(tr.duration), 0) as avg_duration
       FROM training_courses tc
       LEFT JOIN training_records tr ON tr.course_id = tc.id
       WHERE tc.is_deleted = 0
       GROUP BY tc.type, tc.name
       ORDER BY training_count DESC`
    );
    
    // 按类型汇总
    const typeSummary: any = {};
    rows.forEach((r: any) => {
      if (!typeSummary[r.type]) {
        typeSummary[r.type] = {
          type: r.type,
          count: 0,
          completed: 0
        };
      }
      typeSummary[r.type].count += r.training_count;
      typeSummary[r.type].completed += r.completed;
    });
    
    Object.keys(typeSummary).forEach(key => {
      typeSummary[key].rate = Math.round(typeSummary[key].completed / typeSummary[key].count * 100);
    });
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        courses: rows,
        summary: Object.values(typeSummary)
      }
    });
  } catch (error: any) {
    console.error('获取培训类型分布失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取培训排行榜
 */
export const getTrainingLeaderboard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const type = String(req.query.type || 'completion');
    const limit = Number(req.query.limit) || 10;
    
    let orderBy = 'completed DESC, total_hours DESC';
    if (type === 'hours') {
      orderBy = 'total_hours DESC';
    } else if (type === 'score') {
      orderBy = 'avg_score DESC';
    }
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT
         u.id,
         u.username,
         u.real_name,
         d.name as dept_name,
         COUNT(tr.id) as total_training,
         SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END) as completed,
         ROUND(SUM(CASE WHEN tr.status = 'completed' THEN tr.duration ELSE 0 END), 0) as total_hours,
         ROUND(AVG(er.score), 1) as avg_score,
         SUM(CASE WHEN er.score >= er.passing_score THEN 1 ELSE 0 END) as passed_exams
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       LEFT JOIN training_records tr ON tr.user_id = u.id
       LEFT JOIN exam_results er ON er.user_id = u.id
       WHERE u.status = 1
       GROUP BY u.id, u.username, u.real_name, d.name
       ORDER BY ${orderBy}
       LIMIT ?`,
      [limit]
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows
    });
  } catch (error: any) {
    console.error('获取培训排行榜失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};
