import Redis from 'ioredis';
import { logger } from './logger';

let redisClient: Redis | null = null;

/**
 * 初始化 Redis 连接
 * 在 app.ts 启动时调用
 */
export const initRedis = async (): Promise<Redis | null> => {
  // 如果已经连接，直接返回
  if (redisClient?.status === 'ready') {
    return redisClient;
  }

  // 如果正在连接中，等待
  if (redisClient?.status === 'connect' || redisClient?.status === 'connecting') {
    return redisClient;
  }

  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        if (times > 3) {
          logger.warn('⚠️ Redis 连接失败次数过多，已禁用缓存');
          return null; // 停止重试
        }
        return Math.min(times * 100, 2000); // 重试间隔
      }
    });

    redisClient.on('error', (err: Error) => {
      logger.error('❌ Redis 连接错误', { error: err.message });
    });

    redisClient.on('connect', () => {
      logger.info('✅ Redis 连接成功');
    });

    redisClient.on('ready', () => {
      logger.info('✅ Redis 准备就绪');
    });

    redisClient.on('close', () => {
      logger.warn('⚠️ Redis 连接关闭');
    });

    // 等待连接就绪（最多5秒）
    await Promise.race([
      new Promise<void>((resolve) => {
        if (redisClient!.status === 'ready') return resolve();
        redisClient!.once('ready', resolve);
      }),
      new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Redis 连接超时')), 5000))
    ]);

    return redisClient;
  } catch (err: any) {
    logger.warn('⚠️ Redis 连接失败，缓存已临时禁用', { error: err.message });
    redisClient = null;
    return null;
  }
};

/**
 * 获取缓存
 * @param key 缓存键
 * @returns 缓存数据，未命中返回 null
 */
export const getCache = async (key: string): Promise<any> => {
  if (!redisClient || redisClient.status !== 'ready') return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err: any) {
    logger.error('Redis 读取缓存失败', { key, error: err.message });
    return null;
  }
};

/**
 * 设置缓存
 * @param key 缓存键
 * @param data 缓存数据
 * @param ttl 过期时间（秒），默认30秒
 */
export const setCache = async (key: string, data: any, ttl: number = 30): Promise<void> => {
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    await redisClient.set(key, JSON.stringify(data), 'EX', ttl);
  } catch (err: any) {
    logger.error('Redis 写入缓存失败', { key, error: err.message });
  }
};

/**
 * 删除缓存
 * @param key 缓存键（支持通配符）
 */
export const delCache = async (key: string): Promise<void> => {
  if (!redisClient || redisClient.status !== 'ready') return;
  try {
    // 支持通配符删除
    if (key.includes('*')) {
      const keys = await redisClient.keys(key);
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } else {
      await redisClient.del(key);
    }
  } catch (err: any) {
    logger.error('Redis 删除缓存失败', { key, error: err.message });
  }
};

/**
 * 获取 Redis 客户端实例（高级用法）
 */
export const getRedisClient = (): Redis | null => {
  return redisClient?.status === 'ready' ? redisClient : null;
};
