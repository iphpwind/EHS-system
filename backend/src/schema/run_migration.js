const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, 'rbac_and_hotwork.sql'), 'utf8');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'safety_system',
    multipleStatements: true
  });
  await conn.query(sql);
  console.log('✅ 数据库迁移执行成功');
  await conn.end();
})().catch(err => {
  console.error('❌ 迁移失败:', err.message);
  process.exit(1);
});
