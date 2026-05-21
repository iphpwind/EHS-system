import { Router, Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket, ResultSetHeader } from 'mysql2';
import { asyncHandler } from '../utils/errors';

const router = Router();

/**
 * 获取气体监测列表（支持IoT自动上报和手动录入）
 * GET /api/gas-monitor
 * query: ticketId, locationId, source(iot/manual), startTime, endTime
 */
export const getGasMonitorList = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { ticketId, locationId, source, startTime, endTime, page = 1, pageSize = 20 } = req.query;
  try {
  conn = await getConnection();
  const offset = (Number(page) - 1) * Number(pageSize);

  let where = 'WHERE 1=1';
  const params: any[] = [];

  if (ticketId) {
    where += ' AND ticket_id = ?';
    params.push(ticketId);
  }
  if (locationId) {
    where += ' AND location_id = ?';
    params.push(locationId);
  }
  if (source) {
    where += ' AND data_source = ?';
    params.push(source);
  }
  if (startTime) {
    where += ' AND check_time >= ?';
    params.push(startTime);
  }
  if (endTime) {
    where += ' AND check_time <= ?';
    params.push(endTime);
  }

  const [countRows] = await conn.execute<RowDataPacket[]>(
    `SELECT COUNT(*) as total FROM gas_monitor ${where}`,
    params
  );

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT * FROM gas_monitor ${where} ORDER BY check_time DESC LIMIT ? OFFSET ?`,
    [...params, Number(pageSize), offset]
  );

  res.json({
    success: true,
    data: rows,
    total: countRows[0].total,
    page: Number(page),
    pageSize: Number(pageSize)
  });
  } finally { if (conn) conn.release(); }
});

/**
 * 获取最新的气体监测数据（实时监测）
 * GET /api/gas-monitor/latest
 * query: locationId - 区域ID，不传则返回所有区域最新数据
 */
export const getLatestGasData = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { locationId } = req.query;
  try {
  conn = await getConnection();

  let sql = `SELECT g.*, a.area_name, a.lel_threshold, a.toxic_threshold
    FROM (
      SELECT location_id, MAX(check_time) as max_time
      FROM gas_monitor`;
  const params: any[] = [];

  if (locationId) {
    sql += ' WHERE location_id = ?';
    params.push(locationId);
  }
  sql += ' GROUP BY location_id) latest';
  sql += ' INNER JOIN gas_monitor g ON g.location_id = latest.location_id AND g.check_time = latest.max_time';
  sql += ' LEFT JOIN monitor_areas a ON g.location_id = a.id';

  const [rows] = await conn.execute<RowDataPacket[]>(sql, params);

  const formattedRows = rows.map((row: any) => ({
    ...row,
    is_normal: row.check_result === 1,
    is_lel_warning: row.flammable_percent >= (row.lel_threshold || 50) * 0.5,
    is_lel_danger: row.flammable_percent >= (row.lel_threshold || 50),
    is_toxic_warning: row.toxic_ppm >= (row.toxic_threshold || 10) * 0.5,
    is_toxic_danger: row.toxic_ppm >= (row.toxic_threshold || 10)
  }));

  res.json({ success: true, data: formattedRows });
  } finally { if (conn) conn.release(); }
});

/**
 * IoT设备上报气体数据（自动录入）
 * POST /api/gas-monitor/iot-upload
 * 设备通过API Key认证
 */
export const iotUpload = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const {
    deviceId,
    locationId,
    oxygenPercent,
    flammablePercent,
    toxicPpm,
    toxicType,
    temperature,
    humidity,
    pressure,
    deviceCode
  } = req.body;

  if (!deviceId || !locationId) {
    return res.status(400).json({ success: false, message: '设备ID和区域ID不能为空' });
  }

  try {
  conn = await getConnection();

  const [locationRows] = await conn.execute<RowDataPacket[]>(
    'SELECT lel_threshold, toxic_threshold FROM monitor_areas WHERE id = ?',
    [locationId]
  );

  const thresholds = locationRows[0] || { lel_threshold: 50, toxic_threshold: 10 };

  const oxygenOk = oxygenPercent >= 18 && oxygenPercent <= 23;
  const lelOk = flammablePercent < thresholds.lel_threshold;
  const toxicOk = toxicPpm < thresholds.toxic_threshold;
  const checkResult = oxygenOk && lelOk && toxicOk ? 1 : 0;

  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO gas_monitor
     (ticket_id, location_id, data_source, device_id, device_code,
      oxygen_percent, flammable_percent, toxic_ppm, toxic_type,
      temperature, humidity, pressure,
      check_result, check_time, remark)
     VALUES (?, ?, 'iot', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'IoT自动监测')`,
    [null, locationId, deviceId, deviceCode || '',
     oxygenPercent, flammablePercent, toxicPpm, toxicType || '',
     temperature || null, humidity || null, pressure || null, checkResult]
  );

  res.json({
    success: true,
    data: {
      id: result.insertId,
      check_result: checkResult === 1 ? '合格' : '不合格',
      oxygen_ok: oxygenOk,
      lel_ok: lelOk,
      toxic_ok: toxicOk
    }
  });
  } finally { if (conn) conn.release(); }
});

/**
 * 手动录入气体检测记录
 * POST /api/gas-monitor/manual
 */
export const manualEntry = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const userId = (req as any).user?.userId;
  const username = (req as any).user?.username;
  const {
    ticketId,
    locationId,
    checkType = 'before',
    oxygenPercent,
    flammablePercent,
    toxicPpm,
    toxicType,
    checkLocation,
    checkerName,
    devicePhoto,
    scenePhoto,
    remark
  } = req.body;

  try {
  conn = await getConnection();

  const [locationRows] = await conn.execute<RowDataPacket[]>(
    'SELECT lel_threshold, toxic_threshold FROM monitor_areas WHERE id = ?',
    [locationId]
  );

  const thresholds = locationRows[0] || { lel_threshold: 50, toxic_threshold: 10 };

  const oxygenOk = oxygenPercent >= 18 && oxygenPercent <= 23;
  const lelOk = flammablePercent < thresholds.lel_threshold;
  const toxicOk = toxicPpm < thresholds.toxic_threshold;
  const checkResult = oxygenOk && lelOk && toxicOk ? 1 : 0;

  const [result] = await conn.execute<ResultSetHeader>(
    `INSERT INTO gas_monitor
     (ticket_id, location_id, data_source, check_type,
      oxygen_percent, flammable_percent, toxic_ppm, toxic_type,
      check_result, check_location, check_time,
      checker_id, checker_name, device_photo, scene_photo, remark)
     VALUES (?, ?, 'manual', ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)`,
    [ticketId || null, locationId || null, checkType,
     oxygenPercent, flammablePercent, toxicPpm, toxicType || '',
     checkResult, checkLocation || '', userId, checkerName || username,
     devicePhoto || '', scenePhoto || '', remark || '']
  );

  res.json({
    success: true,
    data: {
      id: result.insertId,
      check_result: checkResult === 1 ? '合格' : '不合格'
    },
    message: '气体检测记录已保存'
  });
  } finally { if (conn) conn.release(); }
});

/**
 * 更新气体检测记录
 * PUT /api/gas-monitor/:id
 */
export const updateGasRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const {
    oxygenPercent,
    flammablePercent,
    toxicPpm,
    toxicType,
    checkLocation,
    checkerName,
    devicePhoto,
    scenePhoto,
    remark
  } = req.body;

  try {
  conn = await getConnection();

  const [rows] = await conn.execute<RowDataPacket[]>(
    'SELECT location_id FROM gas_monitor WHERE id = ?',
    [id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: '记录不存在' });
  }

  const locationId = rows[0].location_id;

  const [locationRows] = await conn.execute<RowDataPacket[]>(
    'SELECT lel_threshold, toxic_threshold FROM monitor_areas WHERE id = ?',
    [locationId]
  );

  const thresholds = locationRows[0] || { lel_threshold: 50, toxic_threshold: 10 };

  const oxygenOk = oxygenPercent >= 18 && oxygenPercent <= 23;
  const lelOk = flammablePercent < thresholds.lel_threshold;
  const toxicOk = toxicPpm < thresholds.toxic_threshold;
  const checkResult = oxygenOk && lelOk && toxicOk ? 1 : 0;

  await conn.execute(
    `UPDATE gas_monitor SET
      oxygen_percent = ?, flammable_percent = ?, toxic_ppm = ?, toxic_type = ?,
      check_result = ?, check_location = ?, checker_name = ?,
      device_photo = ?, scene_photo = ?, remark = ?, updated_at = NOW()
     WHERE id = ?`,
    [oxygenPercent, flammablePercent, toxicPpm, toxicType || '',
     checkResult, checkLocation || '', checkerName || '',
     devicePhoto || '', scenePhoto || '', remark || '', id]
  );

  res.json({
    success: true,
    data: {
      check_result: checkResult === 1 ? '合格' : '不合格'
    },
    message: '气体检测记录已更新'
  });
  } finally { if (conn) conn.release(); }
});

/**
 * 删除气体检测记录
 * DELETE /api/gas-monitor/:id
 */
export const deleteGasRecord = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  try {
  conn = await getConnection();

  await conn.execute('DELETE FROM gas_monitor WHERE id = ?', [id]);
  res.json({ success: true, message: '记录已删除' });
  } finally { if (conn) conn.release(); }
});

/**
 * 获取气体检测历史趋势
 * GET /api/gas-monitor/trend
 * query: locationId, startTime, endTime
 */
export const getGasTrend = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { locationId, startTime, endTime } = req.query;

  if (!locationId) {
    return res.status(400).json({ success: false, message: '区域ID不能为空' });
  }

  try {
  conn = await getConnection();
  const params: any[] = [locationId];

  let where = 'WHERE location_id = ?';
  if (startTime) {
    where += ' AND check_time >= ?';
    params.push(startTime);
  }
  if (endTime) {
    where += ' AND check_time <= ?';
    params.push(endTime);
  }

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT check_time, oxygen_percent, flammable_percent, toxic_ppm, check_result, data_source
     FROM gas_monitor ${where}
     ORDER BY check_time ASC
     LIMIT 1000`,
    params
  );

  res.json({ success: true, data: rows });
  } finally { if (conn) conn.release(); }
});

/**
 * 获取气体监测统计
 * GET /api/gas-monitor/stats
 * query: locationId, startTime, endTime
 */
export const getGasStats = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { locationId, startTime, endTime } = req.query;
  try {
  conn = await getConnection();

  let where = 'WHERE 1=1';
  const params: any[] = [];

  if (locationId) {
    where += ' AND location_id = ?';
    params.push(locationId);
  }
  if (startTime) {
    where += ' AND check_time >= ?';
    params.push(startTime);
  }
  if (endTime) {
    where += ' AND check_time <= ?';
    params.push(endTime);
  }

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT
       COUNT(*) as total_count,
       SUM(CASE WHEN check_result = 1 THEN 1 ELSE 0 END) as pass_count,
       SUM(CASE WHEN check_result = 0 THEN 1 ELSE 0 END) as fail_count,
       AVG(oxygen_percent) as avg_oxygen,
       MAX(flammable_percent) as max_flammable,
       MAX(toxic_ppm) as max_toxic,
       COUNT(DISTINCT location_id) as location_count
     FROM gas_monitor ${where}`,
    params
  );

  res.json({ success: true, data: rows[0] });
  } finally { if (conn) conn.release(); }
});

/**
 * 关联作业票的气体检测记录
 * GET /api/gas-monitor/ticket/:ticketId
 */
export const getTicketGasRecords = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { ticketId } = req.params;
  try {
  conn = await getConnection();

  const [rows] = await conn.execute<RowDataPacket[]>(
    `SELECT * FROM gas_monitor
     WHERE ticket_id = ?
     ORDER BY check_time DESC`,
    [ticketId]
  );

  res.json({ success: true, data: rows });
  } finally { if (conn) conn.release(); }
});

/**
 * 作业票关联气体检测记录
 * POST /api/gas-monitor/:id/link-ticket
 */
export const linkTicket = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { id } = req.params;
  const { ticketId } = req.body;

  try {
  conn = await getConnection();
  await conn.execute(
    'UPDATE gas_monitor SET ticket_id = ?, updated_at = NOW() WHERE id = ?',
    [ticketId, id]
  );

  res.json({ success: true, message: '作业票关联成功' });
  } finally { if (conn) conn.release(); }
});

export default router;