import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import { getConnection } from '../config/database';
import ExcelJS from 'exceljs';

/**
 * 隐患统计报表
 * GET /api/reports/hazard
 * 参数：startDate, endDate, department, level
 */
export const hazardReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate, department, level } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND discovery_time >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND discovery_time <= ?';
      params.push(endDate + ' 23:59:59');
    }
    if (department) {
      where += ' AND department = ?';
      params.push(department);
    }
    if (level) {
      where += ' AND hazard_level = ?';
      params.push(level);
    }

    // 按级别统计
    const [levelStats] = await conn.execute<RowDataPacket[]>(
      `SELECT hazard_level as level, COUNT(*) as count 
       FROM hazard_inspection ${where} 
       GROUP BY hazard_level 
       ORDER BY hazard_level`,
      params
    );

    // 按部门统计
    const [deptStats] = await conn.execute<RowDataPacket[]>(
      `SELECT department, COUNT(*) as count 
       FROM hazard_inspection ${where} 
       GROUP BY department 
       ORDER BY count DESC`,
      params
    );

    // 按状态统计
    const [statusStats] = await conn.execute<RowDataPacket[]>(
      `SELECT status, COUNT(*) as count 
       FROM hazard_inspection ${where} 
       GROUP BY status 
       ORDER BY status`,
      params
    );

    // 整改率统计
    const [rectifyStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        SUM(IF(status=3,1,0)) as completed,
        SUM(IF(status=4,1,0)) as closed,
        SUM(IF(status IN (1,2),1,0)) as pending,
        COUNT(*) as total
       FROM hazard_inspection ${where}`,
      params
    );

    const stats = (rectifyStats as any[])[0] || {};
    const completionRate = stats.total > 0 
      ? ((stats.completed / stats.total) * 100).toFixed(1) 
      : '0.0';

    res.json({
      success: true,
      data: {
        levelStats: (levelStats as any[]).map((item: any) => ({
          level: item.level,
          levelName: ['', '重大隐患', '较大隐患', '一般隐患'][item.level] || '未知',
          count: item.count
        })),
        deptStats: deptStats,
        statusStats: (statusStats as any[]).map((item: any) => ({
          status: item.status,
          statusName: ['', '待整改', '整改中', '已完成', '已关闭'][item.status] || '未知',
          count: item.count
        })),
        completionRate: `${completionRate}%`,
        total: stats.total || 0,
        completed: stats.completed || 0,
        pending: stats.pending || 0
      }
    });
  } catch (error) {
    console.error('隐患报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 作业票统计报表
 * GET /api/reports/work-permits
 */
export const workPermitReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate, ticketType, status } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND created_at <= ?';
      params.push(endDate + ' 23:59:59');
    }
    if (ticketType) {
      where += ' AND ticket_type = ?';
      params.push(ticketType);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    // 按类型统计
    const [typeStats] = await conn.execute<RowDataPacket[]>(
      `SELECT ticket_type, COUNT(*) as count 
       FROM work_permits ${where} 
       GROUP BY ticket_type 
       ORDER BY count DESC`,
      params
    );

    // 按状态统计
    const [statusStats] = await conn.execute<RowDataPacket[]>(
      `SELECT status, COUNT(*) as count 
       FROM work_permits ${where} 
       GROUP BY status 
       ORDER BY status`,
      params
    );

    // 按月份统计趋势
    const [monthlyStats] = await conn.execute<RowDataPacket[]>(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
       FROM work_permits ${where} 
       GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
       ORDER BY month`,
      params
    );

    // 平均审批时间
    const [avgTime] = await conn.execute<RowDataPacket[]>(
      `SELECT AVG(TIMESTAMPDIFF(approve_time, created_at)) as avg_hours 
       FROM work_permits ${where} AND status IN ('approved', 'executing', 'completed')`,
      params
    );

    res.json({
      success: true,
      data: {
        typeStats: (typeStats as any[]).map((item: any) => ({
          ticketType: item.ticket_type,
          count: item.count
        })),
        statusStats: (statusStats as any[]).map((item: any) => ({
          status: item.status,
          count: item.count
        })),
        monthlyStats,
        avgApprovalHours: (avgTime as any[])[0]?.avg_hours || 0
      }
    });
  } catch (error) {
    console.error('作业票报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 培训统计报表
 * GET /api/reports/training
 */
export const trainingReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND training_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND training_date <= ?';
      params.push(endDate + ' 23:59:59');
    }

    // 培训场次统计
    const [sessionStats] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total_sessions, 
              SUM(IF(training_type='online',1,0)) as online_count,
              SUM(IF(training_type='offline',1,0)) as offline_count
       FROM training_sessions ${where}`,
      params
    );

    // 参与人数统计
    const [participantStats] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(DISTINCT user_id) as total_participants,
              SUM(IF(is_passed=1,1,0)) as passed_count
       FROM training_records tr
       LEFT JOIN training_sessions ts ON tr.session_id = ts.id
       ${where.replace('training_date', 'ts.training_date')}`,
      params
    );

    // 通过率
    const stats = (participantStats as any[])[0] || {};
    const passRate = stats.total_participants > 0 
      ? ((stats.passed_count / stats.total_participants) * 100).toFixed(1) 
      : '0.0';

    res.json({
      success: true,
      data: {
        totalSessions: (sessionStats as any[])[0]?.total_sessions || 0,
        onlineCount: (sessionStats as any[])[0]?.online_count || 0,
        offlineCount: (sessionStats as any[])[0]?.offline_count || 0,
        totalParticipants: stats.total_participants || 0,
        passedCount: stats.passed_count || 0,
        passRate: `${passRate}%`
      }
    });
  } catch (error) {
    console.error('培训报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 风险智能提示
 * GET /api/reports/risk-tips
 * 根据当前用户权限和部门，返回个性化的风险提示
 */
export const riskTips = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const userId = (req as any).user?.userId;
    conn = await getConnection();

    // 获取用户信息
    const [users] = await conn.execute<RowDataPacket[]>(
      'SELECT department FROM users WHERE id = ?',
      [userId]
    );
    const userDept = (users as any[])[0]?.department || '';

    const tips: any[] = [];

    // 1. 检查即将到期的作业票
    const [upcomingTickets] = await conn.execute<RowDataPacket[]>(
      `SELECT ticket_no, end_time FROM work_permits 
       WHERE status IN ('approved', 'executing') 
       AND end_time BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 3 DAY)
       AND applicant_id = ?`,
      [userId]
    );
    if ((upcomingTickets as any[]).length > 0) {
      tips.push({
        type: 'warning',
        level: 'warning',
        title: '作业票即将到期',
        content: `您有 ${(upcomingTickets as any[]).length} 张作业票将在3天内到期`,
        action: '/safework'
      });
    }

    // 2. 检查逾期未整改的隐患
    const [overdueHazards] = await conn.execute<RowDataPacket[]>(
      `SELECT id, hazard_description FROM hazard_inspection 
       WHERE status IN (1, 2) AND rectification_deadline < NOW()
       AND discoverer_id = ?`,
      [userId]
    );
    if ((overdueHazards as any[]).length > 0) {
      tips.push({
        type: 'danger',
        level: 'danger',
        title: '隐患整改逾期',
        content: `您有 ${(overdueHazards as any[]).length} 条隐患整改已逾期，请尽快处理`,
        action: '/safework/hazard'
      });
    }

    // 3. 检查证书即将过期
    const [expiringCerts] = await conn.execute<RowDataPacket[]>(
      `SELECT cert_name, expire_date FROM certificates 
       WHERE user_id = ? AND expire_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 30 DAY)
       AND status = 1`,
      [userId]
    );
    if ((expiringCerts as any[]).length > 0) {
      tips.push({
        type: 'info',
        level: 'info',
        title: '证书即将过期',
        content: `您有 ${(expiringCerts as any[]).length} 本证书将在30天内过期`,
        action: '/certificate/list'
      });
    }

    // 4. 检查待审批的作业票（针对审批人角色）
    const [pendingApprovals] = await conn.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM work_permits 
       WHERE status = 'pending'`,
      []
    );
    if ((pendingApprovals as any[])[0]?.count > 0) {
      // 这里可以加入角色判断，只有审批人才能看到
      tips.push({
        type: 'info',
        level: 'info',
        title: '待审批作业票',
        content: `有 ${(pendingApprovals as any[])[0]?.count} 张作业票待审批`,
        action: '/safework'
      });
    }

    res.json({
      success: true,
      data: {
        tips,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('风险提示错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 综合 dashboard 数据（用于大屏）
 * GET /api/reports/dashboard-full
 */
export const fullDashboard = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    conn = await getConnection();

    // 安全生产天数
    const [settings] = await conn.execute<RowDataPacket[]>(
      'SELECT `value` FROM system_settings WHERE `key` = ?',
      ['safety_days']
    );
    const safetyDays = (settings && settings.length > 0) ? parseInt((settings as any[])[0].value) || 8353 : 8353;

    // 隐患统计
    const [hazardStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(IF(hazard_level=1,1,0)) as major,
        SUM(IF(hazard_level=2,1,0)) as major_risk,
        SUM(IF(hazard_level=3,1,0)) as general,
        SUM(IF(status=3,1,0)) as completed
       FROM hazard_inspection
       WHERE discovery_time >= DATE_SUB(CURDATE(), INTERVAL 365 DAY)`
    );

    // 作业票统计
    const [ticketStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(*) as total,
        SUM(IF(status='pending',1,0)) as pending,
        SUM(IF(status='executing',1,0)) as executing,
        SUM(IF(status='completed',1,0)) as completed
       FROM work_permits
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    // 培训统计
    const [trainingStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        COUNT(DISTINCT ts.id) as total_sessions,
        COUNT(DISTINCT tr.user_id) as total_participants
       FROM training_sessions ts
       LEFT JOIN training_records tr ON ts.id = tr.session_id
       WHERE ts.training_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)`
    );

    res.json({
      success: true,
      data: {
        safetyDays,
        hazardStats: (hazardStats as any[])[0] || {},
        ticketStats: (ticketStats as any[])[0] || {},
        trainingStats: (trainingStats as any[])[0] || {},
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('综合Dashboard错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 导出隐患统计报表为Excel
 * GET /api/reports/hazard/export
 */
export const exportHazardReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate, department, level } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND discovery_time >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND discovery_time <= ?';
      params.push(endDate + ' 23:59:59');
    }
    if (department) {
      where += ' AND department = ?';
      params.push(department);
    }
    if (level) {
      where += ' AND hazard_level = ?';
      params.push(level);
    }

    // 获取详细数据
    const [hazards] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        id, hazard_description, hazard_level, department, 
        hazard_location, status, discoverer_name,
        DATE_FORMAT(discovery_time, '%Y-%m-%d %H:%i') as discovery_time,
        DATE_FORMAT(rectification_deadline, '%Y-%m-%d') as rectification_deadline
       FROM hazard_inspection ${where}
       ORDER BY discovery_time DESC`,
      params
    );

    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EHS安全生产管理系统';
    workbook.created = new Date();

    // 创建工作表
    const worksheet = workbook.addWorksheet('隐患统计报表');

    // 设置列
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '隐患描述', key: 'hazard_description', width: 40 },
      { header: '隐患级别', key: 'hazard_level', width: 12 },
      { header: '部门', key: 'department', width: 15 },
      { header: '位置', key: 'hazard_location', width: 20 },
      { header: '状态', key: 'status', width: 12 },
      { header: '发现人', key: 'discoverer_name', width: 12 },
      { header: '发现时间', key: 'discovery_time', width: 18 },
      { header: '整改期限', key: 'rectification_deadline', width: 15 }
    ];

    // 样式设置
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // 添加数据
    const levelMap: any = { 1: '重大隐患', 2: '较大隐患', 3: '一般隐患' };
    const statusMap: any = { 1: '待整改', 2: '整改中', 3: '已完成', 4: '已关闭' };

    (hazards as any[]).forEach((hazard: any) => {
      worksheet.addRow({
        id: hazard.id,
        hazard_description: hazard.hazard_description,
        hazard_level: levelMap[hazard.hazard_level] || '未知',
        department: hazard.department,
        hazard_location: hazard.hazard_location,
        status: statusMap[hazard.status] || '未知',
        discoverer_name: hazard.discoverer_name,
        discovery_time: hazard.discovery_time,
        rectification_deadline: hazard.rectification_deadline
      });
    });

    // 设置响应头
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=hazard_report_${new Date().getTime()}.xlsx`);

    // 写入响应
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('导出隐患报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 导出作业票统计报表为Excel
 * GET /api/reports/work-permits/export
 */
export const exportWorkPermitReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate, ticketType, status } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND created_at >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND created_at <= ?';
      params.push(endDate + ' 23:59:59');
    }
    if (ticketType) {
      where += ' AND ticket_type = ?';
      params.push(ticketType);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    // 获取详细数据
    const [tickets] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        id, ticket_no, ticket_type, applicant_name, department,
        work_content, work_location, start_time, end_time,
        status, DATE_FORMAT(created_at, '%Y-%m-%d %H:%i') as created_at
       FROM work_permits ${where}
       ORDER BY created_at DESC`,
      params
    );

    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EHS安全生产管理系统';
    workbook.created = new Date();

    // 创建工作表
    const worksheet = workbook.addWorksheet('作业票统计报表');

    // 设置列
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '作业票号', key: 'ticket_no', width: 20 },
      { header: '作业类型', key: 'ticket_type', width: 15 },
      { header: '申请人', key: 'applicant_name', width: 12 },
      { header: '部门', key: 'department', width: 15 },
      { header: '作业内容', key: 'work_content', width: 30 },
      { header: '作业地点', key: 'work_location', width: 20 },
      { header: '开始时间', key: 'start_time', width: 18 },
      { header: '结束时间', key: 'end_time', width: 18 },
      { header: '状态', key: 'status', width: 12 },
      { header: '创建时间', key: 'created_at', width: 18 }
    ];

    // 样式设置
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // 添加数据
    const statusMap: any = { 
      'pending': '待审批', 
      'approved': '已批准', 
      'rejected': '已拒绝',
      'executing': '执行中',
      'completed': '已完成',
      'closed': '已关闭'
    };

    (tickets as any[]).forEach((ticket: any) => {
      worksheet.addRow({
        id: ticket.id,
        ticket_no: ticket.ticket_no,
        ticket_type: ticket.ticket_type,
        applicant_name: ticket.applicant_name,
        department: ticket.department,
        work_content: ticket.work_content,
        work_location: ticket.work_location,
        start_time: ticket.start_time,
        end_time: ticket.end_time,
        status: statusMap[ticket.status] || ticket.status,
        created_at: ticket.created_at
      });
    });

    // 设置响应头
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=work_permit_report_${new Date().getTime()}.xlsx`);

    // 写入响应
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('导出作业票报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 导出培训统计报表为Excel
 * GET /api/reports/training/export
 */
export const exportTrainingReport = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { startDate, endDate } = req.query;
    conn = await getConnection();

    let where = 'WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
      where += ' AND training_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      where += ' AND training_date <= ?';
      params.push(endDate + ' 23:59:59');
    }

    // 获取详细数据
    const [sessions] = await conn.execute<RowDataPacket[]>(
      `SELECT 
        ts.id, ts.session_name, ts.training_type, ts.training_date,
        ts.location, ts.instructor, ts.duration,
        COUNT(tr.id) as participant_count,
        SUM(IF(tr.is_passed=1,1,0)) as passed_count
       FROM training_sessions ts
       LEFT JOIN training_records tr ON ts.id = tr.session_id
       ${where.replace('training_date', 'ts.training_date')}
       GROUP BY ts.id
       ORDER BY ts.training_date DESC`,
      params
    );

    // 创建工作簿
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'EHS安全生产管理系统';
    workbook.created = new Date();

    // 创建工作表
    const worksheet = workbook.addWorksheet('培训统计报表');

    // 设置列
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: '培训名称', key: 'session_name', width: 30 },
      { header: '培训类型', key: 'training_type', width: 12 },
      { header: '培训日期', key: 'training_date', width: 15 },
      { header: '地点', key: 'location', width: 20 },
      { header: '讲师', key: 'instructor', width: 12 },
      { header: '时长(小时)', key: 'duration', width: 12 },
      { header: '参与人数', key: 'participant_count', width: 12 },
      { header: '通过人数', key: 'passed_count', width: 12 },
      { header: '通过率', key: 'pass_rate', width: 12 }
    ];

    // 样式设置
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    // 添加数据
    (sessions as any[]).forEach((session: any) => {
      const passRate = session.participant_count > 0 
        ? ((session.passed_count / session.participant_count) * 100).toFixed(1) + '%'
        : '0.0%';
      
      worksheet.addRow({
        id: session.id,
        session_name: session.session_name,
        training_type: session.training_type === 'online' ? '线上' : '线下',
        training_date: session.training_date,
        location: session.location,
        instructor: session.instructor,
        duration: session.duration,
        participant_count: session.participant_count,
        passed_count: session.passed_count,
        pass_rate: passRate
      });
    });

    // 设置响应头
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=training_report_${new Date().getTime()}.xlsx`);

    // 写入响应
    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('导出培训报表错误:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
