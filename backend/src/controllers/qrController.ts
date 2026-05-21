import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';
import QRCode from 'qrcode';

/**
 * 生成作业票二维码
 * POST /api/qr/generate
 * Body: { ticketId: number }
 */
export const generateQR = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { ticketId } = req.body;

    if (!ticketId) {
      return res.status(400).json({ success: false, message: '作业票ID不能为空' });
    }

    conn = await getConnection();
    const [tickets] = await conn.execute<RowDataPacket[]>(
      'SELECT id, ticket_no FROM work_permits WHERE id = ?',
      [ticketId]
    );

    if (!(tickets as any[]).length) {
      return res.status(404).json({ success: false, message: '作业票不存在' });
    }

    const ticket = (tickets as any[])[0];
    const ticketNo = ticket.ticket_no;

    // 生成二维码（包含票号作为扫码核验内容）
    const qrCodeBase64 = await QRCode.toDataURL(ticketNo, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1e40af',
        light: '#ffffff'
      }
    });

    res.json({
      success: true,
      data: {
        qrCodeBase64,
        ticketNo,
        ticketId: ticket.id
      }
    });
  } catch (error) {
    console.error('Generate QR code error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 通过二维码核验作业票
 * POST /api/qr/verify
 * Body: { code: string }
 */
export const verifyQR = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: '请提供二维码编号' });
    }

    conn = await getConnection();
    const [tickets] = await conn.execute<RowDataPacket[]>(
      `SELECT wp.*, u.real_name as applicant_name
       FROM work_permits wp
       LEFT JOIN users u ON wp.applicant_id = u.id
       WHERE wp.ticket_no = ? OR wp.id = ?`,
      [code, isNaN(Number(code)) ? 0 : Number(code)]
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
  } finally {
    if (conn) conn.release();
  }
};
