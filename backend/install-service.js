const Service = require('node-windows').Service;

const svc = new Service({
  name: 'SafetySystemBackend',
  description: '安全生产管理系统后端API服务 (Node.js)',
  script: 'D:/phpstudy_pro/safety-system/backend/dist/app.js',
  nodeOptions: ['--max-old-space-size=2048'],
  env: [
    { name: 'NODE_ENV', value: 'production' }
  ],
  maxRetries: 3,
  maxRestarts: 5,
  wait: 2,
  grow: 0.5,
});

svc.on('install', () => {
  console.log('✅ 服务安装成功：SafetySystemBackend');
  svc.start();
});

svc.on('start', () => {
  console.log('✅ 服务已启动');
  process.exit(0);
});

svc.on('alreadyinstalled', () => {
  console.log('⚠️ 服务已存在，先卸载再重新安装...');
  svc.uninstall();
  setTimeout(() => svc.install(), 3000);
});

svc.on('uninstall', () => {
  console.log('✅ 旧服务已卸载，正在重新安装...');
});

svc.on('error', (err) => {
  console.error('❌ 错误:', err.message || err);
  process.exit(1);
});

console.log('正在安装 Windows 服务：SafetySystemBackend ...');
svc.install();
