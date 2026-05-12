/**
 * 防重复提交中间件
 * 使用内存 Set 锁，适合单机部署
 */

import { Request, Response, NextFunction } from 'express';

const lockSet = new Set<string>();
const LOCK_TTL_MS = 5000; // 5秒锁过期

function buildKey(req: Request): string {
  const userId = (req as any).user?.userId || 'guest';
  const path = req.originalUrl || req.path;
  const bodyHash = JSON.stringify(req.body || {});
  return `${userId}:${req.method}:${path}:${bodyHash}`;
}

export function deduplicateMiddleware(req: Request, res: Response, next: NextFunction) {
  // 只拦截修改类请求
  if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    return next();
  }

  const key = buildKey(req);
  if (lockSet.has(key)) {
    return res.status(429).json({
      code: 429,
      msg: '请求过于频繁，请勿重复提交',
      data: null
    });
  }

  lockSet.add(key);

  // 响应完成后或超时自动释放
  res.on('finish', () => {
    lockSet.delete(key);
  });

  setTimeout(() => {
    lockSet.delete(key);
  }, LOCK_TTL_MS);

  next();
}
