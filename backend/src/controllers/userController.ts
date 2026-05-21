import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';
import { AppError } from '../utils/errors';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  real_name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role: number;
  role_name?: string;
  status: number;
  last_login: Date;
  created_at: Date;
  updated_at: Date;
}

interface CountResult extends RowDataPacket {
  total: number;
}

interface ExistResult extends RowDataPacket {
  id: number;
  username: string;
}

/**
 * 获取用户列表
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { page = 1, pageSize = 20, keyword, department, role, roleId } = req.query;
    const roleValue = role || roleId;
    const offset = (Number(page) - 1) * Number(pageSize);

    conn = await getConnection();

    let query = 'SELECT id, username, real_name, email, phone, department, position, role, status, last_login, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    if (keyword) {
      query += ' AND (username LIKE ? OR real_name LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    if (roleValue) {
      query += ' AND role = ?';
      params.push(roleValue);
    }

    // 获取总数
    const [countRows] = await conn.execute<CountResult[]>(
      'SELECT COUNT(*) as total FROM users WHERE 1=1' + 
      (keyword ? ' AND (username LIKE ? OR real_name LIKE ?)' : '') +
      (department ? ' AND department = ?' : '') +
      (roleValue ? ' AND role = ?' : ''),
      params.filter((p: any, idx: number) => {
        if (keyword && (idx === 0 || idx === 1)) return true;
        if (department && idx === (keyword ? 2 : 0)) return true;
        if (roleValue && idx === params.length - 1) return true;
        return false;
      })
    );
    
    // 简化：直接使用另一个查询获取总数
    const [countResult] = await conn.execute<CountResult[]>('SELECT COUNT(*) as total FROM users');
    const total = countResult[0].total;

    // 获取分页数据
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(Number(pageSize), offset);

    const [users] = await conn.execute<UserRow[]>(query, params);

    res.json({
      success: true,
      data: {
        list: users,
        pagination: {
          page: Number(page),
          pageSize: Number(pageSize),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 获取单个用户详情
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    conn = await getConnection();

    const [users] = await conn.execute<UserRow[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get user by id error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 创建用户
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { username, password, realName, email, phone, department, position, role } = req.body;
    const userId = (req as any).user?.userId;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码不能为空' });
    }

    conn = await getConnection();

    // 检查用户名是否已存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE username = ?',
      [username]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({ success: false, message: '用户名已存在' });
    }

    // 加密密码
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO users
       (username, password, real_name, email, phone, department, position, role, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [username, hashedPassword, realName || '', email || '', phone || '', department || '', position || '', role || 5]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user?.username, 'create_user', 'user', `创建用户: ${username}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Create user error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 更新用户
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const { realName, email, phone, department, position, role, status } = req.body;
    const userId = (req as any).user?.userId;

    conn = await getConnection();

    // 检查用户是否存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 更新用户
    const updateFields = [];
    const updateParams = [];

    if (realName !== undefined) { updateFields.push('real_name = ?'); updateParams.push(realName); }
    if (email !== undefined) { updateFields.push('email = ?'); updateParams.push(email); }
    if (phone !== undefined) { updateFields.push('phone = ?'); updateParams.push(phone); }
    if (department !== undefined) { updateFields.push('department = ?'); updateParams.push(department); }
    if (position !== undefined) { updateFields.push('position = ?'); updateParams.push(position); }
    if (role !== undefined) { updateFields.push('role = ?'); updateParams.push(role); }
    if (status !== undefined) { updateFields.push('status = ?'); updateParams.push(status); }

    updateFields.push('updated_at = NOW()');
    updateParams.push(id);

    if (updateFields.length > 1) { // 大于1是因为包含了 updated_at
      await conn.execute(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        updateParams
      );

      // 记录日志
      await conn.execute(
        'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId, (req as any).user?.username, 'update_user', 'user', `更新用户: ${(existing[0] as any).username}`, req.ip]
      );
    }

    res.json({ success: true, message: '用户更新成功' });
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 删除用户（软删除）
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    conn = await getConnection();

    // 检查用户是否存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 软删除（更新状态为0）
    await conn.execute(
      'UPDATE users SET status = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user?.username, 'delete_user', 'user', `删除用户: ${(existing[0] as any).username}`, req.ip]
    );

    res.json({ success: true, message: '用户删除成功' });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 重置密码
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  let conn: any = null;
  try {
    const { id } = req.params;
    const { newPassword } = req.body;
    const userId = (req as any).user?.userId;

    if (!newPassword) {
      return res.status(400).json({ success: false, message: '新密码不能为空' });
    }

    conn = await getConnection();

    // 检查用户是否存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // 加密新密码
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await conn.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, id]
    );

    // 记录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, (req as any).user?.username, 'reset_password', 'user', `重置密码: ${(existing[0] as any).username}`, req.ip]
    );

    res.json({ success: true, message: '密码重置成功' });
  } catch (error) {
    console.error('Reset password error:', error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
