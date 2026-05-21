import { Request, Response } from 'express';
import { getConnection } from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';

// 获取排查计划列表
export const getInspectionPlans = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { 
      plan_name, 
      plan_type, 
      status, 
      department_id,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let where = 'WHERE 1=1';
    const params: any[] = [];
    
    if (plan_name) {
      where += ' AND plan_name LIKE ?';
      params.push(`%${plan_name}%`);
    }
    
    if (plan_type) {
      where += ' AND plan_type = ?';
      params.push(plan_type);
    }
    
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }
    
    if (department_id) {
      where += ' AND department_id = ?';
      params.push(department_id);
    }
    
    // 数据权限过滤
    if (req.scope && req.scope.type !== 'all') {
      if (req.scope.type === 'dept') {
        where += ' AND department_id = ?';
        params.push(req.scope.departmentId);
      } else if (req.scope.type === 'self') {
        where += ' AND created_by = ?';
        params.push(req.userId);
      }
    }
    
    const [countRows] = await conn.execute(
      `SELECT COUNT(*) as total FROM hazard_inspection_plans ${where}`,
      params
    );
    const total = (countRows as any)[0].total;
    
    const offset = (Number(page) - 1) * Number(limit);
    const [rows] = await conn.execute(
      `SELECT p.*, 
              d.dept_name,
              u.username as creator_name
       FROM hazard_inspection_plans p
       LEFT JOIN departments d ON p.department_id = d.id
       LEFT JOIN users u ON p.created_by = u.id
       ${where}
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error: any) {
    console.error('获取排查计划列表失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 获取排查计划详情
export const getInspectionPlanDetail = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    
    const [rows] = await conn.execute(
      `SELECT p.*, 
              d.dept_name,
              u.username as creator_name
       FROM hazard_inspection_plans p
       LEFT JOIN departments d ON p.department_id = d.id
       LEFT JOIN users u ON p.created_by = u.id
       WHERE p.id = ?`,
      [id]
    );
    
    if ((rows as any[]).length === 0) {
      return res.status(404).json({ code: 404, msg: '排查计划不存在' });
    }
    
    res.json({
      code: 200,
      msg: 'success',
      data: (rows as any[])[0]
    });
  } catch (error: any) {
    console.error('获取排查计划详情失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 创建排查计划
export const createInspectionPlan = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const {
      plan_name,
      plan_type,
      frequency,
      start_date,
      end_date,
      risk_level,
      hazard_type,
      location,
      department_id,
      inspector_ids
    } = req.body;
    
    if (!plan_name || !plan_type || !frequency || !start_date) {
      return res.status(400).json({ code: 400, msg: '计划名称、类型、频率和开始日期为必填项' });
    }
    
    const [result] = await conn.execute(
      `INSERT INTO hazard_inspection_plans 
       (plan_name, plan_type, frequency, start_date, end_date, risk_level, hazard_type, location, department_id, inspector_ids, created_by, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
      [plan_name, plan_type, frequency, start_date, end_date, risk_level, hazard_type, location, department_id, inspector_ids, req.userId]
    );
    
    res.json({
      code: 200,
      msg: '排查计划创建成功',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('创建排查计划失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 更新排查计划
export const updateInspectionPlan = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const {
      plan_name,
      plan_type,
      frequency,
      start_date,
      end_date,
      risk_level,
      hazard_type,
      location,
      department_id,
      inspector_ids,
      status
    } = req.body;
    
    await conn.execute(
      `UPDATE hazard_inspection_plans 
       SET plan_name = ?, plan_type = ?, frequency = ?, start_date = ?, end_date = ?, 
           risk_level = ?, hazard_type = ?, location = ?, department_id = ?, 
           inspector_ids = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [plan_name, plan_type, frequency, start_date, end_date, risk_level, hazard_type, location, department_id, inspector_ids, status, id]
    );
    
    res.json({
      code: 200,
      msg: '排查计划更新成功'
    });
  } catch (error: any) {
    console.error('更新排查计划失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 删除排查计划
export const deleteInspectionPlan = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    
    // 检查是否有相关的排查记录
    const [recordRows] = await conn.execute(
      'SELECT COUNT(*) as count FROM hazard_inspection_records WHERE plan_id = ?',
      [id]
    );
    
    if ((recordRows as any)[0].count > 0) {
      return res.status(400).json({ code: 400, msg: '该计划已有排查记录，无法删除' });
    }
    
    await conn.execute('DELETE FROM hazard_inspection_plans WHERE id = ?', [id]);
    
    res.json({
      code: 200,
      msg: '排查计划删除成功'
    });
  } catch (error: any) {
    console.error('删除排查计划失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 获取排查记录列表
export const getInspectionRecords = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { 
      plan_id, 
      inspection_date, 
      inspector_id,
      hazard_found,
      status,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let where = 'WHERE 1=1';
    const params: any[] = [];
    
    if (plan_id) {
      where += ' AND r.plan_id = ?';
      params.push(plan_id);
    }
    
    if (inspection_date) {
      where += ' AND r.inspection_date = ?';
      params.push(inspection_date);
    }
    
    if (inspector_id) {
      where += ' AND r.inspector_id = ?';
      params.push(inspector_id);
    }
    
    if (hazard_found !== undefined && hazard_found !== '') {
      where += ' AND r.hazard_found = ?';
      params.push(hazard_found);
    }
    
    if (status) {
      where += ' AND r.status = ?';
      params.push(status);
    }
    
    // 数据权限过滤
    if (req.scope && req.scope.type !== 'all') {
      if (req.scope.type === 'dept') {
        where += ' AND p.department_id = ?';
        params.push(req.scope.departmentId);
      } else if (req.scope.type === 'self') {
        where += ' AND r.inspector_id = ?';
        params.push(req.userId);
      }
    }
    
    const [countRows] = await conn.execute(
      `SELECT COUNT(*) as total 
       FROM hazard_inspection_records r
       LEFT JOIN hazard_inspection_plans p ON r.plan_id = p.id
       ${where}`,
      params
    );
    const total = (countRows as any)[0].total;
    
    const offset = (Number(page) - 1) * Number(limit);
    const [rows] = await conn.execute(
      `SELECT r.*, 
              p.plan_name,
              u.username as inspector_name,
              h.hazard_description
       FROM hazard_inspection_records r
       LEFT JOIN hazard_inspection_plans p ON r.plan_id = p.id
       LEFT JOIN users u ON r.inspector_id = u.id
       LEFT JOIN hazards h ON r.hazard_id = h.id
       ${where}
       ORDER BY r.inspection_date DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );
    
    res.json({
      code: 200,
      msg: 'success',
      data: rows,
      total,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (error: any) {
    console.error('获取排查记录列表失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 创建排查记录
export const createInspectionRecord = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const {
      plan_id,
      inspection_date,
      hazard_found,
      hazard_id,
      location,
      description,
      photos,
      status
    } = req.body;
    
    if (!plan_id || !inspection_date) {
      return res.status(400).json({ code: 400, msg: '计划ID和排查日期为必填项' });
    }
    
    const [result] = await conn.execute(
      `INSERT INTO hazard_inspection_records 
       (plan_id, inspection_date, inspector_id, hazard_found, hazard_id, location, description, photos, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [plan_id, inspection_date, req.userId, hazard_found ? 1 : 0, hazard_id, location, description, photos, status || 'completed']
    );
    
    res.json({
      code: 200,
      msg: '排查记录创建成功',
      data: { id: (result as any).insertId }
    });
  } catch (error: any) {
    console.error('创建排查记录失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 更新排查记录
export const updateInspectionRecord = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    const {
      hazard_found,
      hazard_id,
      location,
      description,
      photos,
      status
    } = req.body;
    
    await conn.execute(
      `UPDATE hazard_inspection_records 
       SET hazard_found = ?, hazard_id = ?, location = ?, description = ?, photos = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [hazard_found ? 1 : 0, hazard_id, location, description, photos, status, id]
    );
    
    res.json({
      code: 200,
      msg: '排查记录更新成功'
    });
  } catch (error: any) {
    console.error('更新排查记录失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 删除排查记录
export const deleteInspectionRecord = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const { id } = req.params;
    
    await conn.execute('DELETE FROM hazard_inspection_records WHERE id = ?', [id]);
    
    res.json({
      code: 200,
      msg: '排查记录删除成功'
    });
  } catch (error: any) {
    console.error('删除排查记录失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};

// 获取今日待排查任务
export const getTodayInspections = async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const today = new Date().toISOString().split('T')[0];
    const currentUserId = req.userId ?? 0;

    // 获取当前用户参与的排查计划
    const [planRows] = await conn.execute(
      `SELECT p.*
       FROM hazard_inspection_plans p
       WHERE p.status = 'active'
         AND p.start_date <= ?
         AND (p.end_date IS NULL OR p.end_date >= ?)
         AND (p.inspector_ids LIKE ? OR p.created_by = ?)`,
      [today, today, `%${currentUserId}%`, currentUserId]
    );

    const plans = planRows as any[];
    const tasks = [];
    
    for (const plan of plans) {
      // 检查今天是否已经排查
      const [recordRows] = await conn.execute(
        'SELECT COUNT(*) as count FROM hazard_inspection_records WHERE plan_id = ? AND inspection_date = ?',
        [plan.id, today]
      );
      
      const hasInspected = (recordRows as any)[0].count > 0;
      
      tasks.push({
        plan_id: plan.id,
        plan_name: plan.plan_name,
        plan_type: plan.plan_type,
        frequency: plan.frequency,
        location: plan.location,
        has_inspected: hasInspected
      });
    }
    
    res.json({
      code: 200,
      msg: 'success',
      data: tasks
    });
  } catch (error: any) {
    console.error('获取今日待排查任务失败:', error);
    res.status(500).json({ code: 500, msg: error.message });
  } finally {
    if (conn) conn.release();
  }
};