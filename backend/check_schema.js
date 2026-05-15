const mysql = require('mysql2/promise');

async function checkTableStructure() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'safety_system'
  });

  console.log('=== 检查数据库表结构 ===\n');
  
  // 获取所有表名
  const [tables] = await connection.query('SHOW TABLES');
  
  for (const table of tables) {
    const tableName = Object.values(table)[0];
    console.log(`\n=== 表: ${tableName} ===`);
    
    // 获取表结构
    const [columns] = await connection.query(`DESCRIBE ${tableName}`);
    
    for (const col of columns) {
      console.log(`  ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key} | ${col.Default}`);
    }
  }

  await connection.end();
}

checkTableStructure().catch(err => {
  console.error('错误:', err.message);
  process.exit(1);
});
