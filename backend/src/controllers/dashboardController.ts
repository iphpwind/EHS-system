import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getKPI = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    
    // 安全天数（从系统设置读取，默认8353天）
    const [settings] = await conn.execute<RowDataPacket[]>(
      'SELECT `value` FROM system_settings WHERE `key` = ?', ['safety_days']
    );
    const safetyDays = (settings && settings.length > 0) ? parseInt(settings[0].value) || 8353 : 8353;

    // 隐患统计（使用正确表名 hazard_inspection）
    const [hazardStats] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total,
              SUM(IF(DATE(discovery_time)=CURDATE(),1,0)) as today,
              SUM(IF(MONTH(discovery_time)=MONTH(CURDATE()) AND YEAR(discovery_time)=YEAR(CURDATE()),1,0)) as thisMonth
       FROM hazard_inspection`
    );

    // 整改完成率（status=3 表示已整改完成）
    const [completion] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total, SUM(IF(status=3,1,0)) as completed
       FROM hazard_inspection WHERE discovery_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );
    const rate = completion[0]?.total > 0
      ? ((completion[0].completed / completion[0].total) * 100).toFixed(1)
      : '0.0';

    // 待审批作业票
    const [pending] = await conn.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM work_permits WHERE status='pending'"
    );

    // 今日作业票数量
    const [todayTickets] = await conn.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM work_permits WHERE DATE(created_at)=CURDATE()"
    );

    // 活跃用户数（今日登录）
    const [activeUsers] = await conn.execute<RowDataPacket[]>(
      "SELECT COUNT(DISTINCT user_id) as count FROM user_logs WHERE DATE(login_time)=CURDATE()"
    );

    res.json({
      success: true,
      data: {
        safetyDays,
        hazardTotal: hazardStats[0]?.total || 0,
        hazardToday: hazardStats[0]?.today || 0,
        hazardThisMonth: hazardStats[0]?.thisMonth || 0,
        completionRate: `${rate}%`,
        pendingTickets: pending[0]?.count || 0,
        todayTickets: todayTickets[0]?.count || 0,
        activeUsers: activeUsers[0]?.count || 0
      }
    });
  } catch (error) {
    console.error('Get KPI error:', error);
    res.json({ success: true, data: {
      safetyDays: 8353, hazardTotal: 0, hazardToday: 0, hazardThisMonth: 0,
      completionRate: '0.0%', pendingTickets: 0, todayTickets: 0, activeUsers: 0
    }});
  }
};

export const getTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    const { period = 'year' } = req.query;
    let dateCondition = '';
    if (period === 'week') dateCondition = 'AND YEARWEEK(discovery_time)=YEARWEEK(CURDATE())';
    else if (period === 'month') dateCondition = 'AND MONTH(discovery_time)=MONTH(CURDATE()) AND YEAR(discovery_time)=YEAR(CURDATE())';
    else dateCondition = 'AND YEAR(discovery_time)=YEAR(CURDATE())';

    const [trends] = await conn.execute<RowDataPacket[]>(
      `SELECT MONTH(discovery_time) as month,
              SUM(IF(hazard_level=1,1,0)) as major,
              SUM(IF(hazard_level=2,1,0)) as major_risk,
              SUM(IF(hazard_level=3,1,0)) as general
       FROM hazard_inspection WHERE 1=1 ${dateCondition}
       GROUP BY MONTH(discovery_time) ORDER BY month`
    );

    const monthNames = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];
    const major = new Array(12).fill(0);
    const majorRisk = new Array(12).fill(0);
    const general = new Array(12).fill(0);
    trends.forEach((item: any) => {
      const i = item.month - 1;
      if (i >= 0 && i < 12) { major[i] = item.major; majorRisk[i] = item.major_risk; general[i] = item.general; }
    });
    res.json({ success: true, data: { months: monthNames, major, majorRisk, general } });
  } catch (error) {
    console.error('Get trend error:', error);
    next(error);
  }
};

export const getLevelDistribution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    const [levels] = await conn.execute<RowDataPacket[]>(
      `SELECT hazard_level as level, COUNT(*) as count FROM hazard_inspection
       WHERE discovery_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY hazard_level ORDER BY hazard_level`
    );
    const levelMap = ['', '重大隐患', '较大隐患', '一般隐患'];
    res.json({ success: true, data: levels.map((item: any) => ({
      name: levelMap[item.level] || '未知', value: item.count
    })) });
  } catch (error) { console.error(error); next(error); }
};

export const getDepartmentRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    const [depts] = await conn.execute<RowDataPacket[]>(
      `SELECT u.department, COUNT(h.id) as count
       FROM hazard_inspection h LEFT JOIN users u ON h.discoverer_id = u.id
       WHERE h.discovery_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       GROUP BY u.department ORDER BY count DESC LIMIT 10`
    );
    res.json({ success: true, data: {
      departments: depts.map((d: any) => d.department || '未分配'),
      counts: depts.map((d: any) => d.count)
    }});
  } catch (error) { console.error(error); next(error); }
};

export const getPendingTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    // 待审批作业票
    const [pendingTickets] = await conn.execute<RowDataPacket[]>(
      `SELECT wp.id, wp.ticket_no as no, wp.ticket_type as type, u.real_name as applicant, wp.created_at as time
       FROM work_permits wp LEFT JOIN users u ON wp.applicant_id = u.id
       WHERE wp.status='pending' ORDER BY wp.created_at DESC LIMIT 10`
    );
    
    // 待整改隐患（status=1 表示待整改）
    const [pendingHazards] = await conn.execute<RowDataPacket[]>(
      `SELECT id, hazard_level as level, hazard_description as description, rectification_deadline as deadline
       FROM hazard_inspection WHERE status=1 ORDER BY rectification_deadline ASC LIMIT 10`
    );
    
    // 即将到期的作业票（3天内）
    const [upcomingTickets] = await conn.execute<RowDataPacket[]>(
      `SELECT id, ticket_no as no, ticket_type as type, end_time as deadline
       FROM work_permits 
       WHERE status IN ('approved', 'executing') 
       AND end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)
       ORDER BY end_time ASC LIMIT 5`
    );
    
    res.json({ success: true, data: { 
      pendingTickets, 
      pendingHazards,
      upcomingTickets 
    } });
  } catch (error) {
    console.error('Get pending tasks error:', error);
    res.json({ success: true, data: { pendingTickets: [], pendingHazards: [], upcomingTickets: [] } });
  }
};

// 培训完成率统计
export const getTrainingRate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();
    
    // 总必修课程数
    const [mandatoryCourses] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM training_courses WHERE is_mandatory = 1 AND status = 1`
    );
    const totalMandatory = mandatoryCourses[0]?.total || 0;

    // 活跃用户总数
    const [totalUsers] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM users WHERE status = 1`
    );
    const userCount = totalUsers[0]?.total || 1;

    // 已完成全部必修课程的用户数
    let completedCount = 0;
    if (totalMandatory > 0) {
      const [completed] = await conn.execute<RowDataPacket[]>(
        `SELECT COUNT(DISTINCT lp.user_id) as count
         FROM learning_progress lp
         JOIN training_courses tc ON lp.course_id = tc.id
         WHERE tc.is_mandatory = 1 AND tc.status = 1 AND lp.is_completed = 1`
      );
      completedCount = completed[0]?.count || 0;
    }

    // 本月完成培训人次
    const [monthlyCompleted] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM learning_progress 
       WHERE is_completed = 1 
       AND MONTH(completed_at) = MONTH(CURDATE()) 
       AND YEAR(completed_at) = YEAR(CURDATE())`
    );

    // 总学习时长(小时)
    const [totalHours] = await conn.execute<RowDataPacket[]>(
      `SELECT COALESCE(SUM(hours), 0) as total FROM learning_hours`
    );

    const trainingRate = userCount > 0 
      ? ((completedCount / userCount) * 100).toFixed(1) 
      : '0.0';

    res.json({
      success: true,
      data: {
        trainingRate: `${trainingRate}%`,
        totalMandatoryCourses: totalMandatory,
        completedUsers: completedCount,
        totalUsers: userCount,
        monthlyCompleted: monthlyCompleted[0]?.count || 0,
        totalLearningHours: Math.round(totalHours[0]?.total || 0)
      }
    });
  } catch (error) {
    console.error('Get training rate error:', error);
    res.json({ success: true, data: {
      trainingRate: '0.0%', totalMandatoryCourses: 0, completedUsers: 0,
      totalUsers: 0, monthlyCompleted: 0, totalLearningHours: 0
    }});
  }
};

// 区域风险分布
export const getAreaRiskDistribution = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();

    // 先从隐患表按部门聚合，获取各部门的隐患风险分布
    const [deptRisks] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COALESCE(u.department, '未分配') as area_name,
         COUNT(h.id) as total_hazards,
         SUM(IF(h.hazard_level = 1, 1, 0)) as high_risk,
         SUM(IF(h.hazard_level = 2, 1, 0)) as medium_risk,
         SUM(IF(h.hazard_level = 3, 1, 0)) as low_risk,
         SUM(IF(h.status = 3, 1, 0)) as resolved,
         SUM(IF(h.status = 1, 1, 0)) as pending
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       WHERE h.discovery_time >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
       GROUP BY u.department
       ORDER BY total_hazards DESC`
    );

    // 尝试从 area_archives 获取额外的安全等级信息
    let areaData: any[] = [];
    try {
      const [areas] = await conn.execute<RowDataPacket[]>(
        `SELECT name, safety_level, area_type, responsible_department 
         FROM area_archives WHERE status = 1`
      );
      areaData = areas;
    } catch (e) {
      // area_archives 表可能不存在，忽略
    }

    // 计算风险等级：根据高中风险占比判断
    const riskLevel = (high: number, medium: number, total: number): string => {
      if (total === 0) return 'normal';
      const ratio = (high + medium) / total;
      if (ratio > 0.5) return 'danger';
      if (ratio > 0.2) return 'warning';
      return 'normal';
    };

    const distribution = deptRisks.map((row: any) => ({
      areaName: row.area_name,
      totalHazards: row.total_hazards,
      highRisk: row.high_risk,
      mediumRisk: row.medium_risk,
      lowRisk: row.low_risk,
      resolved: row.resolved,
      pending: row.pending,
      riskLevel: riskLevel(row.high_risk, row.medium_risk, row.total_hazards),
      // 合并 area_archives 额外信息
      safetyLevel: areaData.find((a: any) => 
        a.responsible_department === row.area_name || a.name === row.area_name
      )?.safety_level || null,
      areaType: areaData.find((a: any) => 
        a.responsible_department === row.area_name || a.name === row.area_name
      )?.area_type || null
    }));

    // 作业票按区域的风险数据
    const [ticketAreaRisks] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COALESCE(u.department, '未分配') as area_name,
         COUNT(wp.id) as total_tickets,
         SUM(IF(wp.status = 'pending', 1, 0)) as pending_tickets,
         SUM(IF(wp.status IN ('approved', 'executing'), 1, 0)) as active_tickets
       FROM work_permits wp
       LEFT JOIN users u ON wp.applicant_id = u.id
       WHERE wp.created_at >= DATE_SUB(CURDATE(), INTERVAL 90 DAY)
       GROUP BY u.department
       ORDER BY total_tickets DESC`
    );

    // 合并隐患和作业票的汇总风险
    const summary = {
      totalAreas: distribution.length,
      dangerAreas: distribution.filter((d: any) => d.riskLevel === 'danger').length,
      warningAreas: distribution.filter((d: any) => d.riskLevel === 'warning').length,
      normalAreas: distribution.filter((d: any) => d.riskLevel === 'normal').length
    };

    res.json({
      success: true,
      data: {
        areas: distribution,
        ticketAreas: ticketAreaRisks,
        summary
      }
    });
  } catch (error) {
    console.error('Get area risk distribution error:', error);
    res.json({ success: true, data: { areas: [], ticketAreas: [], summary: { totalAreas: 0, dangerAreas: 0, warningAreas: 0, normalAreas: 0 } } });
  }
};
