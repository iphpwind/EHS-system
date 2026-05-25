import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 扩展 Request 类型（供控制器使用）
export interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: number;
    department_id?: number | null;
    roleId?: number;
  };
  // 快捷属性（兼容旧代码）
  userId?: number;
  userDeptId?: number | null;
  // 数据权限
  scope?: {
    type: 'all' | 'dept' | 'self';
    departmentId?: number;
  };
}



// 懒读取 JWT_SECRET（避免 dotenv 加载顺序问题）
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET 未配置，请在 .env 文件中设置');
  }
  return secret;
}

/**
 * 认证中间件 - 验证JWT Token
 */
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 获取Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌',
        code: 'NO_TOKEN'
      });
    }

    // 验证token
    jwt.verify(token, getJwtSecret(), (err: any, decoded: any) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            success: false,
            message: '认证令牌已过期',
            code: 'TOKEN_EXPIRED'
          });
        }
        
        return res.status(401).json({
          success: false,
          message: '认证令牌无效',
          code: 'INVALID_TOKEN'
        });
      }

      // 将用户信息附加到请求对象
      (req as any).user = decoded;
      next();
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: '认证过程发生错误'
    });
  }
};

/**
 * 角色权限中间件 - 检查用户角色
 * @param allowedRoles 允许的角色ID数组
 */
export const authorizeRoles = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: '未认证用户'
      });
    }

    if (!allowedRoles.includes(Number(userRole))) {
      return res.status(403).json({
        success: false,
        message: '权限不足，无法访问此资源',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

/**
 * 权限检查中间件 - 检查用户是否有特定权限
 * @param requiredPermission 需要的权限代码
 */
export const authorizePermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let conn: any = null;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    // 超级管理员（role=1）拥有所有权限
    if (userRole === 1) {
      return next();
    }

    try {
      const { getConnection } = require('../config/database');
      conn = await getConnection();

      // 获取用户角色权限
      const [roles] = await conn.execute(
        'SELECT permissions FROM roles WHERE id = ?',
        [userRole]
      );

      if (!roles || roles.length === 0) {
        return res.status(403).json({
          success: false,
          message: '角色不存在'
        });
      }

      const permissions = JSON.parse((roles[0] as any).permissions || '[]');

      // 检查是否有所有权限的通配符
      if (permissions.includes('*')) {
        return next();
      }

      // 检查是否有所需权限
      if (!permissions.includes(requiredPermission)) {
        return res.status(403).json({
          success: false,
          message: '权限不足',
          code: 'INSUFFICIENT_PERMISSIONS'
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      return res.status(500).json({
        success: false,
        message: '权限检查失败'
      });
    } finally {
      if (conn) conn.release();
    }
  };
};

/**
 * 可选认证中间件 - 不强制要求认证，但有token时会解析
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, getJwtSecret(), (err: any, decoded: any) => {
    if (err) {
      // Token无效，但不阻止请求
      return next();
    }

    (req as any).user = decoded;
    next();
  });
};
