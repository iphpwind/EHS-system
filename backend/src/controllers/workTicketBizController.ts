import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { TICKET_TYPE_MAP } from '../utils/ticketTypeMap';
import { checkTrainingEligibility } from './trainingChecker';

const statusTextMap: Record<string, string> = {
  'draft': '草稿',
  'pending': '待审批',
  'approved': '已批准',
  'executing': '执行中',
  'completed': '已完成',
  'closed': '已关闭',
  'cancelled': '已作废',
  'terminated': '已终止'
};

interface TicketTypeConfig {
  apiPrefix: string;
  ticketType: string;
  tableName: string;
  label: string;
}

const TYPE_CONFIGS: TicketTypeConfig[] = [
  { apiPrefix: 'highwork', ticketType: 'high_work', tableName: 'highwork_tickets', label: '高处作业' },
  { apiPrefix: 'restrictedwork', ticketType: 'limited_space', tableName: 'restrictedwork_tickets', label: '受限空间作业' },
  { apiPrefix: 'electricwork', ticketType: 'temporary_electricity', tableName: 'electricwork_tickets', label: '临时用电作业' },
  { apiPrefix: 'blindinfo', ticketType: 'blind_work', tableName: 'blind_tickets', label: '盲板抽堵作业' },
  { apiPrefix: 'brokenInfo', ticketType: 'road_work', tableName: 'broken_tickets', label: '断路作业' },
  { apiPrefix: 'hoistingwork', ticketType: 'hoisting_work', tableName: 'hoisting_tickets', label: '吊装作业' },
  { apiPrefix: 'earth', ticketType: 'excavation_work', tableName: 'earth_tickets', label: '动土作业' },
];

function getConfig(apiPrefix: string): TicketTypeConfig {
  const cfg = TYPE_CONFIGS.find(c => c.apiPrefix === apiPrefix);
  if (!cfg) throw new Error(`不支持的作业类型前缀: ${apiPrefix}`);
  return cfg;
}

// ==================== 列表查询 ====================
export const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const { page = 1, pageSize = 10, status, keyword, startDate, endDate } = req.query;
    const conn = await getConnection();

    let sql = `
      SELECT wp.id, wp.ticket_no, wp.ticket_type, wp.status, wp.project_name, wp.work_location,
             wp.applicant_id, wp.created_at, wp.start_time, wp.end_time,
             u.real_name as applicant_name, d.name as dept_name
      FROM work_permits wp
      LEFT JOIN users u ON wp.applicant_id = u.id
      LEFT JOIN departments d ON d.name = u.department
      WHERE wp.ticket_type = ?
    `;
    const params: any[] = [cfg.ticketType];

    if (status) {
      sql += ' AND wp.status = ?';
      params.push(status);
    }
    if (keyword) {
      sql += ' AND (wp.ticket_no LIKE ? OR wp.project_name LIKE ?)';
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

    const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const [countRows] = await conn.execute<RowDataPacket[]>(countSql, params);
    const total = countRows[0].total;

    sql += ' ORDER BY wp.created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);

    const list = (rows as any[]).map(row => ({
      ...row,
      statusText: statusTextMap[row.status] || row.status
    }));

    res.json({ code: 200, msg: 'success', data: list, total });
  } catch (error) {
    next(error);
  }
};

// ==================== 详情查询 ====================
export const getDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const { id } = req.params;
    const conn = await getConnection();

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

    const [extRows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM \`${cfg.tableName}\` WHERE ticket_id = ?`,
      [id]
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        ...main,
        statusText: statusTextMap[main.status] || main.status,
        extension: extRows[0] || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==================== 创建 ====================
export const createTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const {
      projectName, workLocation, workContent, startTime, endTime,
      ticketLevel, safetyMeasures, ...extData
    } = req.body;

    const userId = (req as any).user?.userId;

    // P0: 培训资格联动校验 — 检查用户是否有对应作业类型的培训资格
    const trainingCheck = await checkTrainingEligibility(userId, cfg.ticketType);
    if (!trainingCheck.eligible) {
      return res.status(403).json({
        code: 403,
        msg: `培训资格未满足：${trainingCheck.reason}。请完成专项培训后再申请作业票。`
      });
    }

    const conn = await getConnection();

    await conn.beginTransaction();
    try {
      const ticketNo = `${cfg.ticketType.toUpperCase().replace('_','')}${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;

      const [mainResult] = await conn.execute<OkPacket>(
        `INSERT INTO work_permits
         (ticket_no, ticket_type, ticket_level, project_name, work_location, work_content,
          status, applicant_id, apply_time, start_time, end_time, safety_measures, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, NOW(), ?, ?, ?, NOW(), NOW())`,
        [ticketNo, cfg.ticketType, ticketLevel || '', projectName, workLocation, workContent,
         userId, startTime || null, endTime || null,
         safetyMeasures ? JSON.stringify(safetyMeasures) : null]
      );

      const ticketId = mainResult.insertId;

      // 创建子表记录
      await conn.execute<OkPacket>(
        `INSERT INTO \`${cfg.tableName}\` (ticket_id) VALUES (?)`,
        [ticketId]
      );

      // 更新子表扩展字段
      const allowedFields = Object.keys(TICKET_TYPE_MAP[cfg.ticketType]?.detailFields || []);
      const updateFields: string[] = [];
      const updateValues: any[] = [];
      for (const key of Object.keys(extData)) {
        updateFields.push(`\`${key}\` = ?`);
        updateValues.push(extData[key] === undefined ? null : extData[key]);
      }
      if (updateFields.length > 0) {
        updateValues.push(ticketId);
        await conn.execute(
          `UPDATE \`${cfg.tableName}\` SET ${updateFields.join(', ')} WHERE ticket_id = ?`,
          updateValues
        );
      }

      await conn.commit();
      res.status(201).json({ code: 200, msg: 'success', data: { id: ticketId, ticketNo } });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== 更新 ====================
export const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const { id } = req.params;
    const {
      projectName, workLocation, workContent, startTime, endTime,
      ticketLevel, safetyMeasures, status, ...extData
    } = req.body;

    const conn = await getConnection();

    const [checkRows] = await conn.execute<RowDataPacket[]>(
      'SELECT status, applicant_id FROM work_permits WHERE id = ?',
      [id]
    );
    if (!checkRows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const check = checkRows[0] as any;
    if (check.status !== 'draft' && check.status !== 'pending') {
      return res.status(400).json({ code: 400, msg: '只有草稿或待审批状态可以修改' });
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
         ticketLevel, safetyMeasures ? JSON.stringify(safetyMeasures) : null, id]
      );

      const updateFields: string[] = [];
      const updateValues: any[] = [];
      for (const key of Object.keys(extData)) {
        updateFields.push(`\`${key}\` = ?`);
        updateValues.push(extData[key] === undefined ? null : extData[key]);
      }
      if (updateFields.length > 0) {
        updateValues.push(id);
        await conn.execute(
          `UPDATE \`${cfg.tableName}\` SET ${updateFields.join(', ')} WHERE ticket_id = ?`,
          updateValues
        );
      }

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

// ==================== 删除 ====================
export const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const { id } = req.params;
    const conn = await getConnection();

    await conn.beginTransaction();
    try {
      await conn.execute(`DELETE FROM \`${cfg.tableName}\` WHERE ticket_id = ?`, [id]);
      await conn.execute('DELETE FROM work_permits WHERE id = ?', [id]);
      await conn.commit();
      res.json({ code: 200, msg: '删除成功' });
    } catch (err) {
      await conn.rollback();
      throw err;
    }
  } catch (error) {
    next(error);
  }
};

// ==================== 更新状态（作废/提交/审批等） ====================
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;
    const conn = await getConnection();

    await conn.execute(
      'UPDATE work_permits SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    res.json({ code: 200, msg: '状态更新成功', data: { status, statusText: statusTextMap[status] || status } });
  } catch (error) {
    next(error);
  }
};

// ==================== list2（用于前端下拉选择等） ====================
export const getList2 = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cfg = getConfig(req.params.typePrefix);
    const conn = await getConnection();
    const { keyword, limit = 50 } = req.query;

    let sql = `
      SELECT wp.id, wp.ticket_no, wp.project_name, wp.status, wp.work_location
      FROM work_permits wp
      WHERE wp.ticket_type = ?
    `;
    const params: any[] = [cfg.ticketType];

    if (keyword) {
      sql += ' AND (wp.ticket_no LIKE ? OR wp.project_name LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    sql += ' ORDER BY wp.created_at DESC LIMIT ?';
    params.push(Number(limit));

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  }
};
