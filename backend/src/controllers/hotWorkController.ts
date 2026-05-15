import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { checkCanWork } from '../utils/validateState';
import { recordTrace, extractOperatorInfo, getWorkPermitSnapshot } from '../utils/operationTracer';

// ==================== 动火作业状态机 ====================
export enum HotWorkStatus {
  DRAFT = 1,           // 草稿
  SUBMITTED = 2,       // 已提交
  DEPT_APPROVE = 3,    // 部门审批通过
  SAFETY_APPROVE = 4,  // 安全审批通过
  APPROVED = 5,        // 已批准（可开始作业）
  WORKING = 6,         // 作业中
  FINISHED = 7,        // 作业完成待验收
  CLOSED = 8           // 已关闭归档
}

const statusTextMap: Record<number, string> = {
  1: '草稿',
  2: '已提交',
  3: '部门审批通过',
  4: '安全审批通过',
  5: '已批准',
  6: '作业中',
  7: '待验收',
  8: '已关闭'
};

// ==================== 获取动火作业列表（含扩展信息） ====================
export const getHotWorkList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      pageSize = 10,
      status,
      keyword,
      deptId,
      fireLevel,
      startDate,
      endDate
    } = req.query;

    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;
    const userDeptName = (req as any).user?.department || '';
    const userOrgId = (req as any).user?.orgId || 1;

    const conn = await getConnection();

    let sql = `
      SELECT
        wp.id, wp.ticket_no, wp.ticket_type, wp.status as main_status,
        wp.applicant_id, wp.created_at,
        u.real_name as applicant_name, u.department as applicant_dept_name,
        d.name as dept_name,
        hd.fire_level, hd.fire_area, hd.fire_type,
        hd.risk_analysis, hd.risk_analysis_time,
        hd.acceptance_time, hd.status_flow
      FROM work_permits wp
      LEFT JOIN users u ON wp.applicant_id = u.id
      LEFT JOIN departments d ON d.name = u.department
      LEFT JOIN hot_work_details hd ON wp.id = hd.ticket_id
      WHERE wp.ticket_type = 'hot_work'
    `;
    const params: any[] = [];

    // 数据域隔离
    if (userRole > 1) {
      sql += ' AND wp.org_id = ?';
      params.push(userOrgId);
    }

    // 数据权限过滤
    if (userRole >= 4) {
      // 普通用户/部门负责人只能看本部门
      sql += ' AND u.department = ?';
      params.push(userDeptName);
    }

    if (status) {
      sql += ' AND wp.status = ?';
      params.push(status);
    }

    if (deptId) {
      sql += ' AND u.department = (SELECT name FROM departments WHERE id = ?)';
      params.push(deptId);
    }

    if (fireLevel) {
      sql += ' AND hd.fire_level = ?';
      params.push(fireLevel);
    }

    if (keyword) {
      sql += ' AND (wp.ticket_no LIKE ? OR hd.fire_area LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (startDate) {
      sql += ' AND DATE(wp.created_at) >= ?';
      params.push(startDate);
    }

    if (endDate) {
      sql += ' AND DATE(wp.created_at) <= ?';
      params.push(endDate);
    }

    // 总数
    const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const [countRows] = await conn.execute<RowDataPacket[]>(countSql, params);
    const total = countRows[0].total;

    sql += ' ORDER BY wp.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);

    const list = (rows as any[]).map(row => ({
      ...row,
      statusText: statusTextMap[row.main_status] || row.main_status,
      fireLevelText: row.fire_level === 1 ? '特级' : row.fire_level === 2 ? '一级' : row.fire_level === 3 ? '二级' : ''
    }));

    res.json({ code: 200, msg: 'success', data: list, total });
  } catch (error) {
    next(error);
  }
};

// ==================== 获取动火作业详情 ====================
export const getHotWorkDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();

    // 主表 + 扩展表
    const [mainRows] = await conn.execute<RowDataPacket[]>(`
      SELECT wp.*, u.real_name as applicant_name, d.name as dept_name
      FROM work_permits wp
      LEFT JOIN users u ON wp.applicant_id = u.id
      LEFT JOIN departments d ON d.name = u.department
      WHERE wp.id = ?
    `, [id]);

    if (!mainRows.length) {
      return res.status(404).json({ code: 404, msg: '作业票不存在' });
    }

    const main = mainRows[0] as any;

    // 扩展表
    const [extRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM hot_work_details WHERE ticket_id = ?',
      [id]
    );
    const ext = extRows[0] || {};

    // 气体检测记录
    const [gasRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM gas_checks WHERE ticket_id = ? ORDER BY check_time DESC',
      [id]
    );

    // 签字记录
    const [signRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM signatures WHERE biz_id = ? AND biz_type = "hot_work" ORDER BY sign_time ASC',
      [id]
    );

    // 审批记录（现有表）
    const [approvalRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM ticket_approvals WHERE ticket_id = ? ORDER BY approval_time ASC',
      [id]
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        ...main,
        statusText: statusTextMap[main.status] || main.status,
        extension: ext,
        gasChecks: gasRows,
        signatures: signRows,
        approvals: approvalRows
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== 创建动火作业票 ====================
export const createHotWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      projectName,
      workLocation,
      workContent,
      startTime,
      endTime,
      fireLevel,
      fireArea,
      fireType,
      riskAnalysis,
      safetyMeasures,
      deptId
    } = req.body;

    const userId = (req as any).user?.userId;

    // 强制培训准入校验
    const canWork = await checkCanWork(userId, 'hot_work');
    if (!canWork.allowed) {
      return res.status(403).json({ code: 403, msg: canWork.reason });
    }

    const conn = await getConnection();

    await conn.beginTransaction();

    try {
      // 1. 生成票号
      const ticketNo = `HW${Date.now()}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      // 2. 创建主表记录
      const [mainResult] = await conn.execute<OkPacket>(
        `INSERT INTO work_permits
         (ticket_no, ticket_type, ticket_level, project_name, work_location, work_content,
          status, applicant_id, apply_time, start_time, end_time,
          safety_measures, current_node, created_at, updated_at)
         VALUES (?, 'hot_work', ?, ?, ?, ?, '1', ?, NOW(), ?, ?, ?, 0, NOW(), NOW())`,
        [ticketNo, String(fireLevel), projectName, workLocation, workContent,
         userId, startTime || null, endTime || null,
         safetyMeasures ? JSON.stringify(safetyMeasures) : null]
      );

      const ticketId = mainResult.insertId;

      // 3. 创建动火扩展表
      await conn.execute(
        `INSERT INTO hot_work_details
         (ticket_id, fire_level, fire_area, fire_type, risk_analysis, status_flow, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [ticketId, fireLevel, fireArea, fireType, riskAnalysis,
         JSON.stringify([{ status: 1, time: new Date(), userId, remark: '创建草稿' }])]
      );

      await conn.commit();

      // 操作审计
      await recordTrace({
        entity_type: 'work_ticket', entity_id: ticketId, entity_no: ticketNo,
        action: 'create', action_label: '创建动火作业',
        operator_id: userId, operator_name: (req as any).user?.realName || '',
        snapshot_after: { status: '1', ticketNo, projectName, fireLevel, fireArea }
      });

      res.status(201).json({
        code: 200,
        msg: 'success',
        data: { id: ticketId, ticketNo }
      });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== 更新动火作业 ====================
export const updateHotWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      projectName, workLocation, workContent, startTime, endTime,
      fireLevel, fireArea, fireType, riskAnalysis, safetyMeasures
    } = req.body;

    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    // 只能修改草稿状态
    const [checkRows] = await conn.execute<RowDataPacket[]>(
      'SELECT status, applicant_id FROM work_permits WHERE id = ?',
      [id]
    );

    if (!checkRows.length) {
      return res.status(404).json({ code: 404, msg: '作业票不存在' });
    }

    const check = checkRows[0] as any;
    if (check.status !== '1' && check.status !== 'draft') {
      return res.status(400).json({ code: 400, msg: '只有草稿状态可以修改' });
    }

    if (check.applicant_id !== userId) {
      return res.status(403).json({ code: 403, msg: '无权限修改' });
    }

    await conn.beginTransaction();
    try {
      await conn.execute(
        `UPDATE work_permits SET
         project_name=?, work_location=?, work_content=?,
         start_time=?, end_time=?, ticket_level=?,
         safety_measures=?, updated_at=NOW()
         WHERE id=?`,
        [projectName, workLocation, workContent, startTime, endTime,
         String(fireLevel), safetyMeasures ? JSON.stringify(safetyMeasures) : null, id]
      );

      await conn.execute(
        `UPDATE hot_work_details SET
         fire_level=?, fire_area=?, fire_type=?, risk_analysis=?, updated_at=NOW()
         WHERE ticket_id=?`,
        [fireLevel, fireArea, fireType, riskAnalysis, id]
      );

      await conn.commit();
      res.json({ code: 200, msg: 'success' });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== 提交审批 ====================
export const submitHotWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status, applicant_id, ticket_no FROM work_permits WHERE id = ?',
      [id]
    );

    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });

    const ticket = rows[0] as any;
    if (ticket.status !== '1' && ticket.status !== 'draft') {
      return res.status(400).json({ code: 400, msg: '只有草稿状态可以提交' });
    }

    if (ticket.applicant_id !== userId) {
      return res.status(403).json({ code: 403, msg: '只能提交自己的作业票' });
    }

    await conn.execute(
      "UPDATE work_permits SET status = '2', updated_at = NOW() WHERE id = ?",
      [id]
    );

    await conn.execute(
      `UPDATE hot_work_details SET status_flow = JSON_ARRAY_APPEND(
        COALESCE(status_flow, JSON_ARRAY()),
        '$',
        JSON_OBJECT('status', 2, 'time', NOW(), 'userId', ?, 'remark', '提交审批')
      ), updated_at = NOW() WHERE ticket_id = ?`,
      [userId, id]
    );

    // 操作审计
    await recordTrace({
      entity_type: 'work_ticket', entity_id: Number(id), entity_no: ticket.ticket_no,
      action: 'submit', action_label: '提交动火审批',
      operator_id: userId, operator_name: (req as any).user?.realName || '',
      snapshot_before: { status: ticket.status }, snapshot_after: { status: '2' }
    });

    res.json({ code: 200, msg: '提交成功' });
  } catch (error) {
    next(error);
  }
};

// ==================== 审批流（部门/安全/最终批准） ====================
export const approveHotWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { action, comment = '' } = req.body; // action: dept / safety / final / reject
    const userId = (req as any).user?.userId;
    const userName = (req as any).user?.username || '';
    const userRole = (req as any).user?.role;
    const conn = await getConnection();

    if (!action || !['dept', 'safety', 'final', 'reject'].includes(action)) {
      return res.status(400).json({ code: 400, msg: '审批动作不正确' });
    }

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT id, ticket_no, status, current_node FROM work_permits WHERE id = ?',
      [id]
    );

    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });

    const ticket = rows[0] as any;
    let nextStatus = ticket.status;
    let nodeName = '';
    let approvalResult = 'approve';

    if (action === 'reject') {
      nextStatus = '1'; // 退回草稿
      nodeName = '驳回';
      approvalResult = 'reject';
    } else if (action === 'dept') {
      // 部门审批：需要角色 <= 4（部门负责人及以上）
      if (userRole > 4) return res.status(403).json({ code: 403, msg: '无部门审批权限' });
      nextStatus = '3';
      nodeName = '部门审批';
    } else if (action === 'safety') {
      // 安全审批：需要角色 <= 3
      if (userRole > 3) return res.status(403).json({ code: 403, msg: '无安全审批权限' });
      nextStatus = '4';
      nodeName = '安全审批';
    } else if (action === 'final') {
      // 最终批准：需要角色 <= 2
      if (userRole > 2) return res.status(403).json({ code: 403, msg: '无最终批准权限' });
      nextStatus = '5';
      nodeName = '最终批准';
    }

    await conn.beginTransaction();
    try {
      // 更新主表状态
      await conn.execute(
        'UPDATE work_permits SET status = ?, current_node = current_node + 1, updated_at = NOW() WHERE id = ?',
        [nextStatus, id]
      );

      // 写入审批记录
      await conn.execute(
        `INSERT INTO ticket_approvals
         (ticket_id, node_id, node_name, approver_id, approver_name, approval_result, approval_opinion, approval_time)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
        [id, ticket.current_node + 1, nodeName, userId, userName, approvalResult, comment]
      );

      // 更新扩展表状态流
      const flowStatus = action === 'reject' ? 1 : action === 'dept' ? 3 : action === 'safety' ? 4 : 5;
      await conn.execute(
        `UPDATE hot_work_details SET status_flow = JSON_ARRAY_APPEND(
          COALESCE(status_flow, JSON_ARRAY()),
          '$',
          JSON_OBJECT('status', ?, 'time', NOW(), 'userId', ?, 'remark', ?)
        ), updated_at = NOW() WHERE ticket_id = ?`,
        [flowStatus, userId, `${nodeName}${action === 'reject' ? '：退回草稿' : '通过'}`, id]
      );

      await conn.commit();

      // 操作审计
      await recordTrace({
        entity_type: 'work_ticket', entity_id: Number(id), entity_no: ticket.ticket_no,
        action: action === 'reject' ? 'reject' : `${action}_approve`,
        action_label: nodeName,
        operator_id: userId, operator_name: userName,
        snapshot_before: { status: ticket.status }, snapshot_after: { status: nextStatus }
      });

      res.json({ code: 200, msg: action === 'reject' ? '已驳回' : '审批通过' });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== 开始作业 ====================
export const startWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM work_permits WHERE id = ?',
      [id]
    );

    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    if ((rows[0] as any).status !== '5') {
      return res.status(400).json({ code: 400, msg: '只有已批准状态才能开始作业' });
    }

    await conn.execute(
      "UPDATE work_permits SET status = '6', actual_start_time = NOW(), updated_at = NOW() WHERE id = ?",
      [id]
    );

    await conn.execute(
      `UPDATE hot_work_details SET status_flow = JSON_ARRAY_APPEND(
        COALESCE(status_flow, JSON_ARRAY()), '$',
        JSON_OBJECT('status', 6, 'time', NOW(), 'userId', ?, 'remark', '开始作业')
      ), updated_at = NOW() WHERE ticket_id = ?`,
      [userId, id]
    );

    // 操作审计
    await recordTrace({
      entity_type: 'work_ticket', entity_id: Number(id),
      action: 'start_work', action_label: '开始作业',
      operator_id: userId, operator_name: (req as any).user?.realName || '',
      snapshot_before: { status: '5' }, snapshot_after: { status: '6' }
    });

    res.json({ code: 200, msg: '作业开始' });
  } catch (error) {
    next(error);
  }
};

// ==================== 完成作业 ====================
export const finishWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM work_permits WHERE id = ?',
      [id]
    );

    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    if ((rows[0] as any).status !== '6') {
      return res.status(400).json({ code: 400, msg: '只有作业中状态才能完成作业' });
    }

    await conn.execute(
      "UPDATE work_permits SET status = '7', actual_end_time = NOW(), updated_at = NOW() WHERE id = ?",
      [id]
    );

    await conn.execute(
      `UPDATE hot_work_details SET status_flow = JSON_ARRAY_APPEND(
        COALESCE(status_flow, JSON_ARRAY()), '$',
        JSON_OBJECT('status', 7, 'time', NOW(), 'userId', ?, 'remark', '作业完成')
      ), updated_at = NOW() WHERE ticket_id = ?`,
      [userId, id]
    );

    // 操作审计
    await recordTrace({
      entity_type: 'work_ticket', entity_id: Number(id),
      action: 'finish_work', action_label: '完成作业',
      operator_id: userId, operator_name: (req as any).user?.realName || '',
      snapshot_before: { status: '6' }, snapshot_after: { status: '7' }
    });

    res.json({ code: 200, msg: '作业完成，待验收' });
  } catch (error) {
    next(error);
  }
};

// ==================== 验收关闭 ====================
export const closeWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM work_permits WHERE id = ?',
      [id]
    );

    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const st = (rows[0] as any).status;
    if (st !== '7' && st !== '5') {
      return res.status(400).json({ code: 400, msg: '当前状态不能关闭' });
    }

    await conn.execute(
      "UPDATE work_permits SET status = '8', updated_at = NOW() WHERE id = ?",
      [id]
    );

    await conn.execute(
      `UPDATE hot_work_details SET status_flow = JSON_ARRAY_APPEND(
        COALESCE(status_flow, JSON_ARRAY()), '$',
        JSON_OBJECT('status', 8, 'time', NOW(), 'userId', ?, 'remark', '验收关闭')
      ), updated_at = NOW() WHERE ticket_id = ?`,
      [userId, id]
    );

    // 操作审计
    await recordTrace({
      entity_type: 'work_ticket', entity_id: Number(id),
      action: 'close', action_label: '归档关闭',
      operator_id: userId, operator_name: (req as any).user?.realName || '',
      snapshot_before: { status: st }, snapshot_after: { status: '8' }
    });

    res.json({ code: 200, msg: '已关闭归档' });
  } catch (error) {
    next(error);
  }
};

// ==================== 气体检测（移动端/PC） ====================
export const gasCheck = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const {
      checkType = 'before',
      oxygenPercent,
      flammablePercent,
      toxicPpm,
      toxicType,
      checkResult,
      checkLocation,
      checkerName,
      devicePhoto,
      scenePhoto,
      remark
    } = req.body;

    const userId = (req as any).user?.userId;
    const conn = await getConnection();

    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO gas_checks
       (ticket_id, check_type, oxygen_percent, flammable_percent, toxic_ppm, toxic_type,
        check_result, check_location, check_time, checker_id, checker_name,
        device_photo, scene_photo, remark)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
      [id, checkType, oxygenPercent, flammablePercent, toxicPpm, toxicType,
       checkResult, checkLocation, userId, checkerName, devicePhoto, scenePhoto, remark]
    );

    res.json({ code: 200, msg: 'success', data: { id: result.insertId } });
  } catch (error) {
    next(error);
  }
};

// ==================== 获取气体检测记录 ====================
export const getGasChecks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { checkType } = req.query;
    const conn = await getConnection();

    let sql = 'SELECT * FROM gas_checks WHERE ticket_id = ?';
    const params: any[] = [id];

    if (checkType) {
      sql += ' AND check_type = ?';
      params.push(checkType);
    }

    sql += ' ORDER BY check_time DESC';
    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  }
};
