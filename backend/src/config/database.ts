import mysql from 'mysql2/promise'

// 数据库连接池配置
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'safety_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 超时配置
  acquireTimeout: 60000,      // 获取连接超时60秒
  timeout: 60000,            // 查询超时60秒
  reconnect: true,            // 自动重连
  // 连接池事件监听
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// 监听连接池事件
pool.on('acquire', (connection) => {
  console.log('📥 获取数据库连接: id=%d', connection.threadId);
});

pool.on('release', (connection) => {
  console.log('📤 释放数据库连接: id=%d', connection.threadId);
});

pool.on('enqueue', () => {
  console.log('⏳ 等待可用数据库连接...');
});

// 连接数据库
export const connectDB = async (): Promise<void> => {
  try {
    const conn = await pool.getConnection()
    console.log('✅ 数据库连接成功')
    conn.release()
  } catch (error) {
    console.error('❌ 数据库连接失败：', error)
    throw error
  }
}

// 执行查询
export const query = async (sql: string, params?: any[]): Promise<any> => {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('SQL执行失败：', error)
    throw error
  }
}

// 获取连接（用于事务）
export const getConnection = async () => {
  return await pool.getConnection()
}

export default pool
