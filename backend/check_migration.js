const mysql = require('mysql2/promise');
(async () => {
  const pool = await mysql.createPool({ host: 'localhost', port: 3306, user: 'root', password: 'root', database: 'safety_system' });
  const [tables] = await pool.query("SHOW TABLES LIKE 'three_level_%'");
  console.log('三级教育表:', tables.map(x => Object.values(x)[0]));
  const [cols] = await pool.query("SHOW COLUMNS FROM training_records LIKE 'credit_hours'");
  console.log('credit_hours列:', cols.length > 0 ? '已创建' : '未创建');
  const [tpls] = await pool.query('SELECT id,name,level,required_hours FROM three_level_templates');
  console.log('默认模板:', tpls.map(t => `${t.level}=${t.name}(需${t.required_hours}学时)`));
  await pool.end();
})();
