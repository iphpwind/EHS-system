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

export default router;
