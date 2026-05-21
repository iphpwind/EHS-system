import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { getConnection } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../utils/errors';

/**
 * 隐患闭环管理状态机
 * Status 1: 待整改 (Pending) - 隐患待处理
 * Status 2: 整改中 (Rectifying) - 正在整改
 * Status 3: 待验收 (Pending Verification) - 整改完成，待验收
 * Status 4: 已完成 (Completed) - 验收通过，隐患消除
 * Status 5: 已关闭 (Closed) - 手动关闭（无需整改或其他原因）
 */

// ============ 隐患列表 ============
export const getHazardList = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { 
      page = 1, 
      pageSize = 20, 
      level, 
      status, 
      department,
      keyword, 
      startDate, 
      endDate,
      isOverdue
    } = req.query;
    
    const offset = (Number(page) - 1) * Number(pageSize);
    const where: string[] = [];
    const params: any[] = [];

    if (level) {
      where.push('h.hazard_level = ?');
      params.push(level);
    }
    
    if (status !== undefined && status !== '') {
      where.push('h.status = ?');
      params.push(Number(status));
    }
    
    if (department) {
      where.push('h.department = ?');
      params.push(department);
    }
    
    if (keyword) {
      where.push('h.hazard_description LIKE ?');
      params.push(`%${keyword}%`);
    }
    
    if (startDate) {
      where.push('h.discovery_time >= ?');
      params.push(startDate);
    }
    
    if (endDate) {
      where.push('h.discovery_time <= ?');
      params.push(endDate + ' 23:59:59');
    }
    
    // 逾期筛选
    if (isOverdue !== undefined && isOverdue !== '') {
      where.push('h.is_overdue = ?');
      params.push(Number(isOverdue));
    }

    const whereClause = where.length > 0 ? 'WHERE ' + where.join(' AND ') : '';

    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT h.*, 
              u.real_name AS discoverer_name,
              d.dept_name AS department_name
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       LEFT JOIN departments d ON h.department = d.dept_name
       ${whereClause}
       ORDER BY 
         h.is_overdue DESC,
         CASE h.hazard_level WHEN 'major' THEN 1 WHEN 'serious' THEN 2 WHEN 'general' THEN 3 ELSE 4 END,
         h.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(pageSize), offset]
    );

    const [countResult] = await conn.execute<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM hazard_inspection h ' + whereClause,
      params
    );

    // 更新逾期状态
    await conn.execute(
      `UPDATE hazard_inspection 
       SET is_overdue = 1, overdue_days = DATEDIFF(CURDATE(), rectification_deadline)
       WHERE status IN (1, 2, 3) 
         AND rectification_deadline < CURDATE() 
         AND rectification_deadline IS NOT NULL
         AND is_overdue = 0`
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
    console.error('获取隐患列表失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 隐患详情 ============
export const getHazardById = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT h.*, 
              u.real_name AS discoverer_name,
              uv.real_name AS verifier_name,
              rc.real_name AS rechecker_name,
              cb.real_name AS closed_by_name
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       LEFT JOIN users uv ON h.verifier_id = uv.id
       LEFT JOIN users rc ON h.rechecker_id = rc.id
       LEFT JOIN users cb ON h.closed_by = cb.id
       WHERE h.id = ?`,
      [req.params.id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    res.json({ code: 200, msg: 'success', data: rows[0] });
  } catch (error: any) {
    console.error('获取隐患详情失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 新增隐患 ============
export const createHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { 
      hazard_description, 
      hazard_level, 
      location, 
      department, 
      rectification_deadline, 
      rectification_responsible,
      photos_before
    } = req.body;

    if (!hazard_description) {
      return res.status(400).json({ code: 400, msg: '隐患描述不能为空' });
    }

    const inspection_no = 'HZ-' + Date.now();
    
    const [result] = await conn.execute<ResultSetHeader>(
      `INSERT INTO hazard_inspection 
       (inspection_no, hazard_description, hazard_level, location, department, 
        discoverer_id, rectification_deadline, rectification_responsible, 
        photos_before, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [inspection_no, hazard_description, hazard_level || 'general', location, department,
       req.userId, rectification_deadline || null, rectification_responsible || null,
       photos_before ? JSON.stringify(photos_before) : null]
    );

    res.status(201).json({ 
      code: 200, 
      msg: '隐患登记成功', 
      data: { id: result.insertId, inspection_no } 
    });
  } catch (error: any) {
    console.error('新增隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 更新隐患 ============
export const updateHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { 
      hazard_description, 
      hazard_level, 
      location, 
      department, 
      rectification_deadline, 
      rectification_responsible,
      photos_before,
      photos_after
    } = req.body;

    const fields: string[] = [];
    const params: any[] = [];

    if (hazard_description !== undefined) { fields.push('hazard_description = ?'); params.push(hazard_description); }
    if (hazard_level !== undefined) { fields.push('hazard_level = ?'); params.push(hazard_level); }
    if (location !== undefined) { fields.push('location = ?'); params.push(location); }
    if (department !== undefined) { fields.push('department = ?'); params.push(department); }
    if (rectification_deadline !== undefined) { fields.push('rectification_deadline = ?'); params.push(rectification_deadline); }
    if (rectification_responsible !== undefined) { fields.push('rectification_responsible = ?'); params.push(rectification_responsible); }
    if (photos_before !== undefined) { fields.push('photos_before = ?'); params.push(JSON.stringify(photos_before)); }
    if (photos_after !== undefined) { fields.push('photos_after = ?'); params.push(JSON.stringify(photos_after)); }

    if (fields.length === 0) {
      return res.status(400).json({ code: 400, msg: '没有要更新的字段' });
    }

    fields.push('updated_at = NOW()');
    params.push(id);

    await conn.execute(
      `UPDATE hazard_inspection SET ${fields.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ code: 200, msg: '隐患记录已更新' });
  } catch (error: any) {
    console.error('更新隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 删除隐患 ============
export const deleteHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    
    // 检查隐患状态，只有待整改(1)状态可以删除
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 1) {
      return res.status(400).json({ code: 400, msg: '只有待整改状态的隐患才能删除' });
    }
    
    await conn.execute('DELETE FROM hazard_inspection WHERE id = ?', [id]);
    res.json({ code: 200, msg: '隐患记录已删除' });
  } catch (error: any) {
    console.error('删除隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 提交整改（状态 1→2）============
export const submitRectification = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { rectification_measure, rectification_deadline, rectification_responsible } = req.body;

    // 验证当前状态必须是待整改(1)
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 1) {
      return res.status(400).json({ 
        code: 400, 
        msg: `当前状态为${getStatusText(rows[0].status)}，无法提交整改` 
      });
    }

    await conn.execute(
      `UPDATE hazard_inspection 
       SET status = 2, 
           rectification_measure = ?, 
           rectification_deadline = ?, 
           rectification_responsible = ?,
           rectification_time = NOW(),
           updated_at = NOW()
       WHERE id = ?`,
      [rectification_measure || null, rectification_deadline || null, rectification_responsible || null, id]
    );

    res.json({ code: 200, msg: '整改方案已提交' });
  } catch (error: any) {
    console.error('提交整改失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 完成整改（状态 2→3）============
export const completeRectification = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { rectification_result, photos_after } = req.body;

    // 验证当前状态必须是整改中(2)
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 2) {
      return res.status(400).json({ 
        code: 400, 
        msg: `当前状态为${getStatusText(rows[0].status)}，无法完成整改` 
      });
    }

    await conn.execute(
      `UPDATE hazard_inspection 
       SET status = 3, 
           rectification_result = ?,
           photos_after = ?,
           updated_at = NOW()
       WHERE id = ?`,
      [rectification_result || null, photos_after ? JSON.stringify(photos_after) : null, id]
    );

    res.json({ code: 200, msg: '整改已完成，等待验收' });
  } catch (error: any) {
    console.error('完成整改失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 验收隐患（状态 3→4）============
export const acceptHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { verification_result, verifier_comments } = req.body;

    // 验证当前状态必须是待验收(3)
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 3) {
      return res.status(400).json({ 
        code: 400, 
        msg: `当前状态为${getStatusText(rows[0].status)}，无法验收` 
      });
    }

    // verification_result: 1-合格, 2-不合格需继续整改
    if (verification_result === 1) {
      await conn.execute(
        `UPDATE hazard_inspection 
         SET status = 4, 
             verification_result = 1,
             verifier_id = ?,
             verifier_comments = ?,
             verification_time = NOW(),
             is_overdue = 0,
             updated_at = NOW()
         WHERE id = ?`,
        [req.userId, verifier_comments || null, id]
      );
      res.json({ code: 200, msg: '隐患验收通过，已完成整改' });
    } else {
      // 验收不合格，退回整改
      await conn.execute(
        `UPDATE hazard_inspection 
         SET status = 2, 
             verification_result = 2,
             verifier_id = ?,
             verifier_comments = ?,
             verification_time = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [req.userId, verifier_comments || '验收不合格，需继续整改', id]
      );
      res.json({ code: 200, msg: '验收不合格，已退回整改' });
    }
  } catch (error: any) {
    console.error('验收隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 复查隐患（状态 4→2）============
export const recheckHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { recheck_result, recheck_comments } = req.body;

    // 验证当前状态必须是已完成(4)
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 4) {
      return res.status(400).json({ 
        code: 400, 
        msg: `当前状态为${getStatusText(rows[0].status)}，无法复查` 
      });
    }

    // recheck_result: 1-合格, 2-不合格需继续整改
    if (recheck_result === 1) {
      res.json({ code: 200, msg: '复查合格，隐患已消除' });
    } else {
      // 复查不合格，重新整改
      await conn.execute(
        `UPDATE hazard_inspection 
         SET status = 2, 
             recheck_result = 2,
             rechecker_id = ?,
             recheck_comments = ?,
             recheck_time = NOW(),
             updated_at = NOW()
         WHERE id = ?`,
        [req.userId, recheck_comments || '复查不合格，需继续整改', id]
      );
      res.json({ code: 200, msg: '复查不合格，已重新提交整改' });
    }
  } catch (error: any) {
    console.error('复查隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 关闭隐患（手动关闭，无需整改）============
export const closeHazard = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const { closure_reason } = req.body;

    // 验证当前状态必须是待整改(1)
    const [rows] = await conn.execute<RowDataPacket[]>(
      'SELECT status FROM hazard_inspection WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ code: 404, msg: '隐患记录不存在' });
    }
    
    if (rows[0].status !== 1) {
      return res.status(400).json({ 
        code: 400, 
        msg: `当前状态为${getStatusText(rows[0].status)}，无法关闭` 
      });
    }

    await conn.execute(
      `UPDATE hazard_inspection 
       SET status = 5, 
           closure_comments = ?,
           closed_by = ?,
           closed_at = NOW(),
           is_overdue = 0,
           updated_at = NOW()
       WHERE id = ?`,
      [closure_reason || '手动关闭', req.userId, id]
    );

    res.json({ code: 200, msg: '隐患已关闭' });
  } catch (error: any) {
    console.error('关闭隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 获取隐患统计 ============
export const getHazardStats = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         COUNT(*) AS total,
         SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS pending,
         SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END) AS rectifying,
         SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END) AS pending_verify,
         SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END) AS completed,
         SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END) AS closed,
         SUM(CASE WHEN hazard_level = 'major' AND status < 4 THEN 1 ELSE 0 END) AS major_pending,
         SUM(CASE WHEN is_overdue = 1 AND status IN (1, 2, 3) THEN 1 ELSE 0 END) AS overdue,
         SUM(CASE WHEN hazard_level = 'serious' AND status < 4 THEN 1 ELSE 0 END) AS serious_pending
       FROM hazard_inspection`
    );

    const [trendData] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') AS month,
         COUNT(*) AS count
       FROM hazard_inspection
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month`
    );

    const [levelStats] = await conn.execute<RowDataPacket[]>(
      `SELECT 
         hazard_level,
         COUNT(*) AS count
       FROM hazard_inspection
       WHERE status < 4
       GROUP BY hazard_level`
    );

    res.json({
      code: 200,
      msg: 'success',
      data: {
        ...rows[0],
        trend: trendData,
        levelStats: levelStats
      }
    });
  } catch (error: any) {
    console.error('获取隐患统计失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 获取逾期隐患列表 ============
export const getOverdueHazards = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT h.*, 
              u.real_name AS discoverer_name,
              DATEDIFF(CURDATE(), h.rectification_deadline) AS overdue_days
       FROM hazard_inspection h
       LEFT JOIN users u ON h.discoverer_id = u.id
       WHERE h.is_overdue = 1 
         AND h.status IN (1, 2, 3)
       ORDER BY overdue_days DESC, 
         CASE h.hazard_level WHEN 'major' THEN 1 WHEN 'serious' THEN 2 ELSE 3 END`
    );

    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error: any) {
    console.error('获取逾期隐患失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally { if (conn) conn.release(); }
};

// ============ 辅助函数 ============
function getStatusText(status: number): string {
  const statusMap: { [key: number]: string } = {
    1: '待整改',
    2: '整改中',
    3: '待验收',
    4: '已完成',
    5: '已关闭'
  };
  return statusMap[status] || '未知状态';
}