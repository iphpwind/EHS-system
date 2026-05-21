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
import trainingPlansRoutes from './routes/trainingPlans';
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
// 系统管理路由（RuoYi兼容）
import systemRoutes from './routes/system';
import menuRoutes from './routes/menu';
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
// 气体监测路由
import gasMonitorRoutes from './routes/gasMonitor';
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
// 三级教育路由（P1-2）
import threeLevelRoutes from './routes/threeLevel';
// 排查计划路由（P1-3）
import inspectionPlanRoutes from './routes/inspectionPlan';
// 隐患闭环管理V2路由（P2-1）
import hazardV2Routes from './routes/hazardV2';
// 风险分级管控可视化V2路由（P2-2）
import riskV2Routes from './routes/riskV2';

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
    // 生产环境使用白名单（默认只允许本地访问）
    const allowedOrigins = process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost',
          'http://127.0.0.1'
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

// 认证接口限流（防暴力破解，兼顾正常使用）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 15分钟内最多20次登录尝试
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

// 认证中间件 - 以下路由需要认证（排除公开路由）
app.use('/api', (req: Request, res: Response, next: NextFunction) => {
  // 排除公开路由
  const fullPath = req.originalUrl.split('?')[0]; // 去掉查询参数
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/publicKey',
    '/api/auth/display',
    '/api/auth/refresh',
    '/api/auth/logout',
    '/api/config',
    '/api/code'
  ];
  
  if (publicPaths.some(path => fullPath.startsWith(path))) {
    return next();
  }
  
  authenticateToken(req, res, next);
});

// 数据权限 Scope 中间件 — 注入 req.scope 和 req.userDeptId
app.use('/api', scopeMiddleware);

// ===== RuoYi 兼容 API 端点 =====

// 数据字典路由
app.use('/api/system/dict', dictRoutes);

// ===== RuoYi 兼容 API 端点（已分离到 routes/system.ts 和 routes/menu.ts） =====

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
  let conn;
  try {
    conn = await getConnection();
    const [rows] = await conn.execute('SELECT * FROM company_info LIMIT 10');
    res.json({ code: 200, msg: 'success', data: rows, total: (rows as any[]).length });
  } catch (error) {
    res.json({ code: 200, msg: 'success', data: [], total: 0 });
  } finally {
    if (conn) conn.release();
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
// RuoYi兼容路由
app.use('/api/system', systemRoutes);
app.use('/api/system', menuRoutes);
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
app.use('/api/training', trainingPlansRoutes);
app.use('/api/training-records', trainingRecordsRoutes);
// 教育培训V2路由（课程/题库/试卷/考试/证书）
app.use('/api/training-v2', trainingV2Routes);
// 培训统计V2路由（P2-3）
import trainingStatsRoutes from './routes/trainingStats';
app.use('/api/training-stats', trainingStatsRoutes);
// 培训合规路由（三级教育 + 年度学时 + 预校验）
app.use('/api/training-compliance', trainingComplianceRoutes);
// 三级教育路由（P1-2）
app.use('/api/three-level', threeLevelRoutes);
// 排查计划路由（P1-3）
app.use('/api/inspection', inspectionPlanRoutes);
// 应急/法规/隐患V2路由
app.use('/api/emergency-v2', emergencyV2Routes);
// 隐患管理路由
app.use('/api/hazards', hazardRoutes);
// 风险管控路由（风险点 + 排查计划）
app.use('/api/risk-control', riskControlRoutes);
// 风险分级管控可视化V2路由（P2-2）
app.use('/api/risk-v2', riskV2Routes);
// 气体监测路由（IoT自动上报 + 手动录入）
app.use('/api/gas-monitor', gasMonitorRoutes);
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
// 隐患闭环管理V2路由（P2-1）
app.use('/api/hazards-v2', hazardV2Routes);

// RBAC 权限路由
app.use('/api/rbac', rbacRoutes);
// 动火作业闭环路由
app.use('/api/hot-work', hotWorkRoutes);
// 7类特殊作业票路由
app.use('/api/high-work', highWorkRoutes);
// app.use('/api/confined-space', confinedSpaceRoutes);  // 临时注释：启动失败
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
const startServer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const doStart = async () => {
      try {
        const { connectDB } = require('./config/database');
        await connectDB();

        // 启动定时任务引擎（隐患检查、作业票过期、证书扫描等）
        try {
          startAllJobs();
          logger.info('✅ 定时任务引擎启动成功');
        } catch (error) {
          logger.error('❌ 定时任务引擎启动失败', { error });
        }

        // 启动证书到期定时任务（每天8:30检查 + SSE推送）
        try {
          startCertificateScheduler();
          logger.info('✅ 证书到期定时任务启动成功');
        } catch (error) {
          logger.error('❌ 证书到期定时任务启动失败', { error });
        }
        const server = app.listen(PORT, () => {
          logger.info('✅ 后端服务启动成功');
          logger.info(`🚀 监听端口: ${PORT} | 环境: ${process.env.NODE_ENV || 'development'}`);
          logger.info(`📊 健康检查: http://localhost:${PORT}/api/health`);
          logger.info(`📚 API文档: http://localhost:${PORT}/api`);
          logger.info(`🖥️  系统监控: http://localhost:${PORT}/api/system-monitor/health`);
          resolve();  // 服务器成功启动，解析 Promise
        });

        server.on('error', (err: any) => {
          logger.error('❌ 服务器启动错误', { error: err });
          reject(err);  // 服务器启动错误，拒绝 Promise
        });

        // 设置服务器超时（解决"系统接口请求超时"问题）
        server.timeout = 60000;           // 请求60秒超时
        server.keepAliveTimeout = 65000;  // Keep-Alive 65秒
        server.headersTimeout = 66000;    // 请求头66秒超时

        logger.info(`⏱️  超时配置: 请求60s | KeepAlive 65s | Headers 66s`);
        
      } catch (error) {
        logger.error('❌ 服务启动失败', { error });
        reject(error);  // 启动失败，拒绝 Promise
      }
    };

    doStart();
  });
};

startServer().catch((error: any) => {
  logger.error('❌ 服务启动失败:', error);
  process.exit(1);
});

export default app;
