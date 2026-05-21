import { Request, Response, NextFunction } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { asyncHandler } from '../utils/errors';

interface ConfigItem extends RowDataPacket {
  key: string; value: string; updated_at: Date;
}

export const getConfig = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  // 禁止浏览器缓存配置信息
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
  conn = await getConnection();
  const key = req.params.key;
  if (key && key !== 'undefined') {
    const [rows] = await conn.execute<ConfigItem[]>('SELECT * FROM system_settings WHERE `key` = ?', [key]);
    res.json({ success: true, data: rows[0] || null });
  } else {
    const [rows] = await conn.execute<ConfigItem[]>('SELECT * FROM system_settings ORDER BY `key`');
    res.json({ success: true, data: rows });
  }
  } finally { if (conn) conn.release(); }
});

export const updateConfig = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  try {
  conn = await getConnection();
  const key = req.params.key;
  const { value } = req.body;
  if (!key) return res.status(400).json({ success: false, message: '配置键名必填' });
  const userId = (req as any).user?.userId || 0;
  await conn.execute(
    'INSERT INTO system_settings (`key`, `value`, updated_by) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), updated_by=VALUES(updated_by), updated_at=NOW()',
    [key, value || '', userId]
  );
  res.json({ success: true, message: '配置更新成功' });
  } finally { if (conn) conn.release(); }
});

/**
 * 批量保存系统配置（用事务保证原子性）
 * POST /api/config/batch
 * Body: { entries: [{ key: '...', value: '...' }, ...] }
 */
export const batchUpdateConfig = asyncHandler(async (req: Request, res: Response) => {
  let conn;
  const { entries } = req.body;
  if (!Array.isArray(entries) || entries.length === 0) {
    return res.status(400).json({ success: false, message: '配置项列表不能为空' });
  }
  const userId = (req as any).user?.userId || 0;
  try {
  conn = await getConnection();
  await conn.beginTransaction();
  try {
    for (const entry of entries) {
      if (!entry.key) continue;
      await conn.execute(
        'INSERT INTO system_settings (`key`, `value`, updated_by) VALUES (?,?,?) ON DUPLICATE KEY UPDATE `value`=VALUES(`value`), updated_by=VALUES(updated_by), updated_at=NOW()',
        [entry.key, String(entry.value ?? ''), userId]
      );
    }
    await conn.commit();
    res.json({ success: true, message: '所有配置保存成功' });
  } catch (error) {
    await conn.rollback();
    console.error('批量配置保存失败:', error);
    res.status(500).json({ success: false, message: '配置保存失败，已回滚' });
  }
  } finally { if (conn) conn.release(); }
});
