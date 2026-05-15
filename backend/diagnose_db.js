const mysql = require('mysql2/promise');

async function diagnoseDB() {
  console.log('=== 数据库连接测试 ===');
  
  try {
    // 尝试连接数据库
    const conn = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'root',
      database: 'safety_system'
    });
    
    console.log('✅ 数据库连接成功\n');
    
    // 1. 检查 users 表结构
    console.log('=== users 表结构 ===');
    const [columns] = await conn.query('DESCRIBE users');
    for (const col of columns) {
      console.log(`  ${col.Field} | ${col.Type} | ${col.Null} | ${col.Key}`);
    }
    
    // 2. 检查是否有 department 字段
    const hasDepartment = columns.some(c => c.Field === 'department');
    const hasDepartmentId = columns.some(c => c.Field === 'department_id');
    const hasRole = columns.some(c => c.Field === 'role');
    const hasRoleId = columns.some(c => c.Field === 'role_id');
    
    console.log('\n=== 字段存在性检查 ===');
    console.log(`  department 字段: ${hasDepartment ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`  department_id 字段: ${hasDepartmentId ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`  role 字段: ${hasRole ? '✅ 存在' : '❌ 不存在'}`);
    console.log(`  role_id 字段: ${hasRoleId ? '✅ 存在' : '❌ 不存在'}`);
    
    // 3. 采样数据
    console.log('\n=== users 表采样数据 (前3条) ===');
    const [rows] = await conn.query('SELECT * FROM users LIMIT 3');
    for (const row of rows) {
      console.log(`  ID=${row.id}, username=${row.username}, department=${row.department || 'NULL'}, department_id=${row.department_id || 'NULL'}, role=${row.role || 'NULL'}, role_id=${row.role_id || 'NULL'}`);
    }
    
    // 4. 检查所有表
    console.log('\n=== 数据库所有表 ===');
    const [tables] = await conn.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    }
    
    await conn.end();
    console.log('\n✅ 诊断完成！');
    
  } catch (err) {
    console.error('❌ 错误:', err.message);
    process.exit(1);
  }
}

diagnoseDB();
