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
  role_id: number;
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
  try {
    const { page = 1, pageSize = 20, keyword, department, roleId } = req.query;
    const offset = (Number(page) - 1) * Number(pageSize);

    const conn = await getConnection();

    let query = 'SELECT id, username, real_name, email, phone, department, position, role_id, status, last_login, created_at FROM users WHERE 1=1';
    const params: any[] = [];

    if (keyword) {
      query += ' AND (username LIKE ? OR real_name LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    if (department) {
      query += ' AND department = ?';
      params.push(department);
    }

    if (roleId) {
      query += ' AND role_id = ?';
      params.push(roleId);
    }

    // 获取总数
    const [countRows] = await conn.execute<CountResult[]>(
      'SELECT COUNT(*) as total FROM users WHERE 1=1' + 
      (keyword ? ' AND (username LIKE ? OR real_name LIKE ?)' : '') +
      (department ? ' AND department = ?' : '') +
      (roleId ? ' AND role_id = ?' : ''),
      params.filter((p: any, idx: number) => {
        if (keyword && (idx === 0 || idx === 1)) return true;
        if (department && idx === (keyword ? 2 : 0)) return true;
        if (roleId && idx === params.length - 1) return true;
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
  }
};

/**
 * 获取单个用户
 */
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const conn = await getConnection();

    const [users] = await conn.execute<UserRow[]>(
      `SELECT u.id, u.username, u.real_name, u.email, u.phone, u.department, 
              u.position, u.role_id, r.name as role_name, u.status, u.last_login, 
              u.created_at, u.updated_at
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [id]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    res.json({
      success: true,
      data: users[0]
    });
  } catch (error) {
    console.error('Get user by id error:', error);
    next(error);
  }
};

/**
 * 创建用户
 */
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, realName, email, phone, department, position, roleId } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    const conn = await getConnection();

    // 检查用户名
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE username = ?',
      [username]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 加密密码
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await conn.execute<OkPacket>(
      `INSERT INTO users 
       (username, password, real_name, email, phone, department, position, role_id, status, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
      [username, hashedPassword, realName, email, phone, department, position, roleId || 5]
    );

    // 记录日志
    const currentUser = (req as any).user;
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [currentUser?.userId, currentUser?.username, 'create_user', 'user', `创建用户: ${username}`, req.ip]
    );

    res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: {
        userId: result.insertId
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    next(error);
  }
};

/**
 * 更新用户
 */
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { realName, email, phone, department, position, roleId, status } = req.body;

    const conn = await getConnection();

    // 检查用户是否存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 更新用户
    await conn.execute(
      `UPDATE users 
       SET real_name = ?, email = ?, phone = ?, department = ?, position = ?, role_id = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [realName, email, phone, department, position, roleId, status, id]
    );

    // 记录日志
    const currentUser = (req as any).user;
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [currentUser?.userId, currentUser?.username, 'update_user', 'user', `更新用户: ${existing[0].username}`, req.ip]
    );

    res.json({
      success: true,
      message: '用户更新成功'
    });
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  }
};

/**
 * 删除用户
 */
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const conn = await getConnection();

    // 检查用户是否存在
    const [existing] = await conn.execute<ExistResult[]>(
      'SELECT id, username FROM users WHERE id = ?',
      [id]
    );

    if (!existing || existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    // 软删除（更新状态）
    await conn.execute(
      'UPDATE users SET status = 0, updated_at = NOW() WHERE id = ?',
      [id]
    );

    // 记录日志
    const currentUser = (req as any).user;
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [currentUser?.userId, currentUser?.username, 'delete_user', 'user', `删除用户: ${existing[0].username}`, req.ip]
    );

    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};

/**
 * 重置密码
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: '新密码不能为空'
      });
    }

    const conn = await getConnection();

    // 加密新密码
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新密码
    await conn.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, id]
    );

    // 记录日志
    const currentUser = (req as any).user;
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [currentUser?.userId, currentUser?.username, 'reset_password', 'user', `重置用户密码: ID=${id}`, req.ip]
    );

    res.json({
      success: true,
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    next(error);
  }
};
