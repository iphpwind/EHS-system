import mysql from 'mysql2/promise'
import { logger } from '../utils/logger';

// 数据库连接池配置（优化版：防止内存溢出 + 适配实际并发）
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'safety_system',
  waitForConnections: true,
  connectionLimit: 35,        // ✅ 从80降到35（防止内存溢出）
  queueLimit: 100,            // ✅ 从200降到100（防止无限排队）
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // ✅ 从0改为10秒
  idleTimeout: 60000,          // ✅ 新增：60秒空闲断开
  connectTimeout: 15000,       // ✅ 新增：15秒连接超时
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

// ✅ 新增：连接池错误监听
pool.on('error', (err) => {
  logger.error('数据库连接池错误', { error: err });
});

// 连接数据库
export const connectDB = async (): Promise<void> => {
  let conn: any = null;
  try {
    conn = await pool.getConnection()
    logger.info('✅ 数据库连接成功')
  } catch (error) {
    logger.error('❌ 数据库连接失败', { error })
    throw error
  } finally {
    if (conn) conn.release()
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


// 执行查询（自动管理连接释放，防止连接泄漏）
export const executeQuery = async (sql: string, params?: any[]): Promise<any> => {
  let conn;
  try {
    conn = await pool.getConnection();
    const [rows] = await conn.execute(sql, params);
    return rows;
  } catch (error) {
    logger.error('SQL执行失败', { error, sql: sql.substring(0, 200) });
    throw error;
  } finally {
    if (conn) conn.release();
  }
};

// 执行事务查询（需要手动管理连接）
export const getTransactionConnection = async () => {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  return conn;
};

export default pool
