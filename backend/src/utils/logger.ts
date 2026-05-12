/**
 * Winston 日志系统
 * 替代散落的 console.log，提供工业级日志记录能力
 * 支持按级别分类输出、JSON格式、便于ELK采集
 */

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// 确保日志目录存在
const logDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 敏感信息过滤（防止密码、token等泄露到日志）
const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'secret', 'authorization', 'cookie'];

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

// 日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  process.env.NODE_ENV === 'development'
    ? winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(sanitize(meta)) : '';
        const stackStr = stack ? `\n${stack}` : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}${stackStr}`;
      })
    : winston.format.json() // 生产环境JSON格式
);

// 创建 Winston Logger 实例
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: logFormat,
  transports: [
    // 错误日志单独文件
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
    }),
    // 全部日志
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 20,
    }),
    // 控制台输出（开发环境彩色）
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development'
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
              const metaStr = Object.keys(meta).length ? ' ' + JSON.stringify(sanitize(meta)) : '';
              const stackStr = stack ? `\n${stack}` : '';
              return `[${timestamp}] ${level}: ${message}${metaStr}${stackStr}`;
            })
          )
        : logFormat,
    }),
  ],
  // 异常处理
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'exceptions.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logDir, 'rejections.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5,
    }),
  ],
  exitOnError: false, // 不因日志异常退出
});

/**
 * 日志辅助方法 - 带请求上下文
 */
export function logWithContext(
  level: 'error' | 'warn' | 'info' | 'debug',
  message: string,
  req?: { method?: string; path?: string; ip?: string; userId?: any },
  extra?: Record<string, any>
) {
  const context: Record<string, any> = { ...extra };
  if (req) {
    context.method = req.method;
    context.path = req.path;
    context.ip = req.ip;
    if (req.userId) context.userId = req.userId;
  }
  logger.log(level, message, sanitize(context));
}

/**
 * 创建子日志器（带模块标识）
 */
export function createModuleLogger(module: string) {
  return {
    error: (message: string, meta?: any) => logger.error(message, { module, ...sanitize(meta || {}) }),
    warn: (message: string, meta?: any) => logger.warn(message, { module, ...sanitize(meta || {}) }),
    info: (message: string, meta?: any) => logger.info(message, { module, ...sanitize(meta || {}) }),
    debug: (message: string, meta?: any) => logger.debug(message, { module, ...sanitize(meta || {}) }),
  };
}

export default logger;
