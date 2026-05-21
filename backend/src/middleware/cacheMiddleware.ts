import { Request, Response, NextFunction } from 'express';
import { getRedisClient, isRedisAvailable } from '../config/redis';
import { logger } from '../utils/logger';

/**
 * Redis缓存中间件
 * @param ttlSeconds 缓存有效期（秒）
 */
export const cacheMiddleware = (ttlSeconds: number = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // 如果Redis不可用，直接跳过缓存
    if (!isRedisAvailable()) {
      return next();
    }

    // 生成缓存key：包含路径和查询参数
    const cacheKey = `dashboard:${req.path}:${JSON.stringify(req.query)}`;
    
    try {
      const redis = getRedisClient();
      const cached = await redis.get(cacheKey);
      
      // 缓存命中，直接返回
      if (cached) {
        logger.debug('Redis缓存命中', { cacheKey });
        return res.json(JSON.parse(cached));
      }
    } catch (error) {
      logger.warn('Redis 获取缓存失败，继续数据库查询', { error });
    }

    // 缓存未命中，重写 res.json 以缓存响应
    const originalJson = res.json.bind(res);
    
    res.json = (body: any) => {
      // 只缓存成功的响应
      if (res.statusCode === 200 && body && body.success) {
        try {
          const redis = getRedisClient();
          redis.setex(cacheKey, ttlSeconds, JSON.stringify(body)).catch((err) => {
            logger.warn('Redis 写入缓存失败', { error: err, cacheKey });
          });
        } catch (error) {
          // 忽略缓存写入错误，不影响主流程
          logger.warn('Redis 写入缓存异常', { error });
        }
      }
      
      return originalJson(body);
    };

    next();
  };
};
