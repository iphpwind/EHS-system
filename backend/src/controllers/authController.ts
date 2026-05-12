import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database';
import { AppError } from '../utils/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'safety-system-secret-2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * 用户登录
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    const conn = await getConnection();

    // 查询用户
    const [users] = await conn.execute(
      'SELECT id, username, password, real_name, email, role, status FROM users WHERE username = ? AND status = 1',
      [username]
    );

    if (!users || users.length === 0) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    const user = users[0];

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 更新最后登录时间
    await conn.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );

    // 记录登录日志
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [user.id, user.username, 'login', 'auth', '用户登录', req.ip]
    );

    res.json({
      success: true,
      message: '登录成功',
      data: {
        access_token: token,
        expires_in: JWT_EXPIRES_IN,
        user: {
          id: user.id,
          username: user.username,
          realName: user.real_name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

/**
 * 用户注册
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, realName, email, department } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      });
    }

    const conn = await getConnection();

    // 检查用户名是否已存在
    const [existing] = await conn.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );

    if (existing && existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const [result] = await conn.execute(
      'INSERT INTO users (username, password, real_name, email, department, role, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 5, 1, NOW(), NOW())',
      [username, hashedPassword, realName, email, department]
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        userId: (result as any).insertId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    next(error);
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const conn = await getConnection();

    const [users] = await conn.execute(
      `SELECT id, username, real_name, email, phone, department, position, role
       FROM users 
       WHERE id = ? AND status = 1`,
      [userId]
    );

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }

    const user = users[0];

    // 角色名称映射
    const roleNames: Record<number, string> = {
      1: '超级管理员',
      2: '管理员',
      3: '安全管理人员',
      4: '部门负责人',
      5: '普通用户'
    };

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        realName: user.real_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        position: user.position,
        role: user.role,
        roleName: roleNames[user.role] || '未知角色',
        permissions: []  // 简化版不使用复杂权限系统
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    next(error);
  }
};

/**
 * 用户登出
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const username = (req as any).user.username;

    // 记录登出日志
    const conn = await getConnection();
    await conn.execute(
      'INSERT INTO system_logs (user_id, username, action, module, description, ip_address, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, username, 'logout', 'auth', '用户登出', req.ip]
    );

    res.json({
      success: true,
      message: '登出成功'
    });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
};

/**
 * 刷新Token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const username = (req as any).user.username;
    const role = (req as any).user.role;

    const token = jwt.sign(
      {
        userId,
        username,
        role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Token刷新成功',
      data: { 
        access_token: token,
        expires_in: JWT_EXPIRES_IN
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    next(error);
  }
};
