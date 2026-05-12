import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

// ==================== 作业模板 CRUD ====================

/** 查询作业证模板列表 */
export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { pageNum = 1, pageSize = 10, operationType, templateName, status } = req.query as any;
    const conn = await getConnection();

    let sql = 'SELECT * FROM operation_templates WHERE 1=1';
    const params: any[] = [];
    if (operationType) { sql += ' AND operation_type = ?'; params.push(operationType); }
    if (templateName) { sql += ' AND template_name LIKE ?'; params.push(`%${templateName}%`); }
    if (status !== undefined && status !== '') { sql += ' AND status = ?'; params.push(Number(status)); }

    const [countRows] = await conn.execute<RowDataPacket[]>('SELECT COUNT(*) as total FROM operation_templates');
    const total = countRows[0].total;

    sql += ' ORDER BY id ASC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), (Number(pageNum) - 1) * Number(pageSize));
    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);

    res.json({ code: 200, msg: 'success', rows, total });
  } catch (error) { next(error); }
};

/** 查询模板详情 */
export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT * FROM operation_templates WHERE id = ?', [Number(id)]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '模板不存在' });
    res.json({ code: 200, msg: 'success', data: rows[0] });
  } catch (error) { next(error); }
};

/** 新增模板 */
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { operationType, templateName, safetyDisclosureUserIds, approvalProcessJson, checkDicJson, status = 1 } = req.body;
    const conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO operation_templates (operation_type, template_name, safety_disclosure_user_ids, approval_process_json, check_dic_json, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [operationType, templateName, safetyDisclosureUserIds ? JSON.stringify(safetyDisclosureUserIds) : null,
       approvalProcessJson ? JSON.stringify(approvalProcessJson) : null,
       checkDicJson ? JSON.stringify(checkDicJson) : null, status]
    );
    res.status(201).json({ code: 200, msg: 'success', data: { id: result.insertId } });
  } catch (error) { next(error); }
};

/** 修改模板 */
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { operationType, templateName, safetyDisclosureUserIds, approvalProcessJson, checkDicJson, status } = req.body;
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id FROM operation_templates WHERE id = ?', [Number(id)]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '模板不存在' });
    await conn.execute(
      `UPDATE operation_templates SET operation_type=?, template_name=?, safety_disclosure_user_ids=?, approval_process_json=?, check_dic_json=?, status=?, updated_at=NOW() WHERE id=?`,
      [operationType, templateName, safetyDisclosureUserIds ? JSON.stringify(safetyDisclosureUserIds) : null,
       approvalProcessJson ? JSON.stringify(approvalProcessJson) : null,
       checkDicJson ? JSON.stringify(checkDicJson) : null, status ?? 1, Number(id)]
    );
    res.json({ code: 200, msg: 'success' });
  } catch (error) { next(error); }
};

/** 删除模板 */
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id FROM operation_templates WHERE id = ?', [Number(id)]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '模板不存在' });
    await conn.execute('DELETE FROM operation_templates WHERE id = ?', [Number(id)]);
    res.json({ code: 200, msg: 'success' });
  } catch (error) { next(error); }
};

/** 配置模板（审批流程+检查字典） */
export const configure = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, approvalProcessList, checkDicList } = req.body;
    const conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>('SELECT id FROM operation_templates WHERE id = ?', [Number(id)]);
    if (!rows.length) return res.status(404).json({ code: 404, msg: '模板不存在' });
    await conn.execute(
      'UPDATE operation_templates SET approval_process_json=?, check_dic_json=?, updated_at=NOW() WHERE id=?',
      [approvalProcessList ? JSON.stringify(approvalProcessList) : null,
       checkDicList ? JSON.stringify(checkDicList) : null, Number(id)]
    );
    res.json({ code: 200, msg: '配置成功' });
  } catch (error) { next(error); }
};
