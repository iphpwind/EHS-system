# EHS-system - 安全生产管理系统

[![Node.js Version](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Vue Version](https://img.shields.io/badge/Vue-3.4+-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 项目简介

**EHS-system** 是一套完整的**安全生产管理系统（工业互联网平台）**，

系统涵盖**隐患排查、作业票管理、培训教育、应急管理、安全办公、实时预警**等核心业务模块，适用于企业安全生产数字化管理。

---

## 🏗️ 技术架构

### 前端技术栈
| 模块 | 技术栈 | 说明 |
|------|---------|------|
| **PC 前端** | Vue 3 + Element Plus + TypeScript | 企业管理后台 |
| **H5 移动端** | Vue 3 + Vant + TypeScript | 移动办公、现场作业 |
| **状态管理** | Vuex 4 | 全局状态管理 |
| **构建工具** | Vite 5 | 快速热更新 |
| **图表** | ECharts 5 | 数据可视化 |
| **PWA** | Service Worker | 离线访问、添加到桌面 |

### 后端技术栈
| 模块 | 技术栈 | 说明 |
|------|---------|------|
| **运行环境** | Node.js 20+ | JavaScript 运行时 |
| **框架** | Express 4 + TypeScript | Web 应用框架 |
| **数据库** | MySQL 8.0 | 关系型数据库 |
| **身份认证** | JWT + bcrypt | Token 认证 |
| **实时通信** | Server-Sent Events (SSE) | 实时预警推送 |
| **PDF 生成** | PDFKit | 报告导出 |
| **二维码** | QRCode | 设备标识 |
| **进程守护** | PM2 | 生产环境进程管理 |

### 部署架构
```
[ 用户浏览器 ]     [ Nginx 1.15.11 (端口 80) ]
       |                        |
       |--- PC 前端 -----------|-->/ (静态文件)
       |--- H5 移动端 ---------|-->/h5/ (静态文件)
       |--- API 请求 -----------|-->/api/ --> [ Node.js 后端 (端口 3001) ]
                                       |
                                       |---> [ MySQL 8.0 数据库 ]
```

---

## 📁 目录结构

```
EHS-system/
├── backend/                # 后端服务 (Node.js + TypeScript)
│   ├── src/
│   │   ├── app.ts               # 应用入口
│   │   ├── config/             # 配置文件（数据库、JWT等）
│   │   ├── controllers/        # 控制器（63个路由模块）
│   │   │   ├── authController.ts
│   │   │   ├── hotWorkController.ts
│   │   │   ├── hazardController.ts
│   │   │   └── ... (共63个)
│   │   ├── middleware/         # 中间件（认证、权限、日志）
│   │   ├── routes/            # 路由定义
│   │   ├── schema/            # 数据库表结构（Knex）
│   │   ├── services/          # 业务逻辑层
│   │   ├── types/             # TypeScript 类型定义
│   │   └── utils/             # 工具函数（PDF、SSE、调度器）
│   ├── package.json
│   └── tsconfig.json
│
├── frontend-new/           # PC 前端 (Vue 3 + Element Plus)
│   ├── src/
│   │   ├── api/                # API 封装（358个接口）
│   │   ├── assets/             # 静态资源
│   │   ├── components/         # 公共组件
│   │   ├── layout/             # 布局组件
│   │   ├── router/             # 路由配置
│   │   ├── store/              # Vuex 状态管理
│   │   ├── utils/              # 工具函数
│   │   └── views/              # 页面组件（456个）
│   │       ├── dashboard/      # 首页仪表盘
│   │       ├── hazard/         # 隐患管理
│   │       ├── workticket/      # 作业票管理
│   │       ├── training/       # 培训教育
│   │       ├── emergency/      # 应急管理
│   │       ├── system/         # 系统管理（RBAC）
│   │       └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── frontend-h5/            # H5 移动端 (Vue 3 + Vant)
│   ├── src/
│   │   ├── api/                # API 封装
│   │   ├── views/              # 页面组件
│   │   │   ├── Home.vue       # 首页
│   │   │   ├── Login.vue      # 登录
│   │   │   ├── Hazards/       # 隐患上报
│   │   │   ├── WorkTicket/    # 作业票
│   │   │   └── Training/      # 培训学习
│   │   ├── router/
│   │   └── store/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
├── WWW/                    # Nginx 静态资源目录
│   ├── h5/                # H5 构建产物
│   ├── static/            # 公共静态资源
│   └── index.html         # PC 前端入口
│
├── logs/                   # 系统日志
├── start-all-services.bat  # 一键启动脚本
├── PROJECT_KNOWLEDGE.md   # 项目知识库（详细文档）
└── README.md
```

---

## 🚀 快速开始

### 环境要求

| 软件 | 版本要求 | 说明 |
|------|----------|------|
| Node.js | ≥ 20.0.0 | JavaScript 运行时 |
| MySQL | 8.0+ | 数据库 |
| Nginx | 1.15+ | Web 服务器 |
| npm | ≥ 10.0.0 | 包管理器 |

### 1. 克隆项目

```bash
git clone https://github.com/yourusername/EHS-system.git
cd EHS-system
```

### 2. 配置数据库

```sql
-- 创建数据库
CREATE DATABASE safety_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 导入初始数据（如有）
-- mysql -u root -p safety_system < database/init.sql
```

### 3. 配置后端环境变量

创建 `backend/.env` 文件：

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=safety_system
JWT_SECRET=your_jwt_secret_key
PORT=3001
```

### 4. 安装依赖

```bash
# 后端
cd backend
npm install

# PC 前端
cd ../frontend-new
npm install

# H5 前端
cd ../frontend-h5
npm install
```

### 5. 构建并启动服务

**方式一：使用一键启动脚本（Windows）**

```bash
.\start-all-services.bat
```

**方式二：手动启动（推荐生产环境使用 PM2）**

```bash
# 启动后端
cd backend
npm run build
pm2 start dist/app.js --name safety-backend

# 构建 PC 前端
cd ../frontend-new
npm run build:prod

# 构建 H5 前端
cd ../frontend-h5
npm run build

# 配置 Nginx（参考 PROJECT_KNOWLEDGE.md）
```

### 6. 访问系统

| 模块 | 地址 | 说明 |
|------|------|------|
| **PC 前端** | http://localhost | 企业管理后台 |
| **H5 移动端** | http://localhost/h5/ | 移动办公 |
| **后端 API** | http://localhost:3001/api | RESTful API |
| **健康检查** | http://localhost:3001/api/health | 服务状态 |

**默认管理员账号：**
- 用户名：`admin`
- 密码：`admin123`

---

## 🧩 功能模块

### 1. 登录认证
- [x] 用户名/密码登录
- [x] JWT Token 认证
- [x] 图形验证码
- [x] 密码加密（bcrypt）
- [x] 登录日志审计

### 2. 隐患管理
- [x] 隐患上报（支持图片上传）
- [x] 隐患整改（整改通知、期限设置）
- [x] 整改验收（验收报告、签字确认）
- [x] 隐患统计分析（图表展示）

### 3. 作业票管理（7 类作业票）
- [x] **动火作业** - 热工作业许可
- [x] **受限空间** - 有限空间作业
- [x] **高处作业** - 高空作业许可
- [x] **吊装作业** - 起重作业许可
- [x] **动土作业** - 土方作业许可
- [x] **断路作业** - 道路断路许可
- [x] **盲板抽堵** - 管道作业许可
- 功能：申请 → 审批 → 作业 → 验收 → 签字

### 4. 培训教育
- [x] 培训计划制定
- [x] 在线学习（视频、文档）
- [x] 在线考试（题库、自动评分）
- [x] 证书管理（到期提醒）

### 5. 应急管理
- [x] 应急预案管理
- [x] 应急物资管理
- [x] 应急演练记录
- [x] 事故管理

### 6. 基础档案
- [x] 公司信息管理
- [x] 部门管理
- [x] 员工管理
- [x] 化学品管理（MSDS）
- [x] 设备管理
- [x] 区域/位置管理

### 7. 安全办公
- [x] 安全考核
- [x] 安全目标
- [x] 安全会议
- [x] 安全知识库
- [x] 安全投入管理

### 8. 报表统计
- [x] 隐患统计报表
- [x] 作业票统计
- [x] 培训统计
- [x] 趋势分析图表

### 9. 实时预警（SSE）
- [x] 隐患逾期提醒
- [x] 作业票到期提醒
- [x] 培训证书到期提醒
- [x] 设备维护提醒

### 10. 风险提示
- [x] 天气预警
- [x] 作业风险提醒

### 11. RBAC 权限管理
- [x] 用户管理
- [x] 角色管理
- [x] 菜单权限
- [x] 数据权限

### 12. PDF 生成
- [x] 隐患报告 PDF
- [x] 作业票 PDF
- [x] 签字确认 PDF

### 13. 二维码生成
- [x] 设备二维码
- [x] 巡检二维码

---

## 📊 数据库设计

**数据库名：** `safety_system`

**核心数据表（63 张）：**

| 分类 | 表数量 | 说明 |
|------|--------|------|
| 系统管理 | 8 张 | 用户、角色、菜单、部门、字典等 |
| 隐患管理 | 5 张 | 隐患、整改、验收、等级等 |
| 作业票 | 14 张 | 7类作业票申请/验收表 |
| 培训教育 | 6 张 | 培训计划、课程、考试、证书等 |
| 应急管理 | 3 张 | 预案、物资、演练等 |
| 基础档案 | 8 张 | 公司、部门、员工、设备等 |
| 安全办公 | 5 张 | 考核、目标、会议、知识库等 |
| 日志审计 | 3 张 | 登录日志、操作日志等 |
| 其他 | 11 张 |  configurable config、风险提示等 |

**详细表结构见：** `PROJECT_KNOWLEDGE.md`

---

## 🔧 开发指南

### 后端开发

```bash
cd backend
npm install
npm run dev  # 开发模式（热更新）
```

### PC 前端开发

```bash
cd frontend-new
npm install
npm run dev  # 启动开发服务器（默认端口 5173）
```

### H5 前端开发

```bash
cd frontend-h5
npm install
npm run dev  # 启动开发服务器（默认端口 5174）
```

---

## 📦 生产部署

### 1. 构建前端

```bash
# PC 前端
cd frontend-new
node --max-old-space-size=4096 node_modules/.bin/vite build --mode production

# H5 前端
cd ../frontend-h5
node --max-old-space-size=4096 node_modules/.bin/vite build --mode production
```

### 2. 构建后端

```bash
cd backend
npm run build
```

### 3. 使用 PM2 守护进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd backend
pm2 start dist/app.js --name safety-backend

# 保存进程列表
pm2 save

# 设置开机自启
pm2 startup
```

### 4. 配置 Nginx

```nginx
server {
    listen 80;
    server_name localhost;

    # PC 前端
    location / {
        root D:/phpstudy_pro/safety-system/WWW;
        try_files $uri $uri/ /index.html;
    }

    # H5 移动端
    location /h5 {
        alias D:/phpstudy_pro/safety-system/WWW/h5;
        try_files $uri $uri/ /h5/index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Authorization $http_authorization;
        proxy_pass_header Authorization;
    }
}
```

---

## 🐛 常见问题

### 1. 浏览器空白 + 401 死循环

**原因：** localStorage 中过期的 token 未清除

**解决：**
- 按 F12 → Application → Local Storage → 清除 `token`
- 或访问 http://localhost/#/login 重新登录

### 2. 后端进程自动停止

**原因：** 未捕获的异常导致进程崩溃

**解决：**
- 使用 PM2 守护进程（已配置全局异常处理）
- 查看日志：`pm2 logs safety-backend`

### 3. H5 页面 401 跳转错误

**正确跳转路径：** `window.location.replace('/h5/#/login')`（H5 部署在 `/h5/` 路径下）

### 4. PC 页面 401 跳转错误

**正确跳转路径：** `location.href = '/login'`（非 `/index`）

---

## 📄 许可证

MIT License

---

## 👨‍💻 作者

**开发者：** [Your Name]
**联系方式：** [your.email@example.com]

---

## 🙏 致谢

- 参考系统：
- 技术栈：Vue 3、Element Plus、Vant、Node.js、Express、TypeScript

---

## 📞 支持

如有问题，请提交 [Issue](https://github.com/yourusername/EHS-system/issues) 或联系开发者。

---

**⭐ 如果这个项目对你有帮助，请给个 Star！**
