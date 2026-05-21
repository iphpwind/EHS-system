import { Request, Response } from 'express';
import { query, getConnection } from '../config/database';

/**
 * 获取所有模块配置
 */
export const getModules = async (req: Request, res: Response) => {
  try {
    const rows = await query(
      'SELECT id, module_key, module_name, module_desc, enabled, icon, sort_order FROM module_config ORDER BY sort_order ASC'
    );
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({ code: 500, msg: '获取模块配置失败', data: null });
  }
};

/**
 * 更新模块启用状态
 */
export const updateModuleStatus = async (req: Request, res: Response) => {
  try {
    const { moduleKey } = req.params;
    const { enabled } = req.body;

    if (enabled === undefined || enabled === null) {
      return res.status(400).json({ code: 400, msg: '缺少enabled参数', data: null });
    }

    await query(
      'UPDATE module_config SET enabled = ? WHERE module_key = ?',
      [enabled ? 1 : 0, moduleKey]
    );

    res.json({ code: 200, msg: 'success', data: null });
  } catch (error) {
    console.error('Update module status error:', error);
    res.status(500).json({ code: 500, msg: '更新模块状态失败', data: null });
  }
};

/**
 * 批量更新模块状态
 */
export const batchUpdateModules = async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const { modules } = req.body;
    if (!Array.isArray(modules)) {
      return res.status(400).json({ code: 400, msg: 'modules必须是数组', data: null });
    }

    conn = await getConnection();
    try {
      await conn.beginTransaction();
      for (const mod of modules) {
        await conn.execute(
          'UPDATE module_config SET enabled = ? WHERE module_key = ?',
          [mod.enabled ? 1 : 0, mod.moduleKey]
        );
      }
      await conn.commit();
      res.json({ code: 200, msg: 'success', data: null });
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      if (conn) conn.release();
    }
  } catch (error) {
    console.error('Batch update modules error:', error);
    res.status(500).json({ code: 500, msg: '批量更新失败', data: null });
  }
};
