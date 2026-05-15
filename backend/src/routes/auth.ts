import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getConnection } from '../config/database';

// 扩展Request类型
interface AuthRequest extends Request {
  user?: {
    userId: number;
    username: string;
    role: number;
  };
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'safety-system-secret-2026';

/**
 * 登录接口
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }

    const conn = await getConnection();
    
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
    
    // 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
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
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('登录失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
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
    if (err) return res.status(403).json({ code: 403, message: 'Token 无效' });
    req.user = decoded;
    next();
  });
};

/**
 * 获取当前用户信息
 */
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const conn = await getConnection();
    const [users] = await conn.execute(
      'SELECT id, username, real_name, email, department, position, role FROM users WHERE id = ?',
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
  try {
    const { username, password, real_name, department } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    
    const conn = await getConnection();
    
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
    
    // 创建用户
    await conn.execute(
      'INSERT INTO users (username, password, real_name, department, role) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, real_name || '', department || '', 2]
    );
    
    res.json({ code: 200, message: '注册成功' });
  } catch (error) {
    console.error('注册失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

/**
 * 刷新 Token 接口
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    const oldToken = authHeader && authHeader.split(' ')[1];
    
    if (!oldToken) {
      return res.status(401).json({ code: 401, message: '未授权' });
    }
    
    // 验证旧 token
    jwt.verify(oldToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ code: 403, message: 'Token 无效' });
      }
      
      // 生成新 token
      const newToken = jwt.sign(
        { userId: decoded.userId, username: decoded.username, role: decoded.role },
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
    });
  } catch (error) {
    console.error('刷新Token失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

/**
 * 登出接口
 */
router.delete('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
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
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
    }
    
    const conn = await getConnection();
    
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
    
    // 生成 JWT Token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
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
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('大屏登录失败：', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

export default router;
