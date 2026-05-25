import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../utils/cache';
import { logger } from '../utils/logger';

/**
 * Dashboard 缓存中间件
 * 对 GET 请求进行缓存，减少数据库压力
 * 
 * @param ttl 缓存时间（秒），默认 25 秒
 * 
 * 用法：
 *   router.get('/kpi', dashboardCache(25), getKPI);
 *   router.get('/trend', dashboardCache(60), getTrend);
 */
export const dashboardCache = (ttl: number = 25) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 只缓存 GET 请求
    if (req.method !== 'GET') {
      return next();
    }

    // 构造缓存 key：路径 + 查询参数 + 用户ID（数据权限隔离）
    const userId = (req as any).user?.userId || 'anon';
    const cacheKey = `dashboard:${req.path}:${userId}:${JSON.stringify(req.query)}`;

    try {
      // 尝试从缓存读取
      const cached = await getCache(cacheKey);
      if (cached) {
        logger.debug('🎯 Dashboard 缓存命中', { path: req.path, userId });
        return res.json(cached);
      }
    } catch (err: any) {
      logger.warn('Dashboard 缓存读取失败，继续处理请求', { error: err.message });
    }

    // 缓存未命中，拦截 res.json 以缓存响应
    const originalJson = res.json.bind(res);
    res.json = (body: any) => {
      // 只缓存成功响应
      if (res.statusCode === 200 && body && body.code === 200) {
        setCache(cacheKey, body, ttl).catch((err: any) => {
          logger.warn('Dashboard 缓存写入失败', { error: err.message });
        });
      }
      return originalJson(body);
    };

    next();
  };
};
