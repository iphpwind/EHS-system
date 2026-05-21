import Ioredis from 'ioredis';
import { logger } from '../utils/logger';

// Redis 客户端配置
const redis = new Ioredis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

// Redis 连接事件监听
redis.on('connect', () => {
  logger.info('✅ Redis 连接成功');
});

redis.on('ready', () => {
  logger.info('✅ Redis 准备就绪');
});

redis.on('error', (error) => {
  logger.error('❌ Redis 连接错误', { error });
});

redis.on('close', () => {
  logger.warn('⚠️ Redis 连接关闭');
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis 重新连接中...');
});

/**
 * 获取 Redis 客户端实例
 */
export const getRedisClient = (): Ioredis.Redis => {
  return redis;
};

/**
 * 关闭 Redis 连接
 */
export const closeRedis = async (): Promise<void> => {
  await redis.quit();
  logger.info('✅ Redis 连接已关闭');
};

export default redis;
