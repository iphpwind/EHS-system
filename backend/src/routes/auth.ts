import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database';
import dotenv from 'dotenv';
import path from 'path';

// 加载 .env 文件
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

// 扩展Request类型
interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: number;
    department_id?: number | null;  // P0迁移：新增部门ID
    roleId?: number;                 // P0迁移：新增角色ID
  };
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || (() => { throw new Error("JWT_SECRET 未配置") })();

/**
 * 登录接口
 */
router.post('/login', async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }

    conn = await getConnection();
    
    // 查询用户
    const [users] = await conn.execute(
      'SELECT id, username, password, real_name, role FROM users WHERE username = ? AND status = 1 LIMIT 1',
      [username]
    );
    
    if (!(users as any[]).length) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    
    const user = (users as any[])[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    
    // 更新最后登录时间
    await conn.execute(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    );
    
    // 获取用户角色（新 RBAC：从 user_roles 取，兜底用 users.role）
    const [roleRows] = await conn.execute(
      'SELECT role_id FROM user_roles WHERE user_id = ? LIMIT 1',
      [user.id]
    );
    const primaryRoleId = (roleRows as any[])[0]?.role_id || user.role;

    // ✅ P0迁移：注入 department_id + roleId
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role,
        department_id: user.department_id || null,
        roleId: primaryRoleId
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      code: 200,
      data: {
        access_token: token,
        expires_in: 604800,
        user: {
          id: user.id,
          username: user.username,
          real_name: user.real_name,
          role: user.role,
          department_id: user.department_id || null,
          roleId: primaryRoleId
        }
      }
    });
  } catch (error) {
    console.error('登录失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  } finally {
    if (conn) conn.release();
  }
});

/**
 * 验证 Token 中间件
 */
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ code: 401, message: '未授权' });
  }
  
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ code: 401, message: 'Token 无效' });
    
    // ✅ P0迁移：注入 department_id + roleId
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      department_id: decoded.department_id || null,  // ✅ 新增
      roleId: decoded.roleId || decoded.role           // ✅ 新增（新 RBAC 主角色）
    };
    next();
  });
};

/**
 * 获取当前用户信息
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  let conn: any = null;
  try {
    conn = await getConnection();
    const [users] = await conn.execute(
      'SELECT id, username, real_name, email, department, department_id, position, role FROM users WHERE id = ?',
      [req.user!.userId]
    );
    
    if (!(users as any[]).length) {
      return res.status(404).json({ code: 404, message: '用户不存在' });
    }
    
    res.json({
      code: 0,
      data: (users as any[])[0]
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  } finally {
    if (conn) conn.release();
  }
});

// 获取公钥（RSA加密用） - 返回模拟公钥
router.get('/publicKey', (req: Request, res: Response) => {
  // 返回一个模拟的 RSA 公钥
  res.json({
    code: 200,
    data: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC4zq9PJij3XqA6X8H4SJ8kJC1mJ5HJ6hG0p8vHz0Kz0Y0x0t0f0Z0L0Q0T0y0u0w0q0o0m0k0i0g0e0c0a0Y0W0U0S0Q0O0M0K0I0G0E0C0A==',
    msg: 'success'
  });
});


/**
 * 注册接口
 */
router.post('/register', async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const { username, password, real_name, department, department_id } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    
    conn = await getConnection();
    
    // 检查用户是否已存在
    const [existing] = await conn.execute(
      'SELECT id FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    
    if ((existing as any[]).length > 0) {
      return res.status(400).json({ code: 400, message: '用户名已存在' });
    }
    
    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // ✅ P0迁移：同时写入 department_id INT
    const [result] = await conn.execute(
      'INSERT INTO users (username, password, real_name, department, department_id, role) VALUES (?, ?, ?, ?, ?, 2)',
      [username, hashedPassword, real_name || '', department || '', department_id || null]
    );
    
    res.json({ code: 200, message: '注册成功' });
  } catch (error) {
    console.error('注册失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  } finally {
    if (conn) conn.release();
  }
});

/**
 * 刷新 Token 接口
 */
router.post('/refresh', async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const authHeader = req.headers['authorization'];
    const oldToken = authHeader && authHeader.split(' ')[1];
    
    if (!oldToken) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    
    // 验证旧 token（允许过期 token 刷新）
    jwt.verify(oldToken, JWT_SECRET, { ignoreExpiration: true }, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ code: 401, message: 'Token 无效' });
      }
      
      try {
        // ✅ P0迁移：从数据库重新读取最新 department_id + roleId
        conn = await getConnection();
        const [users] = await conn.execute(
          'SELECT id, username, role, department_id FROM users WHERE id = ? AND status = 1 LIMIT 1',
          [decoded.userId]
        );
        
        if (!(users as any[]).length) {
          return res.status(401).json({ code: 401, message: '用户不存在或已禁用' });
        }
        
        const user = (users as any[])[0];
        
        const [roleRows] = await conn.execute(
          'SELECT role_id FROM user_roles WHERE user_id = ? LIMIT 1',
          [user.id]
        );
        const primaryRoleId = (roleRows as any[])[0]?.role_id || user.role;
        
        // 生成新 token（含最新字段）
        const newToken = jwt.sign(
          { 
            userId: user.id, 
            username: user.username, 
            role: user.role,
            department_id: user.department_id || null,  // ✅ 新增
            roleId: primaryRoleId                     // ✅ 新增
          },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        res.json({
          code: 200,
          data: {
            access_token: newToken,
            expires_in: 604800
          }
        });
      } catch (innerError) {
        console.error('Refresh token inner error:', innerError);
        res.status(500).json({ code: 500, message: '服务器内部错误' });
      } finally {
        if (conn) conn.release();
      }
    });
  } catch (error) {
    console.error('刷新Token失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

/**
 * 登出接口
 */
router.delete('/logout', async (req: Request, res: Response) => {
  try {
    // 这里可以添加 token 黑名单逻辑（可选）
    // 目前前端只是删除本地 token，后端无需额外操作
    res.json({ code: 200, message: '登出成功' });
  } catch (error) {
    console.error('登出失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

/**
 * 大屏登录接口
 */
router.post('/display', async (req: Request, res: Response) => {
  let conn: any = null;
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    
    conn = await getConnection();
    
    // 查询用户
    const [users] = await conn.execute(
      'SELECT id, username, password, real_name, role, department_id FROM users WHERE username = ? AND status = 1 LIMIT 1',
      [username]
    );
    
    if (!(users as any[]).length) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    
    const user = (users as any[])[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    
    // 获取用户角色（新 RBAC）
    const [roleRows] = await conn.execute(
      'SELECT role_id FROM user_roles WHERE user_id = ? LIMIT 1',
      [user.id]
    );
    const primaryRoleId = (roleRows as any[])[0]?.role_id || user.role;
    
    // ✅ P0迁移：注入 department_id + roleId
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role,
        department_id: user.department_id || null,  // ✅ 新增
        roleId: primaryRoleId                     // ✅ 新增
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      code: 200,
      data: {
        access_token: token,
        expires_in: 604800,
        user: {
          id: user.id,
          username: user.username,
          real_name: user.real_name,
          role: user.role,
          department_id: user.department_id || null,  // ✅ 新增
          roleId: primaryRoleId                     // ✅ 新增
        }
      }
    });
  } catch (error) {
    console.error('大屏登录失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  } finally {
    if (conn) conn.release();
  }
});

export default router;
