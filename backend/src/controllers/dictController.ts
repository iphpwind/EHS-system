import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

/**
 * 获取字典类型列表
 */
export const getDictTypeList = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { page = 1, pageSize = 10, keyword } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const params: any[] = [];
  let where = 'WHERE 1=1';

  if (keyword) {
    where += ' AND (dict_name LIKE ? OR dict_code LIKE ?)';
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT * FROM sys_dict_type ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const [countResult] = await conn.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM sys_dict_type ${where}`,
    params
  );

  res.json({
    code: 200,
    msg: 'success',
    data: rows,
    total: countResult[0].total
  });
});

/**
 * 获取字典类型详情
 */
export const getDictTypeById = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT * FROM sys_dict_type WHERE id = ?',
    [req.params.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ code: 404, msg: '字典类型不存在' });
  }
  res.json({ code: 200, msg: 'success', data: rows[0] });
});

/**
 * 创建字典类型
 */
export const createDictType = asyncHandler(async (req: Request, res: Response) => {
  const { dictName, dictCode, remark, status = 1 } = req.body;
  if (!dictName || !dictCode) {
    return res.status(400).json({ code: 400, msg: '字典名称和编码不能为空' });
  }
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO sys_dict_type (dict_name, dict_code, remark, status) VALUES (?, ?, ?, ?)',
    [dictName, dictCode, remark || '', status]
  );
  res.json({ code: 200, msg: '创建成功', data: { id: result.insertId } });
});

/**
 * 更新字典类型
 */
export const updateDictType = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dictName, dictCode, remark, status } = req.body;
  const conn = await getConnection();
  const fields: string[] = [];
  const params: any[] = [];

  if (dictName !== undefined) { fields.push('dict_name = ?'); params.push(dictName); }
  if (dictCode !== undefined) { fields.push('dict_code = ?'); params.push(dictCode); }
  if (remark !== undefined) { fields.push('remark = ?'); params.push(remark); }
  if (status !== undefined) { fields.push('status = ?'); params.push(status); }

  if (fields.length === 0) {
    return res.status(400).json({ code: 400, msg: '没有要更新的字段' });
  }
  params.push(id);
  await conn.execute(`UPDATE sys_dict_type SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
  res.json({ code: 200, msg: '更新成功' });
});

/**
 * 删除字典类型
 */
export const deleteDictType = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM sys_dict_data WHERE dict_code = (SELECT dict_code FROM sys_dict_type WHERE id = ?)', [req.params.id]);
  await conn.execute('DELETE FROM sys_dict_type WHERE id = ?', [req.params.id]);
  res.json({ code: 200, msg: '删除成功' });
});

/**
 * 获取字典数据列表（按类型编码）
 */
export const getDictDataByType = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { dictType } = req.params;
  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT * FROM sys_dict_data WHERE dict_code = ? AND status = 1 ORDER BY dict_sort ASC',
    [dictType]
  );
  res.json({ code: 200, msg: 'success', data: rows });
});

/**
 * 获取字典数据列表（分页）
 */
export const getDictDataList = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  const { page = 1, pageSize = 10, dictCode, keyword } = req.query;
  const offset = (Number(page) - 1) * Number(pageSize);
  const where: string[] = [];
  const params: any[] = [];

  if (dictCode) {
    where.push('dict_code = ?');
    params.push(dictCode);
  }
  if (keyword) {
    where.push('(dict_label LIKE ? OR dict_value LIKE ?)');
    params.push(`%${keyword}%`, `%${keyword}%`);
  }

  const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT * FROM sys_dict_data ${whereClause} ORDER BY dict_code ASC, dict_sort ASC LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  const [countResult] = await conn.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM sys_dict_data ${whereClause}`,
    params
  );

  res.json({
    code: 200,
    msg: 'success',
    data: rows,
    total: countResult[0].total
  });
});

/**
 * 创建字典数据
 */
export const createDictData = asyncHandler(async (req: Request, res: Response) => {
  const { dictCode, dictLabel, dictValue, dictSort = 0, cssClass = '', remark = '', status = 1 } = req.body;
  if (!dictCode || !dictLabel || !dictValue) {
    return res.status(400).json({ code: 400, msg: '字典编码、标签和值不能为空' });
  }
  const conn = await getConnection();
  const [result] = await conn.execute<ResultSetHeader>(
    'INSERT INTO sys_dict_data (dict_code, dict_label, dict_value, dict_sort, css_class, remark, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [dictCode, dictLabel, dictValue, dictSort, cssClass, remark, status]
  );
  res.json({ code: 200, msg: '创建成功', data: { id: result.insertId } });
});

/**
 * 更新字典数据
 */
export const updateDictData = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { dictCode, dictLabel, dictValue, dictSort, cssClass, remark, status } = req.body;
  const conn = await getConnection();
  const fields: string[] = [];
  const params: any[] = [];

  if (dictCode !== undefined) { fields.push('dict_code = ?'); params.push(dictCode); }
  if (dictLabel !== undefined) { fields.push('dict_label = ?'); params.push(dictLabel); }
  if (dictValue !== undefined) { fields.push('dict_value = ?'); params.push(dictValue); }
  if (dictSort !== undefined) { fields.push('dict_sort = ?'); params.push(dictSort); }
  if (cssClass !== undefined) { fields.push('css_class = ?'); params.push(cssClass); }
  if (remark !== undefined) { fields.push('remark = ?'); params.push(remark); }
  if (status !== undefined) { fields.push('status = ?'); params.push(status); }

  if (fields.length === 0) {
    return res.status(400).json({ code: 400, msg: '没有要更新的字段' });
  }
  params.push(id);
  await conn.execute(`UPDATE sys_dict_data SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`, params);
  res.json({ code: 200, msg: '更新成功' });
});

/**
 * 删除字典数据
 */
export const deleteDictData = asyncHandler(async (req: Request, res: Response) => {
  const conn = await getConnection();
  await conn.execute('DELETE FROM sys_dict_data WHERE id = ?', [req.params.id]);
  res.json({ code: 200, msg: '删除成功' });
});
