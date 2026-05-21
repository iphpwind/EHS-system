/**
 * 作业票监护人签到通用模块（GB 30871 强制）
 * 供所有作业票控制器复用
 */
import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, OkPacket } from 'mysql2';
import { getConnection } from '../config/database';
import { recordTrace } from '../utils/operationTracer';

/**
 * 创建监护人签到 handler（闭包注入 Controller 专用依赖）
 * @param ticketType 作业票类型标识，如 'hot_work'
 * @param detailsTable 扩展表名，如 'hot_work_details'
 */
export function createGuardianSignInHandler(
  ticketType: string,
  detailsTable: string
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let conn: any = null;
    try {
      const { id } = req.params;
      const { signImage, location } = req.body;
      const userId = (req as any).user?.userId;
      const userName = (req as any).user?.realName || '';
      conn = await getConnection();

      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT wp.status, wp.guardian_id, wp.guardian_sign_in_status, wp.ticket_no, wp.ticket_type
         FROM work_permits wp WHERE wp.id = ? AND wp.ticket_type = ?`,
        [id, ticketType]
      );
      if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
      const ticket = rows[0] as any;

      if (Number(ticket.guardian_id) !== Number(userId)) {
        return res.status(403).json({ code: 403, msg: '只有指定监护人可以签到' });
      }
      if (ticket.status !== '5' && ticket.status !== '6') {
        return res.status(400).json({ code: 400, msg: '当前状态不允许监护人签到（需已批准或作业中）' });
      }
      if (ticket.guardian_sign_in_status === 'signed') {
        return res.status(400).json({ code: 400, msg: '监护人已签到，无需重复签到' });
      }

      await conn.beginTransaction();
      try {
        await conn.execute(
          `UPDATE work_permits SET
            guardian_sign_in_status = 'signed',
            guardian_sign_in_time = NOW(),
            guardian_sign_in_location = ?,
            guardian_sign_image = ?,
            updated_at = NOW()
           WHERE id = ?`,
          [location || null, signImage || null, id]
        );

        await conn.execute(
          `INSERT INTO signatures (biz_type, biz_id, sign_type, signer_id, signer_name, sign_image, sign_time, ip_address, device_info, created_at)
           VALUES (?, ?, 'guardian_sign_in', ?, ?, ?, NOW(), ?, ?, NOW())`,
          [ticketType, id, userId, userName, signImage || null, req.ip || '', req.get('User-Agent') || '']
        );

        await conn.execute(
          `UPDATE ${detailsTable} SET status_flow = JSON_ARRAY_APPEND(
            COALESCE(status_flow, JSON_ARRAY()), '$',
            JSON_OBJECT('status', 'guardian_signed', 'time', NOW(), 'userId', ?, 'remark', ?, 'location', ?)
          ), updated_at = NOW() WHERE ticket_id = ?`,
          [userId, `监护人${userName}签到`, location || '', id]
        );

        await conn.commit();

        await recordTrace({
          entity_type: 'work_ticket', entity_id: Number(id), entity_no: ticket.ticket_no,
          action: 'guardian_sign_in', action_label: '监护人签到',
          operator_id: userId, operator_name: userName,
          snapshot_after: { guardian_sign_in_status: 'signed' }
        });

        res.json({ code: 200, msg: '监护人签到成功', data: { signInTime: new Date(), status: 'signed' } });
      } catch (err) {
        await conn.rollback();
        throw err;
      }
    } catch (error) {
      next(error);
    } finally {
      if (conn) conn.release();
    }
  };
}

/**
 * 创建监护人确认作业结束 handler
 */
export function createGuardianConfirmEndHandler(ticketType: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    let conn: any = null;
    try {
      const { id } = req.params;
      const { confirmImage, location } = req.body;
      const userId = (req as any).user?.userId;
      const userName = (req as any).user?.realName || '';
      conn = await getConnection();

      const [rows] = await conn.execute<RowDataPacket[]>(
        `SELECT wp.status, wp.guardian_id, wp.guardian_sign_in_status, wp.ticket_no
         FROM work_permits wp WHERE wp.id = ? AND wp.ticket_type = ?`,
        [id, ticketType]
      );
      if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
      const ticket = rows[0] as any;

      if (Number(ticket.guardian_id) !== Number(userId)) {
        return res.status(403).json({ code: 403, msg: '只有指定监护人可以确认' });
      }
      if (ticket.status !== '6' && ticket.status !== '7') {
        return res.status(400).json({ code: 400, msg: '当前状态不允许监护人确认' });
      }

      await conn.execute(
        `UPDATE work_permits SET guardian_confirm_time = NOW(), updated_at = NOW() WHERE id = ?`,
        [id]
      );

      await conn.execute(
        `INSERT INTO signatures (biz_type, biz_id, sign_type, signer_id, signer_name, sign_image, sign_time, ip_address, device_info, created_at)
         VALUES (?, ?, 'guardian_confirm_end', ?, ?, ?, NOW(), ?, ?, NOW())`,
        [ticketType, id, userId, userName, confirmImage || null, req.ip || '', req.get('User-Agent') || '']
      );

      await recordTrace({
        entity_type: 'work_ticket', entity_id: Number(id), entity_no: ticket.ticket_no,
        action: 'guardian_confirm_end', action_label: '监护人确认作业结束',
        operator_id: userId, operator_name: userName
      });

      res.json({ code: 200, msg: '监护人确认成功' });
    } catch (error) {
      next(error);
    } finally {
      if (conn) conn.release();
    }
  };
}
