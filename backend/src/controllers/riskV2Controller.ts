import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

interface MatrixItem {
  l: number;
  e: number;
  c: number;
  d: number;
  level: number;
  color: string;
  label: string;
  count: number;
  riskIds: string[];
}

/**
 * 风险分级管控可视化 API (P2-2)
 * 基于 LEC 法（L-发生可能性, E-暴露频率, C-后果严重性）
 * 风险值 D = L × E × C
 * 
 * 风险等级：
 * D ≥ 400: 重大风险（红）
 * 200 ≤ D < 400: 较大风险（橙）
 * 70 ≤ D < 200: 一般风险（黄）
 * D < 70: 低风险（蓝）
 */

// ============ 风险点管理 ============

/**
 * 获取风险点列表
 */
export const getRiskPoints = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { page = 1, pageSize = 20, level, keyword, department_id, type } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);
    
    let where = 'WHERE p.status = 1';
    const params: any[] = [];
    
    if (level) {
      where += ' AND p.risk_level = ?';
      params.push(level);
    }
    
    if (keyword) {
      where += ' AND (p.name LIKE ? OR p.code LIKE ? OR p.location LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }
    
    if (department_id) {
      where += ' AND p.department_id = ?';
      params.push(department_id);
    }
    
    if (type) {
      where += ' AND p.type = ?';
      params.push(type);
    }
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT p.*, d.name as dept_name, u.real_name as responsible_name
       FROM risk_points p
       LEFT JOIN departments d ON p.department_id = d.id
       LEFT JOIN users u ON p.responsible_person = u.id
       ${where}
       ORDER BY p.d_value DESC, p.risk_level ASC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );
    
    const [countResult] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM risk_points p ' + where,
      params
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows,
      total: countResult[0].total,
      page: Number(page),
      limit: Number(pageSize)
    });
  } catch (error: any) {
    console.error('获取风险点列表失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取风险点详情
 */
export const getRiskPointById = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT p.*, d.name as dept_name, u.real_name as responsible_name
       FROM risk_points p
       LEFT JOIN departments d ON p.department_id = d.id
       LEFT JOIN users u ON p.responsible_person = u.id
       WHERE p.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '风险点不存在' });
    }
    
    // 获取该风险点相关的隐患
    const [hazardRows] = await conn.execute<RowDataPacket[]>(
      `SELECT h.*, u.real_name as discoverer_name
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       WHERE h.location LIKE ? AND h.status < 4
       ORDER BY h.created_at DESC
       LIMIT 10`,
      [`%${rows[0].location}%`]
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        ...rows[0],
        relatedHazards: hazardRows
      }
    });
  } catch (error: any) {
    console.error('获取风险点详情失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 创建风险点
 */
export const createRiskPoint = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const {
      code, name, location, department_id, type, activity,
      hazard_desc, possible_accident,
      l_value, e_value, c_value, risk_level, d_value,
      control_measures, responsible_person, emergency_measures
    } = req.body;
    
    if (!code || !name) {
      return res.status(400).json({ code: 400, msg: '编号和名称必填' });
    }
    
    // 计算风险值
    const d = Number(l_value || 1) * Number(e_value || 1) * Number(c_value || 1);
    
    // 自动计算风险等级
    let level = risk_level;
    if (!level) {
      if (d >= 400) level = 1;       // 重大风险
      else if (d >= 200) level = 2; // 较大风险
      else if (d >= 70) level = 3;   // 一般风险
      else level = 4;                // 低风险
    }
    
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO risk_points 
       (code, name, location, department_id, type, activity, hazard_desc, possible_accident,
        l_value, e_value, c_value, d_value, risk_level, control_measures, responsible_person, emergency_measures, status, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
      [code, name, location || null, department_id || null, type || null, activity || null,
       hazard_desc || null, possible_accident || null,
       l_value || 1, e_value || 1, c_value || 1, d, level,
       control_measures || null, responsible_person || null, emergency_measures || null,
       req.userId]
    );
    
    res.status(201).json({
      code: 200,
      msg: '风险点创建成功',
      data: { id: result.insertId, d_value: d, risk_level: level }
    });
  } catch (error: any) {
    console.error('创建风险点失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 更新风险点
 */
export const updateRiskPoint = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const {
      name, location, type, activity, hazard_desc, possible_accident,
      l_value, e_value, c_value, control_measures, responsible_person, emergency_measures,
      risk_level, status
    } = req.body;
    
    const fields: string[] = ['updated_at = NOW()'];
    const params: any[] = [];
    
    if (name !== undefined) { fields.push('name = ?'); params.push(name); }
    if (location !== undefined) { fields.push('location = ?'); params.push(location); }
    if (type !== undefined) { fields.push('type = ?'); params.push(type); }
    if (activity !== undefined) { fields.push('activity = ?'); params.push(activity); }
    if (hazard_desc !== undefined) { fields.push('hazard_desc = ?'); params.push(hazard_desc); }
    if (possible_accident !== undefined) { fields.push('possible_accident = ?'); params.push(possible_accident); }
    if (l_value !== undefined) { fields.push('l_value = ?'); params.push(l_value); }
    if (e_value !== undefined) { fields.push('e_value = ?'); params.push(e_value); }
    if (c_value !== undefined) { fields.push('c_value = ?'); params.push(c_value); }
    if (control_measures !== undefined) { fields.push('control_measures = ?'); params.push(control_measures); }
    if (responsible_person !== undefined) { fields.push('responsible_person = ?'); params.push(responsible_person); }
    if (emergency_measures !== undefined) { fields.push('emergency_measures = ?'); params.push(emergency_measures); }
    if (risk_level !== undefined) { fields.push('risk_level = ?'); params.push(risk_level); }
    if (status !== undefined) { fields.push('status = ?'); params.push(status); }
    
    // 如果更新了LEC值，重新计算D值和风险等级
    if (l_value !== undefined || e_value !== undefined || c_value !== undefined) {
      const d = Number(l_value || 1) * Number(e_value || 1) * Number(c_value || 1);
      fields.push('d_value = ?');
      params.push(d);
      
      // 自动更新风险等级
      let level = risk_level;
      if (!level) {
        if (d >= 400) level = 1;
        else if (d >= 200) level = 2;
        else if (d >= 70) level = 3;
        else level = 4;
      }
      fields.push('risk_level = ?');
      params.push(level);
    }
    
    params.push(id);
    
    await conn.execute(
      `UPDATE risk_points SET ${fields.join(', ')} WHERE id = ?`,
      params
    );
    
    res.json({ code: 200, msg: '风险点已更新' });
  } catch (error: any) {
    console.error('更新风险点失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 删除风险点
 */
export const deleteRiskPoint = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    
    // 软删除
    await conn.execute(
      'UPDATE risk_points SET status = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );
    
    res.json({ code: 200, msg: '风险点已删除' });
  } catch (error: any) {
    console.error('删除风险点失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// ============ 风险统计与可视化 ============

/**
 * 获取风险统计概览
 */
export const getRiskStats = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // 风险等级分布
    const [levelStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         risk_level,
         COUNT(*) as count
       FROM risk_points 
       WHERE status = 1 
       GROUP BY risk_level`
    );
    
    // 风险类型分布
    const [typeStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         type,
         COUNT(*) as count
       FROM risk_points 
       WHERE status = 1 AND type IS NOT NULL
       GROUP BY type
       ORDER BY count DESC`
    );
    
    // 部门风险分布
    const [deptStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         d.name as department,
         COUNT(*) as total,
         SUM(CASE WHEN p.risk_level = 1 THEN 1 ELSE 0 END) as major,
         SUM(CASE WHEN p.risk_level = 2 THEN 1 ELSE 0 END) as serious,
         SUM(CASE WHEN p.risk_level = 3 THEN 1 ELSE 0 END) as general,
         SUM(CASE WHEN p.risk_level = 4 THEN 1 ELSE 0 END) as low
       FROM risk_points p
       LEFT JOIN departments d ON p.department_id = d.id
       WHERE p.status = 1
       GROUP BY p.department_id, d.name
       ORDER BY major DESC, serious DESC, total DESC`
    );
    
    // 总体统计
    const [totalStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN risk_level = 1 THEN 1 ELSE 0 END) as major,
         SUM(CASE WHEN risk_level = 2 THEN 1 ELSE 0 END) as serious,
         SUM(CASE WHEN risk_level = 3 THEN 1 ELSE 0 END) as general,
         SUM(CASE WHEN risk_level = 4 THEN 1 ELSE 0 END) as low
       FROM risk_points WHERE status = 1`
    );
    
    // 风险矩阵数据
    const [matrixData] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         l_value,
         e_value,
         c_value,
         COUNT(*) as count
       FROM risk_points 
       WHERE status = 1
       GROUP BY l_value, e_value, c_value`
    );
    
    // 近6个月趋势
    const [trendData] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         COUNT(*) as total,
         SUM(CASE WHEN risk_level = 1 THEN 1 ELSE 0 END) as major,
         SUM(CASE WHEN risk_level = 2 THEN 1 ELSE 0 END) as serious
       FROM risk_points
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month`
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        levelStats: formatLevelStats(levelStats),
        typeStats,
        deptStats,
        total: totalStats[0],
        matrixData: formatMatrixData(matrixData),
        trendData
      }
    });
  } catch (error: any) {
    console.error('获取风险统计失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取风险分布（按部门/区域）
 */
export const getRiskDistribution = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { group_by = 'department' } = req.query;
    
    let groupField = 'd.name';
    let tableJoin = 'LEFT JOIN departments d ON p.department_id = d.id';
    
    if (group_by === 'type') {
      groupField = 'p.type';
      tableJoin = '';
    } else if (group_by === 'location') {
      groupField = 'p.location';
      tableJoin = '';
    }
    
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         ${groupField} as name,
         COUNT(*) as total,
         SUM(CASE WHEN p.risk_level = 1 THEN 1 ELSE 0 END) as major,
         SUM(CASE WHEN p.risk_level = 2 THEN 1 ELSE 0 END) as serious,
         SUM(CASE WHEN p.risk_level = 3 THEN 1 ELSE 0 END) as general,
         SUM(CASE WHEN p.risk_level = 4 THEN 1 ELSE 0 END) as low,
         ROUND(AVG(p.d_value), 2) as avg_d_value
       FROM risk_points p
       ${tableJoin}
       WHERE p.status = 1
       GROUP BY ${groupField}
       ORDER BY total DESC`
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows.map((r: any) => ({
        ...r,
        name: r.name || '未分类'
      }))
    });
  } catch (error: any) {
    console.error('获取风险分布失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取风险矩阵（LEC法可视化）
 */
export const getRiskMatrix = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // LEC 矩阵数据
    const [matrixData] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         l_value, e_value, c_value,
         COUNT(*) as count,
         GROUP_CONCAT(id) as risk_ids
       FROM risk_points 
       WHERE status = 1
       GROUP BY l_value, e_value, c_value`
    );
    
    // 生成 5x5x5 矩阵
    const matrix: MatrixItem[] = [];
    for (let l = 1; l <= 5; l++) {
      for (let e = 1; e <= 5; e++) {
        for (let c = 1; c <= 5; c++) {
          const d = l * e * c;
          let level, color, label;
          
          if (d >= 400) { level = 1; color = '#ef4444'; label = '重大风险'; }
          else if (d >= 200) { level = 2; color = '#f97316'; label = '较大风险'; }
          else if (d >= 70) { level = 3; color = '#eab308'; label = '一般风险'; }
          else { level = 4; color = '#3b82f6'; label = '低风险'; }
          
          matrix.push({
            l, e, c, d, level, color, label,
            count: 0,
            riskIds: []
          });
        }
      }
    }
    
    // 填充矩阵数据
    matrixData.forEach((m: any) => {
      const idx = matrix.findIndex(x => x.l === m.l_value && x.e === m.e_value && x.c === m.c_value);
      if (idx !== -1) {
        matrix[idx].count = m.count;
        matrix[idx].riskIds = m.risk_ids ? m.risk_ids.split(',') : [];
      }
    });
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        matrix,
        legend: [
          { level: 1, label: '重大风险 (D≥400)', color: '#ef4444' },
          { level: 2, label: '较大风险 (200≤D<400)', color: '#f97316' },
          { level: 3, label: '一般风险 (70≤D<200)', color: '#eab308' },
          { level: 4, label: '低风险 (D<70)', color: '#3b82f6' }
        ]
      }
    });
  } catch (error: any) {
    console.error('获取风险矩阵失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取重大风险清单
 */
export const getMajorRisks = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    
    // 获取所有重大风险和较大风险
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT p.*, d.name as dept_name, u.real_name as responsible_name
       FROM risk_points p
       LEFT JOIN departments d ON p.department_id = d.id
       LEFT JOIN users u ON p.responsible_person = u.id
       WHERE p.status = 1 AND p.risk_level IN (1, 2)
       ORDER BY p.d_value DESC, p.risk_level ASC`
    );
    
    // 统计重大风险管控措施
    const [controlStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) as total,
         SUM(CASE WHEN control_measures IS NOT NULL AND control_measures != '' THEN 1 ELSE 0 END) as has_controls,
         SUM(CASE WHEN emergency_measures IS NOT NULL AND emergency_measures != '' THEN 1 ELSE 0 END) as has_emergency
       FROM risk_points
       WHERE status = 1 AND risk_level IN (1, 2)`
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: {
        list: rows,
        stats: controlStats[0]
      }
    });
  } catch (error: any) {
    console.error('获取重大风险清单失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// ============ 辅助函数 ============

function formatLevelStats(stats: any[]) {
  const levelMap: { [key: number]: any } = {
    1: { label: '重大风险', color: '#ef4444', name: '红' },
    2: { label: '较大风险', color: '#f97316', name: '橙' },
    3: { label: '一般风险', color: '#eab308', name: '黄' },
    4: { label: '低风险', color: '#3b82f6', name: '蓝' }
  };
  
  return stats.map(s => ({
    level: s.risk_level,
    ...levelMap[s.risk_level] || { label: '未知', color: '#94a3b8', name: '-' },
    count: s.count
  }));
}

function formatMatrixData(data: any[]) {
  return data.map(d => ({
    l: d.l_value,
    e: d.e_value,
    c: d.c_value,
    d: d.l_value * d.e_value * d.c_value,
    count: d.count
  }));
}
