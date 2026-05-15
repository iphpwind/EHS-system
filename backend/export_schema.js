const mysql = require('mysql2/promise');

async function exportSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'safety_system'
  });

  // 获取所有表
  const [tables] = await connection.query(
    "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'safety_system'"
  );

  let result = '# 数据库表结构 - safety_system\n\n';

  for (const table of tables) {
    const tableName = table.TABLE_NAME;
    result += `## 表: ${tableName}\n\n`;
    
    // 获取表的字段信息
    const [columns] = await connection.query(
      `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, COLUMN_KEY, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS 
       WHERE TABLE_SCHEMA = 'safety_system' AND TABLE_NAME = ?
       ORDER BY ORDINAL_POSITION`,
      [tableName]
    );

    result += '| 字段名 | 类型 | 允许NULL | 默认值 | 键 | 额外 |\n';
    result += '|--------|------|----------|---------|-----|------|\n';
    
    for (const col of columns) {
      result += `| ${col.COLUMN_NAME} | ${col.DATA_TYPE} | ${col.IS_NULLABLE} | ${col.COLUMN_DEFAULT || 'NULL'} | ${col.COLUMN_KEY} | ${col.EXTRA} |\n`;
    }
    result += '\n';
  }

  await connection.end();
  
  require('fs').writeFileSync('D:/phpstudy_pro/db_schema_complete.md', result, 'utf8');
  console.log('数据库结构已导出到 D:/phpstudy_pro/db_schema_complete.md');
}

exportSchema().catch(console.error);
