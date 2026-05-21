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
    // ✅ 修改：即使Redis不可用也尝试重连（但降低频率）
    if (times > 10) {
      logger.warn('Redis 重连次数过多，暂停重连');
      redisAvailable = false;
      return null;
    }
    const delay = Math.min(times * 100, 3000);
    return delay;
  },
  maxRetriesPerRequest: 2, // ✅ 从1改为2（允许重试）
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

// ✅ 修改：Redis错误时不要禁用Redis
redis.on('error', (error) => {
  logger.error('❌ Redis 连接错误', { error });
  // 不要设置 redisAvailable = false，允许后续重试
});

redis.on('close', () => {
  logger.warn('⚠️ Redis 连接关闭');
  // ✅ 修改：不要设置 redisAvailable = false，允许重连
});

redis.on('reconnecting', () => {
  logger.info('🔄 Redis 重新连接中...');
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
