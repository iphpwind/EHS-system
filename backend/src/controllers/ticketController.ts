import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { checkTrainingEligibility } from './trainingChecker';
import { AppError } from '../utils/errors';
import { createSubTicketRecord } from './ticketTypeSubController';

interface TicketRow extends RowDataPacket {
  id: number;
  ticket_no: string;
  ticket_type: string;
  ticket_level: string;
  project_name: string;
  work_location: string;
  work_content: string;
  status: string;
  applicant_id: number;
  applicant_name?: string;
  type_name?: string;
  current_node: number;
  created_at: Date;
}

interface CountResult extends RowDataPacket {
  total: number;
}

/**
 * 获取作业票列表
 */
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { 
      page = 1, 
      pageSize = 20, 
      ticketType, 
      status, 
      keyword,
      startDate,
      endDate,
      applicantId 
    } = req.query;
    
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const conn = await getConnection();

    let query = 'SELECT wp.*, u.real_name as applicant_name, wtc.type_name FROM work_permits wp LEFT JOIN users u ON wp.applicant_id = u.id LEFT JOIN work_type_configs wtc ON wp.work_type = wtc.type_code WHERE 1=1';
    const params: any[] = [];

    // 权限控制：普通用户只能看自己的
    if (userRole >= 4) {
      query += ' AND wp.applicant_id = ?';
      params.push(userId);
    }

    if (ticketType) {
      query += ' AND wp.ticket_type = ?';
      params.push(ticketType);
    }

    if (status) {
      query += ' AND wp.status = ?';
      params.push(status);
    }

    if (keyword) {
      query += ' AND (wp.ticket_no LIKE ? OR wp.project_name LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (startDate) {
      query += ' AND DATE(wp.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND DATE(wp.created_at) <= ?';
      params.push(endDate);
    }

    if (applicantId) {
      query += ' AND wp.applicant_id = ?';
      params.push(applicantId);
    }

    // 获取总数（简化）
    const [countRows] = await conn.execute<CountResult[]>(
      'SELECT COUNT(*) as total FROM work_permits'
    );
    const total = countRows[0].total;

    // 获取分页数据
    query += ' ORDER BY wp.created_at DESC LIMIT ? OFFSET ?';
    const offset = (Number(page) - 1) * Number(pageSize);
    params.push(Number(pageSize), offset);

    const [tickets] = await conn.execute<TicketRow[]>(query, params);

    res.json({
      success: true,
      data: {
        list: tickets,
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get tickets error:', error);
    next(error);
  }
};

/**
 * 获取单个作业票详情
 */
export const getTicketById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const conn = await getConnection();

    const [tickets] = await conn.execute<TicketRow[]>(
      `SELECT wp.*, u.real_name as applicant_name, u.department as applicant_department 
       FROM work_permits wp 
       LEFT JOIN users u ON wp.applicant_id = u.id 
       WHERE wp.id = ?`,
      [id]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({
        success: false,
        message: '作业票不存在'
      });
    }

    const ticket = (tickets as any[])[0];

    // 权限检查：只能查看自己的或有权限查看所有的
    if (userRole >= 4 && ticket.applicant_id !== userId) {
      return res.status(403).json({
        success: false,
        message: '无权限查看此作业票'
      });
    }

    // 解析JSON字段
    try {
      if (ticket.safety_measures) {
        ticket.safety_measures = JSON.parse(ticket.safety_measures);
      }
      if (ticket.flow_config) {
        ticket.flow_config = JSON.parse(ticket.flow_config);
      }
      if (ticket.gas_detection) {
        ticket.gas_detection = JSON.parse(ticket.gas_detection);
      }
      if (ticket.hazard_identification) {
        ticket.hazard_identification = JSON.parse(ticket.hazard_identification);
      }
    } catch (e) {
      console.error('JSON parse error:', e);
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Get ticket by id error:', error);
    next(error);
  }
};

/**
 * 创建作业票
 */
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      ticketType,
      ticketLevel,
      projectName,
      workLocation,
      workContent,
      startTime,
      endTime,
      bindJsaId,
      safetyMeasures,
      flowConfig
    } = req.body;

    const userId = (req as any).user.userId;

    if (!ticketType || !projectName) {
      return res.status(400).json({
        success: false,
        message: '作业类型和项目名称不能为空'
      });
    }

    // P0: 培训资格联动校验
    const trainingCheck = await checkTrainingEligibility(userId, ticketType);
    if (!trainingCheck.eligible) {
      return res.status(403).json({
        success: false,
        code: 'TRAINING_REQUIRED',
        message: `培训资格未满足：${trainingCheck.reason}。请完成专项培训后再申请作业票。`
      });
    }

    const conn = await getConnection();

    // 生成作业票编号
    const ticketNo = `WP${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    // 创建作业票
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO work_permits 
       (ticket_no, ticket_type, ticket_level, project_name, work_location, work_content, 
        status, applicant_id, apply_time, start_time, end_time, bind_jsa_id, 
        safety_measures, flow_config, current_node, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, NOW(), ?, ?, ?, ?, ?, ?, 0, NOW(), NOW())`,
      [
        ticketNo,
        ticketType,
        ticketLevel || '',
        projectName,
        workLocation || '',
        workContent || '',
        userId,
        startTime || null,
        endTime || null,
        bindJsaId || null,
        safetyMeasures ? JSON.stringify(safetyMeasures) : null,
        flowConfig ? JSON.stringify(flowConfig) : null
      ]
    );

    const newTicketId = result.insertId;

    // 自动创建子表记录（如果传了子表数据）
    try {
      if (req.body.subDetail && Object.keys(req.body.subDetail).length > 0) {
        req.params.type = ticketType;
        req.params.ticketId = String(newTicketId);
        // 保存子表详情
        const { saveSubTicketDetail } = require('./ticketTypeSubController');
        // 先创建空记录，再填充数据
        await createSubTicketRecord(newTicketId, ticketType);
        req.body = req.body.subDetail;
        await saveSubTicketDetail(req, res, () => {});
      } else {
        // 创建空的子表记录
        await createSubTicketRecord(newTicketId, ticketType);
      }
    } catch (subError) {
      console.error('Create sub ticket record error (non-fatal):', subError);
    }

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user.username, 'create_ticket', 'work_permit', `创建作业票: ${ticketNo}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: '作业票创建成功',
      data: {
        id: newTicketId,
        ticketNo
      }
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    next(error);
  }
};

/**
 * 更新作业票
 */
export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      ticketType,
      ticketLevel,
      projectName,
      workLocation,
      workContent,
      startTime,
      endTime,
      bindJsaId,
      safetyMeasures,
      flowConfig
    } = req.body;

    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const conn = await getConnection();

    // 检查作业票是否存在及权限
    const [tickets] = await conn.execute<RowDataPacket[]>(
      'SELECT id, applicant_id, status FROM work_permits WHERE id = ?',
      [id]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({
        success: false,
        message: '作业票不存在'
      });
    }

    const ticket = (tickets as any[])[0];

    // 权限检查：只能修改自己的草稿
    if (ticket.applicant_id !== userId && userRole >= 4) {
      return res.status(403).json({
        success: false,
        message: '无权限修改此作业票'
      });
    }

    // 只有草稿状态可以修改
    if (ticket.status !== 'draft' && userRole >= 3) {
      return res.status(400).json({
        success: false,
        message: '只有草稿状态可以修改'
      });
    }

    // 更新作业票
    await conn.execute(
      `UPDATE work_permits 
       SET ticket_type = ?, ticket_level = ?, project_name = ?, work_location = ?, 
           work_content = ?, start_time = ?, end_time = ?, bind_jsa_id = ?, 
           safety_measures = ?, flow_config = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        ticketType,
        ticketLevel,
        projectName,
        workLocation,
        workContent,
        startTime || null,
        endTime || null,
        bindJsaId || null,
        safetyMeasures ? JSON.stringify(safetyMeasures) : null,
        flowConfig ? JSON.stringify(flowConfig) : null,
        id
      ]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user.username, 'update_ticket', 'work_permit', `更新作业票: ID=${id}`, req.ip]
    );

    res.json({
      success: true,
      message: '作业票更新成功'
    });
  } catch (error) {
    console.error('Update ticket error:', error);
    next(error);
  }
};

/**
 * 提交审批
 */
export const submitApproval = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const conn = await getConnection();

    // 检查作业票
    const [tickets] = await conn.execute<RowDataPacket[]>(
      'SELECT id, applicant_id, status, ticket_no FROM work_permits WHERE id = ?',
      [id]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({
        success: false,
        message: '作业票不存在'
      });
    }

    const ticket = (tickets as any[])[0];

    // 只能提交自己的作业票
    if (ticket.applicant_id !== userId) {
      return res.status(403).json({
        success: false,
        message: '只能提交自己的作业票'
      });
    }

    // 只有草稿状态可以提交
    if (ticket.status !== 'draft') {
      return res.status(400).json({
        success: false,
        message: '只有草稿状态可以提交审批'
      });
    }

    // 更新状态为待审批
    await conn.execute(
      "UPDATE work_permits SET status = 'pending', current_node = 1, updated_at = NOW() WHERE id = ?",
      [id]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user.username, 'submit_approval', 'work_permit', `提交审批: ${ticket.ticket_no}`, req.ip]
    );

    res.json({
      success: true,
      message: '提交审批成功'
    });
  } catch (error) {
    console.error('Submit approval error:', error);
    next(error);
  }
};

/**
 * 审批操作
 */
export const approveTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { action, comment } = req.body; // action: approve/reject
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: '操作类型不正确'
      });
    }

    const conn = await getConnection();

    // 检查作业票
    const [tickets] = await conn.execute<RowDataPacket[]>(
      'SELECT id, ticket_no, status, current_node, flow_config FROM work_permits WHERE id = ?',
      [id]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({
        success: false,
        message: '作业票不存在'
      });
    }

    const ticket = (tickets as any[])[0];

    // 检查权限（简化：只有管理员和安全管理人员可以审批）
    if (userRole > 3) {
      return res.status(403).json({
        success: false,
        message: '无审批权限'
      });
    }

    // 只有待审批状态可以审批
    if (ticket.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: '只有待审批状态可以审批'
      });
    }

    if (action === 'approve') {
      // 获取流程配置
      const flowConfig = ticket.flow_config ? JSON.parse(ticket.flow_config) : null;
      const totalNodes = flowConfig ? (flowConfig.nodes ? flowConfig.nodes.length : 1) : 1;

      // 检查是否所有节点都审批完成
      if (ticket.current_node >= totalNodes) {
        // 所有节点审批完成，状态改为已批准
        await conn.execute(
          "UPDATE work_permits SET status = 'approved', updated_at = NOW() WHERE id = ?",
          [id]
        );
      } else {
        // 进入下一个审批节点
        await conn.execute(
          'UPDATE work_permits SET current_node = current_node + 1, updated_at = NOW() WHERE id = ?',
          [id]
        );
      }
    } else {
      // 拒绝：状态改回草稿
      await conn.execute(
        "UPDATE work_permits SET status = 'draft', current_node = 0, updated_at = NOW() WHERE id = ?",
        [id]
      );
    }

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user.username, `ticket_${action}`, 'work_permit', `${action === 'approve' ? '批准' : '拒绝'}作业票: ${ticket.ticket_no}`, req.ip]
    );

    res.json({
      success: true,
      message: action === 'approve' ? '审批通过' : '审批已拒绝'
    });
  } catch (error) {
    console.error('Approve ticket error:', error);
    next(error);
  }
};

/**
 * 删除作业票
 */
export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;
    const userRole = (req as any).user.role;

    const conn = await getConnection();

    // 检查作业票
    const [tickets] = await conn.execute<RowDataPacket[]>(
      'SELECT id, applicant_id, status, ticket_no FROM work_permits WHERE id = ?',
      [id]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({
        success: false,
        message: '作业票不存在'
      });
    }

    const ticket = (tickets as any[])[0];

    // 权限检查：只能删除自己的草稿，或管理员可以删除任何
    if (ticket.applicant_id !== userId && userRole >= 4) {
      return res.status(403).json({
        success: false,
        message: '无权限删除此作业票'
      });
    }

    // 只能删除草稿
    if (ticket.status !== 'draft' && userRole >= 3) {
      return res.status(400).json({
        success: false,
        message: '只能删除草稿状态的作业票'
      });
    }

    // 删除作业票
    await conn.execute(
      'DELETE FROM work_permits WHERE id = ?',
      [id]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user.username, 'delete_ticket', 'work_permit', `删除作业票: ${ticket.ticket_no}`, req.ip]
    );

    res.json({
      success: true,
      message: '作业票删除成功'
    });
  } catch (error) {
    console.error('Delete ticket error:', error);
    next(error);
  }
};

/**
 * 获取作业票统计数据
 */
export const getTicketStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const conn = await getConnection();

    // 按状态统计
    const [statusStats] = await conn.execute<RowDataPacket[]>(
      'SELECT status, COUNT(*) as count FROM work_permits GROUP BY status'
    );

    // 按类型统计
    const [typeStats] = await conn.execute<RowDataPacket[]>(
      'SELECT ticket_type, COUNT(*) as count FROM work_permits GROUP BY ticket_type'
    );

    // 按月份统计（今年）
    const [monthStats] = await conn.execute<RowDataPacket[]>(
      'SELECT MONTH(created_at) as month, COUNT(*) as count FROM work_permits WHERE YEAR(created_at) = YEAR(NOW()) GROUP BY MONTH(created_at)'
    );

    res.json({
      success: true,
      data: {
        statusStats,
        typeStats,
        monthStats
      }
    });
  } catch (error) {
    console.error('Get ticket stats error:', error);
    next(error);
  }
};

/**
 * 二维码核验 - 通过票号查询作业票信息
 * GET /api/tickets/verify-qr?code=xxx
 */
export const verifyQrCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ success: false, message: '请提供二维码编号' });
    }

    const conn = await getConnection();

    const codeStr = String(code);
    const [tickets] = await conn.execute<RowDataPacket[]>(
      `SELECT wp.*, u.real_name as applicant_name
       FROM work_permits wp
       LEFT JOIN users u ON wp.applicant_id = u.id
       WHERE wp.ticket_no = ? OR wp.id = ?`,
      [codeStr, isNaN(Number(codeStr)) ? 0 : Number(codeStr)]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({ success: false, message: '未找到该作业票' });
    }

    const ticket = (tickets as any[])[0];

    const statusMap: Record<string, string> = {
      draft: '草稿',
      pending: '待审批',
      approved: '已批准',
      executing: '执行中',
      completed: '已完成',
      closed: '已关闭'
    };

    res.json({
      success: true,
      data: {
        id: ticket.id,
        ticketNo: ticket.ticket_no,
        ticketType: ticket.ticket_type,
        applicant: ticket.applicant_name || '',
        location: ticket.work_location || '',
        status: ticket.status,
        statusText: statusMap[ticket.status] || ticket.status,
        applyTime: ticket.created_at,
        projectName: ticket.project_name
      }
    });
  } catch (error) {
    console.error('Verify QR code error:', error);
    next(error);
  }
};
