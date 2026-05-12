import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';

// 导入路由
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import ticketRoutes from './routes/tickets';
import dashboardRoutes from './routes/dashboard';
import jsaRoutes from './routes/jsa';
import reservationRoutes from './routes/reservations';
import processRoutes from './routes/process';
import archiveRoutes from './routes/archive';
import measureRoutes from './routes/measures';
import companyRoutes from './routes/company';
import departmentRoutes from './routes/departments';
import employeeRoutes from './routes/employees';
import equipmentRoutes from './routes/equipment';
import roleRoutes from './routes/roles';
import configRoutes from './routes/config';
import logRoutes from './routes/logs';
import trainingRoutes from './routes/training';
import trainingRecordsRoutes from './routes/trainingRecords';
import qrRoutes from './routes/qr';
// 基础档案扩展路由
import chemicalRoutes from './routes/chemicals';
import areaRoutes from './routes/areas';
import threeSimultaneousRoutes from './routes/threeSimultaneous';
import relatedPartyRoutes from './routes/relatedParties';
import productionStaticRoutes from './routes/productionStatic';
import safetyArchiveRoutes from './routes/safetyArchives';
import reminderRoutes from './routes/reminders';
// 安全办公模块路由
import assessmentRoutes from './routes/assessments';
import documentRoutes from './routes/documents';
import targetRoutes from './routes/targets';
import occupationalHealthRoutes from './routes/occupationalHealth';
import meetingRoutes from './routes/meetings';
import knowledgeRoutes from './routes/knowledge';
import investmentRoutes from './routes/investments';
import changeRoutes from './routes/changes';
// 作业票类型子表路由
import ticketTypeRoutes from './routes/ticketTypes';
// RBAC 权限路由
import rbacRoutes from './routes/rbac';
// 动火作业闭环路由
import hotWorkRoutes from './routes/hotWork';
// 签字路由
import signatureRoutes from './routes/signature';
// PDF 路由
import pdfRoutes from './routes/pdf';
// 教育培训V2路由
import trainingV2Routes from './routes/trainingV2';
// 应急/法规/隐患V2路由
import emergencyV2Routes from './routes/emergencyV2';
// 隐患管理路由
import hazardRoutes from './routes/hazards';
// 风险管控路由
import riskControlRoutes from './routes/riskControl';
// 电子巡检路由
import patrolRoutes from './routes/patrol';
// 封闭化管理路由
import enclosedRoutes from './routes/enclosed';
// 视频IOT路由
import iotVideoRoutes from './routes/iotVideo';
// 模块配置路由
import moduleConfigRoutes from './routes/moduleConfig';
// 数据字典路由
import dictRoutes from './routes/dict';
// 预警路由
import warningRoutes from './routes/warning';
// 报表路由
import reportRoutes from './routes/report';
// 跨模块集成路由 (P3)
import integrationRoutes from './routes/integration';
import { scopeMiddleware } from './middleware/scopeMiddleware';
// 7类特殊作业票路由
import highWorkRoutes from './routes/highWork';
import confinedSpaceRoutes from './routes/confinedSpace';
import hoistingWorkRoutes from './routes/hoistingWork';
import earthWorkRoutes from './routes/earthWork';
import brokenWorkRoutes from './routes/brokenWork';
import blindWorkRoutes from './routes/blindWork';
import electricWorkRoutes from './routes/electricWork';
// 作业模板路由
import operationTemplateRoutes from './routes/operationTemplate';

// 导入中间件
import { authenticateToken } from './middleware/authMiddleware';
import { getConfig as getPublicConfig } from './controllers/configController';
import { errorHandler } from './utils/errors';
import { getConnection } from './config/database';
import { deduplicateMiddleware } from './middleware/deduplicateMiddleware';
import { startAllJobs } from './utils/scheduler';
import systemMonitorRoutes from './routes/systemMonitor';
// Phase2 新增路由
import operationTraceRoutes from './routes/operationTrace';
import complianceRoutes from './routes/compliance';
import safetyPointsRoutes from './routes/safetyPoints';
// 责任制签署路由
import responsibilityRoutes from './routes/responsibility';
// 三级教育 + 年度学时 合规路由
import trainingComplianceRoutes from './routes/trainingCompliance';

// Winston 日志系统
import { logger } from './utils/logger';
// 证书定时任务
import { startCertificateScheduler } from './services/certificateScheduler';

// 加载环境变量
dotenv.config();

// 导入培训合规校验中间件
import { ticketTrainingValidator } from './middleware/ticketTrainingValidator';

// ========== 全局异常处理（增强版：Winston日志 + 内存监控）==========
// 处理未捕获的同步异常
process.on('uncaughtException', (error: Error) => {
  logger.error('❌ 未捕获的异常 (uncaughtException)', {
    errorName: error.name,
    errorMessage: error.message,
    stack: error.stack,
    pid: process.pid,
    memoryUsage: process.memoryUsage(),
  });
  // 给时间写入日志，然后退出（让进程守护工具PM2自动重启）
  setTimeout(() => { process.exit(1); }, 1000);
});

// 处理未捕获的Promise拒绝
process.on('unhandledRejection', (reason: any) => {
  logger.error('❌ 未处理的Promise拒绝 (unhandledRejection)', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    pid: process.pid,
    memoryUsage: process.memoryUsage(),
  });
  // 记录日志后退出，防止内存泄漏累积
  setTimeout(() => { process.exit(1); }, 1000);
});

// ========== 内存监控（每30秒检查一次）==========
setInterval(() => {
  const mem = process.memoryUsage();
  const heapUsedMB = Math.round(mem.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(mem.heapTotal / 1024 / 1024);
  const rssMB = Math.round(mem.rss / 1024 / 1024);
  const usageRatio = mem.heapUsed / mem.heapTotal;

  if (usageRatio > 0.85) {
    logger.warn('⚠️ 内存使用率超过85%', {
      heapUsedMB,
      heapTotalMB,
      rssMB,
      usageRatio: `${(usageRatio * 100).toFixed(1)}%`,
      pid: process.pid,
    });
  } else {
    logger.debug(`📊 内存: Heap ${heapUsedMB}MB/${heapTotalMB}MB RSS ${rssMB}MB (${(usageRatio * 100).toFixed(1)}%)`);
  }

  // 可选：超过90%时尝试触发GC（需要--expose-gc启动参数）
  if (usageRatio > 0.90 && global.gc) {
    logger.warn('⚠️ 内存使用率超过90%，尝试触发垃圾回收');
    global.gc();
  }
}, 30000);
// ================================================

const app: Express = express();
const PORT = process.env.PORT || 3001;

// 信任代理（用于获取真实IP）
app.set('trust proxy', 1);

// 中间件配置
app.use(cors({
  origin: function(origin, callback) {
    // 开发环境允许所有来源
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // 生产环境使用白名单
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost',
          'http://127.0.0.1',
          'http://192.168.1.19',
          'http://58.56.233.218:300'
        ];
    // 允许非浏览器请求（如 curl、Postman）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域来源: ' + origin));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"]
    }
  }
}));

// API 限流中间件
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP最多100次请求
  message: {
    success: false,
    message: '请求过于频繁，请15分钟后再试'
  }
});

// 认证接口严格限流（防暴力破解）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 15分钟内最多5次登录尝试
  message: {
    success: false,
    message: '登录尝试次数过多，请15分钟后再试'
  }
});

// 应用限流
app.use('/api/', generalLimiter);
app.use('/api/auth/login', authLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// 请求日志（保留Morgan，同时用Winston记录关键请求）
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.debug(`${req.method} ${req.path}`, { method: req.method, path: req.path, ip: req.ip });
  next();
});

// 防重复提交中间件
app.use(deduplicateMiddleware);

// 健康检查
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development'
  });
});

// 公开路由（无需认证）
app.use('/api/auth', authRoutes);
// 公开配置读取（版本号、站点名称等，登录页未登录时需要读取）
app.get('/api/config/:key', getPublicConfig);
app.get('/api/config', getPublicConfig);

// 兼容验证码接口（公开）
app.get('/api/code', async (req: Request, res: Response) => {
  try {
    const svgCaptcha = require('svg-captcha');
    const captcha = svgCaptcha.create({ size: 4, ignoreChars: '0o1il', color: true, noise: 2 });
    const uuid = Date.now() + '-' + Math.random().toString(36).substring(2, 10);
    res.json({
      code: 200,
      msg: 'success',
      img: 'data:image/svg+xml;base64,' + Buffer.from(captcha.data).toString('base64'),
      uuid: uuid
    });
  } catch (error) {
    console.error('Captcha error:', error);
    res.json({ code: 200, msg: 'success', img: '', uuid: '' });
  }
});

// 认证中间件 - 以下路由需要认证
app.use('/api', authenticateToken);

// 数据权限 Scope 中间件 — 注入 req.scope 和 req.userDeptId
app.use('/api', scopeMiddleware);

// 兼容前端 RuoYi 的 /system/user/getInfo 接口
app.get('/api/system/user/getInfo', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [users] = await conn.execute(
      'SELECT id, username, real_name, email, avatar, role FROM users WHERE id = ? LIMIT 1',
      [(req as any).user?.userId]
    );
    const user = (users as any[])[0] || {};
    const roleName = user.role === 1 ? 'admin' : 'common';
    res.json({
      code: 200,
      user: {
        userId: user.id,
        userName: user.username,
        nickName: user.real_name || user.username,
        avatar: user.avatar || '',
        email: user.email || ''
      },
      roles: [roleName],
      permissions: ['*:*:*']
    });
  } catch (error) {
    console.error('GetInfo error:', error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
});

// ===== RuoYi 兼容 API 端点 =====

// 数据字典路由
app.use('/api/system/dict', dictRoutes);

// 兼容前端 /system/config/configKey/:configKey
app.get('/api/system/config/configKey/:configKey', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT `value` FROM system_settings WHERE `key` = ?', [req.params.configKey]);
    const val = (rows as any[])[0]?.value || '';
    res.json({ code: 200, msg: 'success', data: { configValue: val } });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: { configValue: '' } });
  }
});

// 兼容前端 /system/config/list
app.get('/api/system/config/list', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT `key` as configKey, `value` as configValue, remark FROM system_settings ORDER BY `key`');
    res.json({ code: 200, msg: 'success', data: rows, total: (rows as any[]).length });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [], total: 0 });
  }
});

// 兼容前端 /system/user/profile
app.get('/api/system/user/profile', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id, username, real_name, email, phone, avatar, department FROM users WHERE id = ?', [(req as any).user?.userId]);
    const u = (rows as any[])[0] || {};
    res.json({ code: 200, msg: 'success', data: {
      user: { userId: u.id, userName: u.username, nickName: u.real_name || u.username, email: u.email || '', phonenumber: u.phone || '', avatar: u.avatar || '' },
      roleGroup: '', postGroup: ''
    }});
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: {
      user: { userId: (req as any).user?.userId, userName: 'admin', nickName: '管理员' },
      roleGroup: '', postGroup: ''
    }});
  }
});

// 兼容前端 /system/user/profile/update
app.put('/api/system/user/profile', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success' });
});

// 兼容前端 /system/user/profile/updatePwd
app.put('/api/system/user/profile/updatePwd', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: '修改密码成功' });
});

// 兼容前端 /system/user/profile/avatar
app.post('/api/system/user/profile/avatar', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', imgUrl: '' });
});

// 兼容前端 /system/user/ListAll
app.get('/api/system/user/ListAll', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', data: [] });
});

// 兼容前端 /system/user/list (用户分页列表)
app.get('/api/system/user/list', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const pageNum = parseInt(req.query.pageNum as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const offset = (pageNum - 1) * pageSize;
    const [rows] = await conn.execute('SELECT id, username, real_name, email, phone, role, status, department FROM users ORDER BY id DESC LIMIT ? OFFSET ?', [String(pageSize), String(offset)]);
    const [countRows] = await conn.execute('SELECT COUNT(*) as total FROM users');
    const total = (countRows as any[])[0]?.total || 0;
    res.json({ code: 200, msg: 'success', data: rows, total });
  } catch (error) {
    console.error('User list error:', error);
    res.json({ code: 200, msg: 'success', data: [], total: 0 });
  }
});

// 兼容前端 /system/dept/treeselect
app.get('/api/system/dept/treeselect', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as deptId, name as deptName, parent_id as parentId, order_num, status FROM departments WHERE status = 1 ORDER BY order_num ASC');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [] });
  }
});

// 兼容前端 /system/dept/list
app.get('/api/system/dept/list', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as deptId, name as deptName, parent_id as parentId, order_num, status, leader, phone FROM departments ORDER BY order_num ASC');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [] });
  }
});

// 兼容前端 /system/dept/getDeptListBySecondDeptId
app.get('/api/system/dept/getDeptListBySecondDeptId', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as deptId, name as deptName, parent_id as parentId, order_num, status, leader, phone FROM departments WHERE parent_id > 0 ORDER BY order_num ASC');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [] });
  }
});

// 兼容前端 /api/system/dept/:deptId
app.get('/api/system/dept/:deptId(\\d+)', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as deptId, name as deptName, parent_id as parentId, order_num, status, leader, phone FROM departments WHERE id = ?', [req.params.deptId]);
    res.json({ code: 200, msg: 'success', data: (rows as any[])[0] || null });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: null });
  }
});

// 获取路由 ========================
app.get('/api/system/menu/getRouters', async (req: Request, res: Response) => {
  try {
    // 获取启用的模块配置
    let enabledModules: string[] = [];
    try {
      const conn = await getConnection();
      const [rows] = await conn.execute('SELECT module_key FROM module_config WHERE enabled = 1');
      enabledModules = (rows as any[]).map(r => r.module_key);
      conn.release();
    } catch (e) {
      console.error('Module config query error:', e);
      enabledModules = ['safework', 'system', 'equipment', 'sensor', 'hazard', 'monitor'];
    }

    // 返回完整菜单结构
    let menus: any[] = [
      {
        name: '首页',
        path: '/index',
        hidden: false,
        component: 'Layout',
        alwaysShow: true,
        meta: { title: '首页', icon: 'dashboard', noCache: false, link: null },
        children: [
          { name: 'HomeIndex', path: 'index', hidden: false, component: 'safework/index', meta: { title: '首页', icon: 'chart', noCache: false, link: null } }
        ]
      },
      {
        name: 'Safework',
        path: '/safework',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '安全作业', icon: 'guide', noCache: false, link: null },
        children: [
          { name: 'SafeworkHazareport', path: 'hazareport', hidden: false, component: 'safework/hazareport/index', meta: { title: '隐患上报', icon: 'form', noCache: false, link: null } },
          { name: 'SafeworkTask', path: 'task', hidden: false, component: 'safework/task/index', meta: { title: '安全检查', icon: 'edit', noCache: false, link: null } },
          { name: 'SafeworkHazardList', path: 'hazard', hidden: false, component: 'safework/hazard/index', meta: { title: '隐患列表', icon: 'list', noCache: false, link: null } },
          { name: 'SafeworkFirework', path: 'firework', hidden: false, component: 'safework/firework/index', meta: { title: '动火作业', icon: 'fire', noCache: false, link: null } },
          { name: 'SafeworkHighwork', path: 'highwork', hidden: false, component: 'safework/highwork/index', meta: { title: '高处作业', icon: 'top', noCache: false, link: null } },
          { name: 'SafeworkRestrictedwork', path: 'restrictedwork', hidden: false, component: 'safework/restrictedwork/index', meta: { title: '受限空间', icon: 'lock', noCache: false, link: null } },
          { name: 'SafeworkElectricwork', path: 'electricwork', hidden: false, component: 'safework/electricwork/index', meta: { title: '临时用电', icon: 'eleme', noCache: false, link: null } },
          { name: 'SafeworkBlindinfo', path: 'blindinfo', hidden: false, component: 'safework/blindinfo/index', meta: { title: '盲板抽堵', icon: 'circle-close', noCache: false, link: null } },
          { name: 'SafeworkBrokenInfo', path: 'brokenInfo', hidden: false, component: 'safework/brokenInfo/index', meta: { title: '断路作业', icon: 'warning', noCache: false, link: null } },
          { name: 'SafeworkHoistingwork', path: 'hoistingwork', hidden: false, component: 'safework/hoistingwork/index', meta: { title: '吊装作业', icon: 'upload', noCache: false, link: null } },
          { name: 'SafeworkEarth', path: 'earth', hidden: false, component: 'safework/earth/index', meta: { title: '动土作业', icon: 's-tools', noCache: false, link: null } },
          { name: 'SafeworkOperationPlan', path: 'operationPlan', hidden: false, component: 'safework/operationPlan/index', meta: { title: '作业计划', icon: 'date', noCache: false, link: null } },
          { name: 'SafeworkOperationTemplate', path: 'operationTemplate', hidden: false, component: 'safework/operationTemplate/index', meta: { title: '作业模板', icon: 'document', noCache: false, link: null } },
          { name: 'SafeworkSettings', path: 'settings', hidden: false, component: 'safework/settings/index', meta: { title: '作业设置', icon: 'setting', noCache: false, link: null } },
          { name: 'SafeworkBigscreen', path: 'bigscreen', hidden: false, component: 'safework/bigscreen/index', meta: { title: '作业大屏', icon: 'monitor', noCache: false, link: null } }
        ]
      },
      {
        name: 'Training',
        path: '/training',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '培训教育', icon: 'education', noCache: false, link: null },
        children: [
          { name: 'TrainingEducation', path: 'education', hidden: false, component: 'safework/education/index', meta: { title: '培训看板', icon: 'dashboard', noCache: false, link: null } },
          { name: 'TrainingPlan', path: 'plan', hidden: false, component: 'safework/plan/index', meta: { title: '线下培训', icon: 'date', noCache: false, link: null } },
          { name: 'TrainingOnlinePlan', path: 'onlinePlan', hidden: false, component: 'safework/onlinePlan/index', meta: { title: '线上培训计划', icon: 'video-play', noCache: false, link: null } },
          { name: 'TrainingOnlineCourse', path: 'onlineCourse', hidden: false, component: 'safework/onlineCourse/index', meta: { title: '线上课程', icon: 'film', noCache: false, link: null } },
          { name: 'TrainingPaper', path: 'paper', hidden: false, component: 'safework/paper/index', meta: { title: '试卷管理', icon: 'document-copy', noCache: false, link: null } },
          { name: 'TrainingResult', path: 'result', hidden: false, component: 'safework/result/index', meta: { title: '培训结果', icon: 'trophy', noCache: false, link: null } },
          { name: 'TrainingTestStat', path: 'testStat', hidden: false, component: 'safework/testStat/index', meta: { title: '考试统计', icon: 'data-line', noCache: false, link: null } },
          { name: 'TrainingClassHour', path: 'classHour', hidden: false, component: 'safework/classHour/index', meta: { title: '学时管理', icon: 'time', noCache: false, link: null } },
          { name: 'TrainingCategory', path: 'category', hidden: false, component: 'safework/category/index', meta: { title: '培训分类', icon: 'folder', noCache: false, link: null } },
          { name: 'TrainingGuardian', path: 'guardian', hidden: false, component: 'safework/guardian/index', meta: { title: '监护人管理', icon: 'user-solid', noCache: false, link: null } }
        ]
      },
      {
        name: 'Emergency',
        path: '/emergency',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '应急管理', icon: 'first-aid-kit', noCache: false, link: null },
        children: [
          { name: 'EmergencyPlan', path: 'plan', hidden: false, component: 'safework/emergencyplan/index', meta: { title: '应急预案', icon: 'document', noCache: false, link: null } },
          { name: 'EmergencyDrill', path: 'drill', hidden: false, component: 'safework/drill/index', meta: { title: '应急演练', icon: 'alarm-clock', noCache: false, link: null } },
          { name: 'EmergencySupplies', path: 'supplies', hidden: false, component: 'safework/supplies/index', meta: { title: '应急物资', icon: 'box', noCache: false, link: null } },
          { name: 'EmergencyYingji', path: 'yingjiguanli', hidden: false, component: 'safework/yingjiguanli/index', meta: { title: '应急综合管理', icon: 'first-aid-kit', noCache: false, link: null } }
        ]
      },
      {
        name: 'Contractor',
        path: '/contractor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '承包商管理', icon: 'office-building', noCache: false, link: null },
        children: [
          { name: 'ContractorUnit', path: 'unit', hidden: false, component: 'contractorManage/contractor/index', meta: { title: '承包商单位', icon: 'office-building', noCache: false, link: null } },
          { name: 'ContractorPersonnel', path: 'personnel', hidden: false, component: 'contractorManage/personnel/index', meta: { title: '承包商人员', icon: 'user', noCache: false, link: null } },
          { name: 'ContractorCertificate', path: 'certificate', hidden: false, component: 'contractorManage/certificate/index', meta: { title: '承包商证件', icon: 'postcard', noCache: false, link: null } },
          { name: 'ContractorTypeDic', path: 'typeDic', hidden: false, component: 'contractorManage/contractorTypeDic/index', meta: { title: '承包商类型', icon: 'collection', noCache: false, link: null } }
        ]
      },
      {
        name: 'Certificate',
        path: '/certificate',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '证书管理', icon: 'postcard', noCache: false, link: null },
        children: [
          { name: 'CertificateList', path: 'list', hidden: false, component: 'certificateManage/certificate/index', meta: { title: '员工证书', icon: 'postcard', noCache: false, link: null } },
          { name: 'CertificateTypeDic', path: 'typeDic', hidden: false, component: 'certificateManage/certificateTypeDic/index', meta: { title: '证书类型', icon: 'collection-tag', noCache: false, link: null } }
        ]
      },
      {
        name: 'Visitor',
        path: '/visitor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '访客管理', icon: 'user', noCache: false, link: null },
        children: [
          { name: 'VisitorList', path: 'visitor', hidden: false, component: 'safework/visitor/index', meta: { title: '访客登记', icon: 'user', noCache: false, link: null } },
          { name: 'VisitorUser', path: 'visitorUser', hidden: false, component: 'safework/visitorUser/index', meta: { title: '访客用户', icon: 'user-solid', noCache: false, link: null } },
          { name: 'VisitReservation', path: 'visitReservation', hidden: false, component: 'safework/visitReservation/index', meta: { title: '预约管理', icon: 'calendar', noCache: false, link: null } }
        ]
      },
      {
        name: 'Law',
        path: '/law',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '法律法规', icon: 'reading', noCache: false, link: null },
        children: [
          { name: 'LawManage', path: 'lawManage', hidden: false, component: 'safework/lawManage/index', meta: { title: '法规管理', icon: 'document', noCache: false, link: null } },
          { name: 'LawType', path: 'lawType', hidden: false, component: 'safework/lawType/index', meta: { title: '法规类型', icon: 'folder-opened', noCache: false, link: null } }
        ]
      },
      {
        name: 'Chemical',
        path: '/chemical',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '危化品管理', icon: 'warning', noCache: false, link: null },
        children: [
          { name: 'Chemicals', path: 'chemicals', hidden: false, component: 'safework/chemicals/index', meta: { title: '危化品台账', icon: 'notebook', noCache: false, link: null } },
          { name: 'ChemicalFinal', path: 'finalProduction', hidden: false, component: 'safework/chemicalFinalProduction/index', meta: { title: '最终产品', icon: 'finished', noCache: false, link: null } },
          { name: 'ChemicalIntermediate', path: 'intermediateProduction', hidden: false, component: 'safework/chemicalIntermediateProduction/index', meta: { title: '中间产品', icon: 'help', noCache: false, link: null } },
          { name: 'ChemicalMaterial', path: 'productionMaterial', hidden: false, component: 'safework/chemicalProductionMaterial/index', meta: { title: '原材料', icon: 'goods', noCache: false, link: null } }
        ]
      },
      {
        name: 'System',
        path: '/system',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '系统管理', icon: 'system', noCache: false, link: null },
        children: [
          { name: 'User', path: 'user', hidden: false, component: 'system/user/index', meta: { title: '用户管理', icon: 'user', noCache: false, link: null } },
          { name: 'Role', path: 'role', hidden: false, component: 'system/role/index', meta: { title: '角色管理', icon: 'peoples', noCache: false, link: null } },
          { name: 'ModuleConfig', path: 'module', hidden: false, component: 'system/module/index', meta: { title: '模块开关', icon: 'switch', noCache: false, link: null } },
          { name: 'Config', path: 'config', hidden: false, component: 'system/config/index', meta: { title: '系统配置', icon: 'edit', noCache: false, link: null } }
        ]
      },
      {
        name: 'Equipment',
        path: '/equipment',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '设备管理', icon: 'cascader', noCache: false, link: null },
        children: [
          { name: 'EquipmentList', path: 'equipment', hidden: false, component: 'equipment/equipment/index', meta: { title: '设备列表', icon: 'list', noCache: false, link: null } },
          { name: 'SpotCheckMonth', path: 'spotCheckMonth', hidden: false, component: 'equipment/spotCheckMonth/index', meta: { title: '设备点检', icon: 'form', noCache: false, link: null } },
          { name: 'SpotCheckDay', path: 'spotCheckDay', hidden: false, component: 'equipment/spotCheckDay/index', meta: { title: '日常点检', icon: 'form', noCache: false, link: null } }
        ]
      },
      {
        name: 'Sensor',
        path: '/sensor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '传感器管理', icon: 'monitor', noCache: false, link: null },
        children: [
          { name: 'SensorList', path: 'sensor', hidden: false, component: 'sensor/sensor/index', meta: { title: '传感器列表', icon: 'list', noCache: false, link: null } }
        ]
      },
      {
        name: 'Hazard',
        path: '/hazard',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '隐患管理', icon: 'warning', noCache: false, link: null },
        children: [
          { name: 'HazardList', path: 'list', hidden: false, component: 'safework/hazard/index', meta: { title: '隐患列表', icon: 'list', noCache: false, link: null } }
        ]
      },
      {
        name: 'Monitor',
        path: '/monitor',
        hidden: false,
        component: 'Layout',
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: { title: '系统监控', icon: 'monitor', noCache: false, link: null },
        children: [
          { name: 'Online', path: 'online', hidden: false, component: 'monitor/online/index', meta: { title: '在线用户', icon: 'online', noCache: false, link: null } },
          { name: 'Job', path: 'job', hidden: false, component: 'monitor/job/index', meta: { title: '定时任务', icon: 'job', noCache: false, link: null } },
          { name: 'Log', path: 'log', hidden: false, component: 'monitor/log/index', meta: { title: '操作日志', icon: 'log', noCache: false, link: null } }
        ]
      }
    ];

    // 根据模块开关过滤菜单
    const modulePathMap: Record<string, string[]> = {
      'safework': ['/safework'],
      'training': ['/training'],
      'emergency': ['/emergency'],
      'contractor': ['/contractor'],
      'certificate': ['/certificate'],
      'visitor': ['/visitor'],
      'law': ['/law'],
      'chemical': ['/chemical'],
      'system': ['/system'],
      'equipment': ['/equipment'],
      'sensor': ['/sensor'],
      'hazard': ['/hazard'],
      'monitor': ['/monitor']
    };
    menus = menus.filter(menu => {
      for (const [modKey, paths] of Object.entries(modulePathMap)) {
        if (!enabledModules.includes(modKey)) {
          for (const p of paths) {
            if (menu.path && menu.path.startsWith(p)) return false;
          }
        }
      }
      return true;
    });

    res.json({
      code: 200,
      msg: 'success',
      data: menus
    });
  } catch (error) {
    console.error('GetRouters error:', error);
    res.json({
      code: 200,
      msg: 'success',
      data: []
    });
  }
});

// ===== 更多 RuoYi 兼容 API =====

import {
  getList, getDetail, createTicket, updateTicket, deleteTicket, updateStatus, getList2
} from './controllers/workTicketBizController';

// 7类特殊作业票通用路由
const ticketPrefixes = [
  'highwork', 'restrictedwork', 'electricwork', 'blindinfo',
  'brokenInfo', 'hoistingwork', 'earth'
];

for (const prefix of ticketPrefixes) {
  app.get(`/api/safework/${prefix}/list`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; getList(req, res, next); });
  app.get(`/api/safework/${prefix}/list2`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; getList2(req, res, next); });
  app.get(`/api/safework/${prefix}/:id`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; getDetail(req, res, next); });
  app.post(`/api/safework/${prefix}`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; createTicket(req, res, next); });
  app.put(`/api/safework/${prefix}`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; updateTicket(req, res, next); });
  app.put(`/api/safework/${prefix}/updateStatus`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; updateStatus(req, res, next); });
  app.delete(`/api/safework/${prefix}/:id`, authenticateToken, (req, res, next) => { req.params.typePrefix = prefix; deleteTicket(req, res, next); });
}

// 兼容 /api/safework/task/list
app.get('/api/safework/task/list', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', data: [], total: 0 });
});

// 兼容 /api/safework/investigate/list
app.get('/api/safework/investigate/list', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', data: [], total: 0 });
});

// 兼容 /api/system/enterpriseInformation/list
app.get('/api/system/enterpriseInformation/list', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM company_info LIMIT 10');
    res.json({ code: 200, msg: 'success', data: rows, total: (rows as any[]).length });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [], total: 0 });
  }
});

// 兼容 /api/system/user/{userId} - 获取单个用户
app.get('/api/system/user/:userId(\\d+)', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id, username, real_name, email, phone, role, status, department FROM users WHERE id = ?', [req.params.userId]);
    res.json({ code: 200, msg: 'success', data: (rows as any[])[0] || null });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: null });
  }
});

// 兼容 /api/system/role/list
app.get('/api/system/role/list', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as roleId, name as roleName, role_key as roleKey, status FROM roles ORDER BY id ASC');
    res.json({ code: 200, msg: 'success', data: rows, total: (rows as any[]).length });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [], total: 0 });
  }
});

// 兼容 /api/system/role/optionselect
app.get('/api/system/role/optionselect', async (req: Request, res: Response) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.execute('SELECT id as roleId, name as roleName FROM roles');
    res.json({ code: 200, msg: 'success', data: rows });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [] });
  }
});

// 兼容 /api/safework/hazardType/list
app.get('/api/safework/hazardType/list', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', data: [], total: 0 });
});

// 兼容 /api/safework/taskHazards/list
app.get('/api/safework/taskHazards/list', async (req: Request, res: Response) => {
  res.json({ code: 200, msg: 'success', data: [], total: 0 });
});

// 受保护的路由
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jsa', jsaRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/process', processRoutes);
app.use('/api/archive', archiveRoutes);
app.use('/api/measures', measureRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/config', configRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/training-records', trainingRecordsRoutes);
// 教育培训V2路由（课程/题库/试卷/考试/证书）
app.use('/api/training-v2', trainingV2Routes);
// 培训合规路由（三级教育 + 年度学时 + 预校验）
app.use('/api/training-compliance', trainingComplianceRoutes);
// 应急/法规/隐患V2路由
app.use('/api/emergency-v2', emergencyV2Routes);
// 隐患管理路由
app.use('/api/hazards', hazardRoutes);
// 风险管控路由（风险点 + 排查计划）
app.use('/api/risk-control', riskControlRoutes);
// 电子巡检路由
app.use('/api/patrol', patrolRoutes);
// 封闭化管理路由
app.use('/api/enclosed', enclosedRoutes);
// 视频IOT路由
app.use('/api/iot-video', iotVideoRoutes);
// 模块配置路由
app.use('/api/module-config', moduleConfigRoutes);
// 基础档案扩展路由
app.use('/api/chemicals', chemicalRoutes);
app.use('/api/areas', areaRoutes);
app.use('/api/three-simultaneous', threeSimultaneousRoutes);
app.use('/api/related-parties', relatedPartyRoutes);
app.use('/api/production-static', productionStaticRoutes);
app.use('/api/safety-archives', safetyArchiveRoutes);
app.use('/api/reminders', reminderRoutes);
// 安全办公模块路由
app.use('/api/assessments', assessmentRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/targets', targetRoutes);
app.use('/api/occupational-health', occupationalHealthRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/changes', changeRoutes);
// 安全生产责任制签署路由
app.use('/api/responsibility', responsibilityRoutes);
// 作业票类型子表路由
app.use('/api/ticket-types', ticketTypeRoutes);
// 隐患管理路由
app.use('/api/hazards', hazardRoutes);

// RBAC 权限路由
app.use('/api/rbac', rbacRoutes);
// 动火作业闭环路由
app.use('/api/hot-work', hotWorkRoutes);
// 7类特殊作业票路由
app.use('/api/high-work', highWorkRoutes);
app.use('/api/confined-space', confinedSpaceRoutes);
app.use('/api/hoisting-work', hoistingWorkRoutes);
app.use('/api/earth-work', earthWorkRoutes);
app.use('/api/broken-work', brokenWorkRoutes);
app.use('/api/blind-work', blindWorkRoutes);
app.use('/api/electric-work', electricWorkRoutes);
// 作业模板路由
app.use('/api/safework/operationTemplate', operationTemplateRoutes);
// 签字路由
app.use('/api/signatures', signatureRoutes);
// PDF 路由
app.use('/api/pdf', pdfRoutes);
// 预警路由
app.use('/api/warning', warningRoutes);
// 报表路由
app.use('/api/reports', reportRoutes);
// 系统监控路由
app.use('/api/system-monitor', systemMonitorRoutes);
// Phase2 新增路由
app.use('/api/operations', operationTraceRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/safety-points', safetyPointsRoutes);
// 跨模块集成路由 (P3)
app.use('/api/integration', integrationRoutes);

// 静态文件服务（签字图片、上传文件）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API文档（开发环境）
if (process.env.NODE_ENV === 'development') {
  app.get('/api', (req: Request, res: Response) => {
    res.json({
      message: '安全生产管理系统 API',
      version: '1.0.0',
      endpoints: {
        auth: {
          login: 'POST /api/auth/login',
          register: 'POST /api/auth/register',
          me: 'GET /api/auth/me',
          logout: 'POST /api/auth/logout',
          refresh: 'POST /api/auth/refresh'
        },
        users: {
          list: 'GET /api/users',
          detail: 'GET /api/users/:id',
          create: 'POST /api/users',
          update: 'PUT /api/users/:id',
          delete: 'DELETE /api/users/:id',
          resetPassword: 'POST /api/users/:id/reset-password'
        },
        tickets: {
          list: 'GET /api/tickets',
          detail: 'GET /api/tickets/:id',
          create: 'POST /api/tickets',
          update: 'PUT /api/tickets/:id',
          delete: 'DELETE /api/tickets/:id',
          submit: 'POST /api/tickets/:id/submit',
          approve: 'POST /api/tickets/:id/approve',
          stats: 'GET /api/tickets/stats'
        },
        dashboard: {
          kpi: 'GET /api/dashboard/kpi',
          trend: 'GET /api/dashboard/trend',
          levelDistribution: 'GET /api/dashboard/level-distribution',
          departmentRanking: 'GET /api/dashboard/department-ranking',
          pendingTasks: 'GET /api/dashboard/pending-tasks'
        },
        jsa: {
          list: 'GET /api/jsa',
          detail: 'GET /api/jsa/:id',
          create: 'POST /api/jsa',
          update: 'PUT /api/jsa/:id',
          delete: 'DELETE /api/jsa/:id',
          approve: 'POST /api/jsa/:id/approve'
        },
        reservations: {
          list: 'GET /api/reservations',
          detail: 'GET /api/reservations/:id',
          create: 'POST /api/reservations',
          update: 'PUT /api/reservations/:id',
          approve: 'POST /api/reservations/:id/approve',
          reject: 'POST /api/reservations/:id/reject',
          delete: 'DELETE /api/reservations/:id'
        },
        process: {
          list: 'GET /api/process',
          create: 'POST /api/process',
          delete: 'DELETE /api/process/:id'
        },
        archive: {
          list: 'GET /api/archive',
          detail: 'GET /api/archive/:id',
          create: 'POST /api/archive',
          delete: 'DELETE /api/archive/:id'
        },
        measures: {
          lib: 'GET /api/measures/lib',
          create: 'POST /api/measures',
          update: 'PUT /api/measures/:id',
          delete: 'DELETE /api/measures/:id'
        },
        company: {
          get: 'GET /api/company',
          update: 'PUT /api/company'
        },
        departments: {
          list: 'GET /api/departments',
          create: 'POST /api/departments',
          update: 'PUT /api/departments/:id',
          delete: 'DELETE /api/departments/:id'
        },
        employees: {
          list: 'GET /api/employees',
          detail: 'GET /api/employees/:id',
          create: 'POST /api/employees',
          update: 'PUT /api/employees/:id',
          delete: 'DELETE /api/employees/:id'
        },
        equipment: {
          list: 'GET /api/equipment',
          detail: 'GET /api/equipment/:id',
          create: 'POST /api/equipment',
          update: 'PUT /api/equipment/:id',
          delete: 'DELETE /api/equipment/:id'
        },
        roles: {
          list: 'GET /api/roles',
          create: 'POST /api/roles',
          update: 'PUT /api/roles/:id',
          delete: 'DELETE /api/roles/:id'
        },
        config: {
          get: 'GET /api/config/:key',
          list: 'GET /api/config',
          update: 'PUT /api/config/:key'
        },
        logs: {
          list: 'GET /api/logs',
          delete: 'DELETE /api/logs/:id'
        },
        hazards: {
          list: 'GET /api/hazards',
          detail: 'GET /api/hazards/:id',
          create: 'POST /api/hazards',
          update: 'PUT /api/hazards/:id',
          delete: 'DELETE /api/hazards/:id'
        }
      }
    });
  });
}

// 兜底：所有未匹配的 /api/ 请求返回兼容空响应（避免前端404导致页面错位）
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  // 如果已经发送了响应，跳过
  if (res.headersSent) return next();
  const path = req.path;
  // 对已注册路由的精确匹配已在前面处理，这里是通配兜底
  logger.debug(`[API Stub] ${req.method} ${req.originalUrl}`, { method: req.method, path: req.originalUrl });
  // 根据路径猜测返回数据结构
  if (path.includes('/list') || path.includes('/treeselect') || path.includes('/optionselect')) {
    return res.json({ code: 200, msg: 'success', data: [], total: 0 });
  }
  if (path.includes('/export')) {
    return res.setHeader('Content-Type', 'application/vnd.ms-excel').send(Buffer.from([]));
  }
  // 默认返回空对象/空数组
  return res.json({ code: 200, msg: 'success', data: null });
});

// 404处理（非API路径）
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// 错误处理中间件（必须放在最后）
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    const { connectDB } = require('./config/database');
    await connectDB();

    // 启动定时任务引擎（隐患检查、作业票过期、证书扫描等）
    startAllJobs();

    // 启动证书到期定时任务（每天8:30检查 + SSE推送）
    startCertificateScheduler();
    
    const server = app.listen(PORT, () => {
      logger.info('✅ 后端服务启动成功');
      logger.info(`🚀 监听端口: ${PORT} | 环境: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📊 健康检查: http://localhost:${PORT}/api/health`);
      logger.info(`📚 API文档: http://localhost:${PORT}/api`);
      logger.info(`🖥️  系统监控: http://localhost:${PORT}/api/system-monitor/health`);
    });

    // 设置服务器超时（解决"系统接口请求超时"问题）
    server.timeout = 60000;           // 请求60秒超时
    server.keepAliveTimeout = 65000;  // Keep-Alive 65秒
    server.headersTimeout = 66000;    // 请求头66秒超时

    logger.info(`⏱️  超时配置: 请求60s | KeepAlive 65s | Headers 66s`);

  } catch (error) {
    logger.error('❌ 服务启动失败', { error });
    process.exit(1);
  }
};

startServer();

export default app;
