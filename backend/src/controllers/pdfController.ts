import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket } from 'mysql2';
import { generateHotWorkPDF } from '../utils/pdfGenerator';

/**
 * 导出动火作业票 PDF
 * GET /api/pdf/hot-work/:id
 */
export const exportHotWorkPDF = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    conn = await getConnection();

    // 1. 查询主表
    const [mainRows] = await conn.execute<RowDataPacket[]>(`
      SELECT wp.*, u.real_name as applicant_name, u.department_id as applicant_dept_id, d.name as dept_name
      FROM work_permits wp
      LEFT JOIN users u ON wp.applicant_id = u.id
      LEFT JOIN departments d ON d.id = u.department_id  -- ✅ INT 外键
      WHERE wp.id = ?
    `, [id]);

    if (!mainRows.length) {
      return res.status(404).json({ code: 404, msg: '作业票不存在' });
    }

    const main = mainRows[0] as any;

    // 2. 查询扩展表
    const [extRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM hot_work_details WHERE ticket_id = ?', [id]
    );
    const ext = extRows[0] || {};

    // 3. 查询气体检测
    const [gasRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM gas_checks WHERE ticket_id = ? ORDER BY check_time ASC', [id]
    );

    // 4. 查询签字
    const [signRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM signatures WHERE biz_id = ? AND biz_type = "hot_work"', [id]
    );

    // 5. 查询审批记录
    const [approvalRows] = await conn.execute<RowDataPacket[]>(
      'SELECT * FROM ticket_approvals WHERE ticket_id = ? ORDER BY approval_time ASC', [id]
    );

    const statusMap: Record<string, string> = {
      '1': '草稿', '2': '已提交', '3': '部门审批通过',
      '4': '安全审批通过', '5': '已批准', '6': '作业中', '7': '待验收', '8': '已关闭'
    };

    const pdfData = {
      ticketNo: main.ticket_no,
      ticketType: '动火作业',
      statusText: statusMap[String(main.status)] || main.status,
      applicantName: main.applicant_name,
      deptName: main.dept_name,
      projectName: main.project_name,
      workLocation: main.work_location,
      workContent: main.work_content,
      fireLevelText: ext.fire_level === 1 ? '特级' : ext.fire_level === 2 ? '一级' : ext.fire_level === 3 ? '二级' : '',
      fireArea: ext.fire_area,
      fireType: ext.fire_type,
      riskAnalysis: ext.risk_analysis,
      startTime: main.start_time ? new Date(main.start_time).toLocaleString() : '',
      endTime: main.end_time ? new Date(main.end_time).toLocaleString() : '',
      actualStartTime: main.actual_start_time ? new Date(main.actual_start_time).toLocaleString() : undefined,
      actualEndTime: main.actual_end_time ? new Date(main.actual_end_time).toLocaleString() : undefined,
      gasChecks: gasRows,
      signatures: signRows,
      approvals: approvalRows
    };

    const pdfBuffer = await generateHotWorkPDF(pdfData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=hot_work_${main.ticket_no}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
