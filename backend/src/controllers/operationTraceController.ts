/**
 * 操作回放审计链 - 查询API
 */

import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';

/**
 * 查询指定作业票的操作链
 * GET /api/operations/trace/:ticketId
 */
export const getTraceByTicket = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { ticketId } = req.params;
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT * FROM operation_traces WHERE entity_type = 'work_ticket' AND entity_id = ? ORDER BY created_at ASC`,
      [ticketId]
    );
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 查询指定用户的操作记录
 * GET /api/operations/trace/user/:userId
 */
export const getTraceByUser = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { userId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;
    conn = await getConnection();

    const [countRows] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM operation_traces WHERE operator_id = ?',
      [userId]
    );
    const total = countRows[0].total;

    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM operation_traces WHERE operator_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, String(pageSize), String((Number(page) - 1) * Number(pageSize))]
    );

    res.json({ code: 200, msg: 'success', data: rows, total });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 查询最近的审计日志
 * GET /api/operations/trace?limit=50
 */
export const getRecentTraces = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { entityType, limit = 50 } = req.query;
    conn = await getConnection();
    let sql = 'SELECT * FROM operation_traces';
    const params: any[] = [];

    if (entityType) {
      sql += ' WHERE entity_type = ?';
      params.push(entityType as string);
    }

    sql += ' ORDER BY created_at DESC LIMIT ?';
    params.push(String(limit));

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
