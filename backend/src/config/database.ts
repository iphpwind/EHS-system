import mysql from 'mysql2/promise'
import { logger } from '../utils/logger';

// 数据库连接池配置（优化版：适配100-200用户并发）
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'safety_system',
  waitForConnections: true,
  connectionLimit: 30,        // 原10 → 30（适配中型化工企业并发）
  queueLimit: 100,            // 原0无线排队 → 100（防止无限排队导致内存溢出）
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
} as mysql.PoolOptions);

// 监听连接池事件（使用Winston日志替代console.log）
pool.on('acquire', (connection) => {
  logger.debug('数据库连接获取', { threadId: connection.threadId });
});

pool.on('release', (connection) => {
  logger.debug('数据库连接释放', { threadId: connection.threadId });
});

pool.on('enqueue', () => {
  logger.warn('等待可用数据库连接（连接池繁忙）');
});

// 连接数据库
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await pool.getConnection()
    logger.info('✅ 数据库连接成功')
    conn.release()
  } catch (error) {
    logger.error('❌ 数据库连接失败', { error })
    throw error
  }
}

// 执行查询
export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    logger.error('SQL执行失败', { error, sql: sql.substring(0, 200) })
    throw error
  }
}

// 获取连接（用于事务）
export const getConnection = async () => {
  return await pool.getConnection()
}

export default pool
