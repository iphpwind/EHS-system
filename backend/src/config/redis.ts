import Ioredis from 'ioredis';
import { logger } from '../utils/logger';

// Redis 可用状态标志
let redisAvailable: boolean = true;

// Redis 客户端配置
const redis = new Ioredis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
  retryStrategy: (times: number) => {
    // Redis不可用时，不再重试
    if (!redisAvailable) {
      return null;
    }
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 1, // 减少重试次数
});

// Redis 连接事件监听
redis.on('connect', () => {
  redisAvailable = true;
  logger.info('✅ Redis 连接成功');
});

redis.on('ready', () => {
  redisAvailable = true;
  logger.info('✅ Redis 准备就绪');
});

redis.on('error', (error) => {
  redisAvailable = false;
  logger.error('❌ Redis 连接错误', { error });
  logger.warn('⚠️ Redis 已禁用，所有缓存操作将跳过');
});

redis.on('close', () => {
  redisAvailable = false;
  logger.warn('⚠️ Redis 连接关闭');
});

redis.on('reconnecting', () => {
  // 只有在Redis曾经可用时才尝试重连
  if (redisAvailable) {
    logger.info('🔄 Redis 重新连接中...');
  }
});

/**
 * 检查 Redis 是否可用
 */
export const isRedisAvailable = (): boolean => {
  return redisAvailable;
};

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
