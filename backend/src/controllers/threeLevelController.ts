/**
 * 三级安全教育档案控制器（P1-2 培训合规）
 */
import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { recordTrace } from '../utils/operationTracer';

// ==================== 列表查询 ====================
export const listThreeLevel = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { pageNum = 1, pageSize = 10, employeeName, deptId, status, educationLevel } = req.query;
    conn = await getConnection();
    let sql = `
      SELECT tle.*, u.real_name as employeeName, d.name as deptName,
             c.title as courseName, edu.real_name as educatorName
      FROM three_level_education tle
      LEFT JOIN users u ON tle.employee_id = u.id
      LEFT JOIN departments d ON d.id = tle.dept_id
      LEFT JOIN courses c ON tle.course_id = c.id
      LEFT JOIN users edu ON tle.educator_id = edu.id
      WHERE 1=1 `;
    const params: any[] = [];
    if (employeeName) { sql += ' AND u.real_name LIKE ?'; params.push(`%${employeeName}%`); }
    if (deptId) { sql += ' AND tle.dept_id = ?'; params.push(Number(deptId)); }
    if (status) { sql += ' AND tle.status = ?'; params.push(status); }
    if (educationLevel) { sql += ' AND tle.education_level = ?'; params.push(educationLevel); }

    const countSql = sql.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) as total FROM');
    const [countRows] = await conn.execute<RowDataPacket[]>(countSql, params);
    const total = (countRows[0] as any).total;

    sql += ' ORDER BY tle.education_date DESC LIMIT ? OFFSET ?';
    const offset = (Number(pageNum) -1) * Number(pageSize);
    params.push(Number(pageSize), offset);

    const [rows] = await conn.execute<RowDataPacket[]>(sql, params);
    res.json({ code: 200, msg: 'success', data: { rows, total } });
  } catch (error) { next(error); }
  finally {
    if (conn) conn.release();
  }
};

// ==================== 详情 ====================
export const getThreeLevelDetail = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    conn = await getConnection();
    const [rows] = await conn.execute<RowDataPacket[]>(
      `SELECT tle.*, u.real_name as employeeName, d.name as deptName,
              c.title as courseName, edu.real_name as educatorName
       FROM three_level_education tle
       LEFT JOIN users u ON tle.employee_id = u.id
       LEFT JOIN departments d ON d.id = tle.dept_id
       LEFT JOIN courses c ON tle.course_id = c.id
       LEFT JOIN users edu ON tle.educator_id = edu.id
       WHERE tle.id = ?`,
      [id]
    );
    if (!(rows as any[]).length) return res.status(404).json({ code: 404, msg: '记录不存在' });
    res.json({ code: 200, msg: 'success', data: rows[0] });
  } catch (error) { next(error); }
  finally {
    if (conn) conn.release();
  }
};

// ==================== 新增 ====================
export const addThreeLevel = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { employee_id, dept_id, education_level, course_id, educator_id, education_date, duration, content_summary } = req.body;
    const userId = (req as any).user?.userId;
    conn = await getConnection();
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO three_level_education
       (employee_id, dept_id, education_level, course_id, educator_id, education_date, duration, content_summary, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'in_progress', NOW(), NOW())`,
      [employee_id, dept_id, education_level, course_id, educator_id, education_date, duration, content_summary]
    );
    await recordTrace({
      entity_type: 'three_level_education', entity_id: result.insertId,
      action: 'create', action_label: '新增三级教育档案',
      operator_id: userId, operator_name: (req as any).user?.realName || ''
    });
    res.status(201).json({ code: 200, msg: '新增成功', data: { id: result.insertId } });
  } catch (error) { next(error); }
  finally {
    if (conn) conn.release();
  }
};

// ==================== 修改 ====================
export const updateThreeLevel = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const { education_level, course_id, educator_id, education_date, duration, content_summary, score, status, assess_result, assess_comment } = req.body;
    const userId = (req as any).user?.userId;
    conn = await getConnection();
    await conn.execute(
      `UPDATE three_level_education SET
        education_level=?, course_id=?, educator_id=?, education_date=?,
        duration=?, content_summary=?, score=?, status=?, assess_result=?, assess_comment=?,
        certificate_no=?, updated_at=NOW()
       WHERE id=?`,
      [education_level, course_id, educator_id, education_date, duration, content_summary, score, status, assess_result, assess_comment,
       status === 'completed' ? `TL${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}` : null, id]
    );
    await recordTrace({
      entity_type: 'three_level_education', entity_id: Number(id),
      action: 'update', action_label: '更新三级教育档案',
      operator_id: userId, operator_name: (req as any).user?.realName || ''
    });
    res.json({ code: 200, msg: '更新成功' });
  } catch (error) { next(error); }
  finally {
    if (conn) conn.release();
  }
};

// ==================== 考核 ====================
export const assessThreeLevel = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id, score, assess_result, assess_comment } = req.body;
    const userId = (req as any).user?.userId;
    conn = await getConnection();
    const certificateNo = status === 'completed' ? `TL${Date.now()}${Math.floor(Math.random()*1000).toString().padStart(3,'0')}` : null;
    await conn.execute(
      `UPDATE three_level_education SET
        score=?, assess_result=?, assess_comment=?,
        status=?, certificate_no=?, updated_at=NOW()
       WHERE id=?`,
      [score, assess_result, assess_comment, 'completed', certificateNo, id]
    );
    await recordTrace({
      entity_type: 'three_level_education', entity_id: Number(id),
      action: 'assess', action_label: '三级教育考核',
      operator_id: userId, operator_name: (req as any).user?.realName || ''
    });
    res.json({ code: 200, msg: '考核完成', data: { certificateNo } });
  } catch (error) { next(error); }
  finally {
    if (conn) conn.release();
  }
};
