import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { TICKET_TYPE_MAP } from '../utils/ticketTypeMap';
import { AppError, NotFoundError, BadRequestError } from '../utils/errors';

interface SubTicketRow extends RowDataPacket {
  id: number;
  ticket_id: number;
}

/**
 * 获取子表名称
 */
const getSubTableInfo = (ticketType: string) => {
  const info = TICKET_TYPE_MAP[ticketType];
  if (!info) {
    throw new BadRequestError(`不支持的作业类型: ${ticketType}`);
  }
  return info;
};

/**
 * 获取指定作业票类型的子表详情
 * GET /api/ticket-types/:type/detail/:ticketId
 */
export const getSubTicketDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, ticketId } = req.params;
    const info = getSubTableInfo(type);
    
    const conn = await getConnection();
    const safeTableName = info.tableName.replace(/[^a-z_]/g, '');
    
    const [rows] = await conn.execute<SubTicketRow[]>(
      `SELECT * FROM \`${safeTableName}\` WHERE ticket_id = ?`,
      [ticketId]
    );
    
    res.json({
      success: true,
      data: rows[0] || null
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 保存（创建或更新）作业票子表详情
 * POST /api/ticket-types/:type/detail/:ticketId
 */
export const saveSubTicketDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, ticketId } = req.params;
    const info = getSubTableInfo(type);
    const detailData = req.body;
    
    const conn = await getConnection();
    const safeTableName = info.tableName.replace(/[^a-z_]/g, '');

    // 安全过滤：仅允许更新子表已定义的字段
    const allowedFields = [
      ...info.detailFields,
      'remark', 'worker_sign', 'analyst_sign', 'guardian_sign',
      'fire_guardian_sign', 'electrician_sign', 'operator_sign',
      'confirmation_sign', 'commander_cert_no', 'operator_cert_no',
      'analyst_name', 'analysis_time', 'reanalysis_interval',
      'is_dangerous_work', 'fire_work_type', 'continuous_monitoring',
      'entry_personnel', 'rain_proof_measure', 'explosion_proof_level',
      'blind_position_img', 'work_img', 'crane_type', 'crane_plate_no',
      'commander_name', 'operator_name', 'emergency_access',
      'emergency_access_desc', 'detour_route', 'soil_stack_distance',
      'fence_set', 'warning_sign_set', 'night_warning_light',
      'emergency_exit', 'pipeline_owner', 'dig_area',
      'support_type', 'dewatering_method', 'pipeline_probe_result',
      'scaffold_type', 'is_thunderstorm', 'ladder_inspection',
      'electrician_id', 'clean_fire_area', 'emergency_water',
      'fire_proof_screen', 'fire_blanket', 'is_high_pressure',
      'is_toxic_medium', 'pressure_relief', 'drain_done',
      'analysis_id', 'gas_analysis_time', 'oxygen_content',
      'combustible_gas', 'toxic_gas_h2s', 'toxic_gas_co',
      'other_gas_name', 'other_gas_value',
      'fire_guardian_id', 'fire_guardian_name',
      'guardian_name'
    ];

    // 检查是否已存在
    const [existing] = await conn.execute<SubTicketRow[]>(
      `SELECT id FROM \`${safeTableName}\` WHERE ticket_id = ?`,
      [ticketId]
    );

    // 构建更新字段集（只包含允许的字段）
    const fields: string[] = [];
    const values: any[] = [];

    for (const key of Object.keys(detailData)) {
      if (allowedFields.includes(key)) {
        fields.push(`\`${key}\` = ?`);
        values.push(detailData[key] === undefined ? null : detailData[key]);
      }
    }

    if (fields.length === 0) {
      throw new BadRequestError('未提供有效的更新字段');
    }

    if (existing.length > 0) {
      // 更新
      values.push(existing[0].id);
      await conn.execute<OkPacket>(
        `UPDATE \`${safeTableName}\` SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
      
      res.json({
        success: true,
        message: `${info.label}子表详情已更新`,
        id: existing[0].id
      });
    } else {
      // 创建子表记录
      const fieldNames = fields.map(f => f.split(' = ')[0]);
      const placeholders = fields.map(() => '?');
      
      await conn.execute<OkPacket>(
        `INSERT INTO \`${safeTableName}\` (ticket_id, ${fieldNames.join(', ')}) VALUES (?, ${placeholders.join(', ')})`,
        [ticketId, ...values]
      );
      
      res.json({
        success: true,
        message: `${info.label}子表详情已创建`,
        ticketId
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * 获取作业票及其子表的完整详情
 * GET /api/ticket-types/:type/full/:ticketId
 */
export const getFullTicketDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, ticketId } = req.params;
    const info = getSubTableInfo(type);
    
    const conn = await getConnection();
    const safeTableName = info.tableName.replace(/[^a-z_]/g, '');
    
    // 查询主表和子表
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT wp.*, st.* 
       FROM work_permits wp 
       LEFT JOIN \`${safeTableName}\` st ON wp.id = st.ticket_id 
       WHERE wp.id = ?`,
      [ticketId]
    );
    
    if (rows.length === 0) {
      throw new NotFoundError('作业票不存在');
    }
    
    // 获取审批记录
    const [approvals] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM ticket_approvals WHERE ticket_id = ? ORDER BY node_id ASC`,
      [ticketId]
    );
    
    // 获取作业人员
    const [persons] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM ticket_persons WHERE ticket_id = ?`,
      [ticketId]
    );
    
    res.json({
      success: true,
      data: {
        ...rows[0],
        approvals,
        persons
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 修改现有ticketController的createTicket函数，使其自动创建子表记录
 * 通过在ticketController.ts中调用此函数实现
 */
export const createSubTicketRecord = async (ticketId: number, ticketType: string) => {
  const info = TICKET_TYPE_MAP[ticketType];
  if (!info) return; // 不是支持的作业类型，跳过
  
  const conn = await getConnection();
  const safeTableName = info.tableName.replace(/[^a-z_]/g, '');
  
  await conn.execute<OkPacket>(
    `INSERT INTO \`${safeTableName}\` (ticket_id) VALUES (?)`,
    [ticketId]
  );
};
