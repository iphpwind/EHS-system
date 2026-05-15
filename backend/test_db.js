const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('开始连接数据库...');
  
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'safety_system'
    });
    
    console.log('数据库连接成功！');
    
    // 检查 users 表结构
    console.log('\n=== users 表结构 ===');
    const [columns] = await connection.query('DESCRIBE users');
    for (const col of columns) {
      console.log(`${col.Field} | ${col.Type} | ${col.Null} | ${col.Key}`);
    }
    
    // 检查表列表
    console.log('\n=== 数据库表列表 ===');
    const [tables] = await connection.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`- ${tableName}`);
    }
    
    await connection.end();
    console.log('\n完成！');
  } catch (err) {
    console.error('数据库错误:', err.message);
    console.error('错误代码:', err.code);
    process.exit(1);
  }
}

testConnection();
