import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { checkCanWork } from '../utils/validateState';
import { recordTrace } from '../utils/operationTracer';

const statusTextMap: Record<string, string> = {
  '1': '草稿', '2': '已提交', '3': '部门审批通过',
  '4': '安全审批通过', '5': '已批准', '6': '作业中', '7': '待验收', '8': '已关闭'
};

const ticketType = 'restricted_work';
const extTable = 'restrictedwork_tickets';
const prefix = 'RS';

export const getConfinedSpaceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, pageSize = 10, status, keyword, deptId, startDate, endDate } = req.query;
    const userRole = (req as any).user?.role; const userDeptName = (req as any).user?.department || '';
    const userOrgId = (req as any).user?.orgId || 1;
    const conn = await getConnection();
    let sql = `SELECT wp.id, wp.ticket_no, wp.status as main_status, wp.applicant_id, wp.created_at,
      u.real_name as applicant_name, d.name as dept_name,
      ext.space_name, ext.space_type, ext.oxygen_content
      FROM work_permits wp
      LEFT JOIN users u ON wp.applicant_id = u.id
      LEFT JOIN departments d ON d.name = u.department
      LEFT JOIN ${extTable} ext ON wp.id = ext.permit_id
      WHERE wp.ticket_type = ?`;
    const params: any[] = [ticketType];
    if (userRole > 1) { sql += ' AND wp.org_id = ?'; params.push(userOrgId); }
    if (userRole >= 4) { sql += ' AND u.department = ?'; params.push(userDeptName); }
    if (status) { sql += ' AND wp.status = ?'; params.push(status); }
    if (deptId) { sql += ' AND u.department = (SELECT name FROM departments WHERE id = ?)'; params.push(deptId); }
    if (keyword) { sql += ' AND (wp.ticket_no LIKE ? OR wp.project_name LIKE ?)'; params.push(`%${keyword}%`, `%${keyword}%`); }
    if (startDate) { sql += ' AND DATE(wp.created_at) >= ?'; params.push(startDate); }
    if (endDate) { sql += ' AND DATE(wp.created_at) <= ?'; params.push(endDate); }
    const [countRows] = await conn.execute<RowDataPacket[]>(sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM'), params);
    const total = countRows[0].total;
    sql += ' ORDER BY wp.created_at DESC LIMIT ? OFFSET ?'; params.push(Number(pageSize), (Number(page) - 1) * Number(pageSize));
    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    const list = (rows as any[]).map(r => ({ ...r, statusText: statusTextMap[r.main_status] || r.main_status }));
    res.json({ code: 200, msg: 'success', data: list, total });
  } catch (error) { next(error); }
};

export const getConfinedSpaceDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; const conn = await getConnection();
    const [mainRows] = await conn.execute<RowDataPacket[]>(`SELECT wp.*, u.real_name as applicant_name, d.name as dept_name FROM work_permits wp LEFT JOIN users u ON wp.applicant_id = u.id LEFT JOIN departments d ON d.name = u.department WHERE wp.id = ?`, [id]);
    if (!mainRows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const [extRows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM ${extTable} WHERE permit_id = ?`, [id]);
    const [signRows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM signatures WHERE biz_id = ? AND biz_type = ? ORDER BY sign_time ASC`, [id, ticketType]);
    const [approvalRows] = await conn.execute<RowDataPacket[]>(`SELECT * FROM ticket_approvals WHERE ticket_id = ? ORDER BY approval_time ASC`, [id]);
    res.json({ code: 200, msg: 'success', data: { ...mainRows[0], statusText: statusTextMap[String((mainRows[0] as any).status)] || (mainRows[0] as any).status, extension: extRows[0] || {}, signatures: signRows, approvals: approvalRows } });
  } catch (error) { next(error); }
};

export const createConfinedSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { projectName, workLocation, workContent, startTime, endTime, spaceName, spaceType, oxygenContent, toxicContent, ventilationMethod, powerIsolation, safetyMeasures } = req.body;
    const userId = (req as any).user?.userId;
    const canWork = await checkCanWork(userId, 'confined_space');
    if (!canWork.allowed) return res.status(403).json({ code: 403, msg: canWork.reason });
    const conn = await getConnection();
    await conn.beginTransaction();
    try {
      const ticketNo = `${prefix}${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`;
      const [mainResult] = await conn.execute<OkPacket>(`INSERT INTO work_permits (ticket_no, ticket_type, project_name, work_location, work_content, status, applicant_id, apply_time, start_time, end_time, safety_measures, current_node, created_at, updated_at) VALUES (?, ?, ?, ?, ?, '1', ?, NOW(), ?, ?, ?, 0, NOW(), NOW())`, [ticketNo, ticketType, projectName, workLocation, workContent, userId, startTime||null, endTime||null, safetyMeasures?JSON.stringify(safetyMeasures):null]);
      const ticketId = mainResult.insertId;
      await conn.execute(`INSERT INTO ${extTable} (permit_id, space_name, space_type, oxygen_content, toxic_content, ventilation_method, power_isolation, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [ticketId, spaceName, spaceType, oxygenContent, toxicContent, ventilationMethod, powerIsolation?1:0]);
      await conn.commit();
      await recordTrace({entity_type:'work_ticket',entity_id:ticketId,entity_no:ticketNo,action:'create',action_label:'创建受限空间作业',operator_id:userId,operator_name:(req as any).user?.realName||'',snapshot_after:{status:'1',ticketNo,projectName,spaceType}});
      res.status(201).json({ code: 200, msg: 'success', data: { id: ticketId, ticketNo } });
    } catch (err) { await conn.rollback(); throw err; }
  } catch (error) { next(error); }
};

export const updateConfinedSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; const { projectName, workLocation, workContent, startTime, endTime, spaceName, spaceType, oxygenContent, toxicContent, ventilationMethod, powerIsolation, safetyMeasures } = req.body;
    const userId = (req as any).user?.userId; const conn = await getConnection();
    const [checkRows] = await conn.execute<RowDataPacket[]>('SELECT status, applicant_id FROM work_permits WHERE id = ?', [id]);
    if (!checkRows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const check = checkRows[0] as any;
    if (check.status !== '1' && check.status !== 'draft') return res.status(400).json({ code: 400, msg: '只有草稿状态可以修改' });
    if (check.applicant_id !== userId) return res.status(403).json({ code: 403, msg: '无权限修改' });
    await conn.beginTransaction();
    try {
      await conn.execute(`UPDATE work_permits SET project_name=?, work_location=?, work_content=?, start_time=?, end_time=?, safety_measures=?, updated_at=NOW() WHERE id=?`, [projectName, workLocation, workContent, startTime, endTime, safetyMeasures?JSON.stringify(safetyMeasures):null, id]);
      await conn.execute(`UPDATE ${extTable} SET space_name=?, space_type=?, oxygen_content=?, toxic_content=?, ventilation_method=?, power_isolation=?, updated_at=NOW() WHERE permit_id=?`, [spaceName, spaceType, oxygenContent, toxicContent, ventilationMethod, powerIsolation?1:0, id]);
      await conn.commit(); res.json({ code: 200, msg: 'success' });
    } catch (err) { await conn.rollback(); throw err; }
  } catch (error) { next(error); }
};

export const submitConfinedSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; const userId = (req as any).user?.userId; const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id,ticket_no,status,applicant_id FROM work_permits WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const ticket = rows[0] as any;
    if (ticket.status !== '1' && ticket.status !== 'draft') return res.status(400).json({ code: 400, msg: '只有草稿状态可以提交' });
    if (ticket.applicant_id !== userId) return res.status(403).json({ code: 403, msg: '只能提交自己的作业票' });
    await conn.execute("UPDATE work_permits SET status = '2', updated_at = NOW() WHERE id = ?", [id]);
    await recordTrace({entity_type:'work_ticket',entity_id:Number(id),entity_no:ticket.ticket_no,action:'submit',action_label:'提交审批',operator_id:userId,operator_name:(req as any).user?.realName||'',snapshot_before:{status:ticket.status},snapshot_after:{status:'2'}});
    res.json({ code: 200, msg: '提交成功' });
  } catch (error) { next(error); }
};

export const approveConfinedSpace = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; const { action, comment = '' } = req.body;
    const userId = (req as any).user?.userId; const userName = (req as any).user?.username || ''; const userRole = (req as any).user?.role; const conn = await getConnection();
    if (!action || !['dept','safety','final','reject'].includes(action)) return res.status(400).json({ code: 400, msg: '审批动作不正确' });
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id, ticket_no, status, current_node FROM work_permits WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '作业票不存在' });
    const ticket = rows[0] as any; let nextStatus = ticket.status; let nodeName = ''; let approvalResult = 'approve';
    if (action === 'reject') { nextStatus = '1'; nodeName = '驳回'; approvalResult = 'reject'; }
    else if (action === 'dept') { if (userRole > 4) return res.status(403).json({ code: 403, msg: '无部门审批权限' }); nextStatus = '3'; nodeName = '部门审批'; }
    else if (action === 'safety') { if (userRole > 3) return res.status(403).json({ code: 403, msg: '无安全审批权限' }); nextStatus = '4'; nodeName = '安全审批'; }
    else if (action === 'final') { if (userRole > 2) return res.status(403).json({ code: 403, msg: '无最终批准权限' }); nextStatus = '5'; nodeName = '最终批准'; }
    await conn.beginTransaction();
    try {
      await conn.execute('UPDATE work_permits SET status = ?, current_node = current_node + 1, updated_at = NOW() WHERE id = ?', [nextStatus, id]);
      await conn.execute(`INSERT INTO ticket_approvals (ticket_id, node_id, node_name, approver_id, approver_name, approval_result, approval_opinion, approval_time) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`, [id, ticket.current_node + 1, nodeName, userId, userName, approvalResult, comment]);
      await conn.commit();
      await recordTrace({entity_type:'work_ticket',entity_id:Number(id),entity_no:ticket.ticket_no,action:action==='reject'?'reject':`${action}_approve`,action_label:nodeName,operator_id:userId,operator_name:userName,snapshot_before:{status:ticket.status},snapshot_after:{status:nextStatus}});
      res.json({ code: 200, msg: action === 'reject' ? '已驳回' : '审批通过' });
    } catch (err) { await conn.rollback(); throw err; }
  } catch (error) { next(error); }
};

export { startWork, finishWork, closeWork } from '../controllers/highWorkController';
