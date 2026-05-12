# 安全生产管理系统 - 快速启动指南

## 环境要求

- Node.js 20.x（已下载：`D:\phpstudy_pro\node-v20.11.1-x64.msi`）
- MySQL 8.0.12（PHPStudy 中切换）
- Nginx 1.15.11（PHPStudy 自带）
- Redis（可选，用于缓存）

## 安装步骤

### 1. 安装 Node.js

双击运行已下载的安装包：
```
D:\phpstudy_pro\node-v20.11.1-x64.msi
```

安装后验证：
```bash
node -v
npm -v
```

### 2. 切换 MySQL 到 8.0.12

1. 打开 PHPStudy 控制面板
2. 点击 `数据库` → `MySQL` → `切换版本`
3. 选择 `MySQL8.0.12`
4. 重启 MySQL 服务

### 3. 导入数据库 Schema

```bash
cd D:\phpstudy_pro\safety-system\backend
npm run init-db
```

或者手动导入：
```bash
mysql -u root -proot safety_system < backend\src\schema\init_db.sql
mysql -u root -proot safety_system < backend\src\schema\supplemental.sql
```

### 4. 安装依赖

**后端：**
```bash
cd D:\phpstudy_pro\safety-system\backend
npm install
```

**前端 PC：**
```bash
cd D:\phpstudy_pro\safety-system\frontend-new
npm install
```

**前端 H5：**
```bash
cd D:\phpstudy_pro\safety-system\frontend-h5
npm install
```

## 启动服务

### 方法一：一键启动（推荐）

双击运行：
```
D:\phpstudy_pro\safety-system\start-all-services.bat
```

### 方法二：手动启动

**1. 启动后端（端口 3001）：**
```bash
cd D:\phpstudy_pro\safety-system\backend
npm run dev
```

**2. 构建前端 PC（输出到 WWW）：**
```bash
cd D:\phpstudy_pro\safety-system\frontend-new
npm run build:prod
```

**3. 启动 Nginx（端口 80）：**
- 打开 PHPStudy 控制面板
- 点击 `启动` Nginx 服务
- 或者命令行：
  ```bash
  D:\phpstudy_pro\Extensions\Nginx1.15.11\nginx.exe
  ```

**4. 启动 H5 前端（端口 3002，可选）：**
```bash
cd D:\phpstudy_pro\safety-system\frontend-h5
npm run dev
```

## 访问地址

| 服务 | 地址 | 说明 |
|------|------|------|
| PC 端 | http://192.168.1.19 | 通过 Nginx 反向代理访问 |
| H5 端 | http://192.168.1.19:3002 | 移动端访问 |
| 后端 API | http://192.168.1.19:3001 | 直接访问后端 |
| 健康检查 | http://192.168.1.19:3001/api/health | API 状态检查 |

## 默认账号

- 用户名：`admin`
- 密码：`admin123`

## 功能模块

### 已完成

- ✅ 登录模块（PC + H5）
- ✅ 隐患管理（上报、整改、验收）
- ✅ 作业票管理（7类特殊作业）
- ✅ 培训教育管理
- ✅ 应急管理
- ✅ 报表统计
- ✅ 实时预警（SSE 推送）
- ✅ 风险智能提示
- ✅ H5 移动端（PWA 支持）

### 待完善

- ⏳ 证书管理完整流程
- ⏳ 设备点检移动端
- ⏳ 离线模式数据同步

## 常见问题

### 1. 登录报 404 错误

**原因**：Nginx 反向代理未生效

**解决**：
1. 检查 Nginx 是否启动
2. 查看 `D:\phpstudy_pro\Extensions\Nginx1.15.11\conf\vhosts\0localhost_80.conf` 配置
3. 确保包含：
   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:3001;
   }
   ```

### 2. 数据库连不上

**原因**：MySQL 版本或密码错误

**解决**：
1. 确认 MySQL 已切换到 8.0.12
2. 检查 `backend\.env` 文件中的数据库配置
3. 默认密码：`root`

### 3. H5 端无法访问

**原因**：端口被占用或 Node.js 未安装

**解决**：
1. 检查 Node.js 是否安装：`node -v`
2. 检查端口 3002 是否被占用：`netstat -ano | findstr :3002`
3. 修改 `frontend-h5\vite.config.js` 中的端口配置

## 项目结构

```
safety-system/
├── backend/           # 后端（Node.js + Express + TypeScript）
│   ├── src/
│   │   ├── controllers/   # 控制器（54个）
│   │   ├── routes/        # 路由（48个）
│   │   ├── schema/        # 数据库 Schema
│   │   └── app.ts        # 入口文件
│   └── package.json
├── frontend-new/      # PC 前端（Vue 3 + Element Plus）
│   ├── src/
│   │   ├── views/        # 页面组件（500+）
│   │   ├── api/          # API 封装
│   │   └── router/       # 路由配置
│   └── package.json
├── frontend-h5/      # H5 前端（Vue 3 + Vant）
│   ├── src/
│   │   ├── views/        # 移动端页面
│   │   ├── api/          # API 封装
│   │   └── router/       # 路由配置
│   └── package.json
└── start-all-services.bat  # 一键启动脚本
```

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Vue 3 + Composition API + TypeScript |
| UI 组件库（PC） | Element Plus |
| UI 组件库（H5） | Vant |
| 后端框架 | Node.js + Express 4.x |
| 数据库 | MySQL 8.0 |
| 图表库 | ECharts 5 |
| 状态管理 | Vuex 4 |
| 实时推送 | Server-Sent Events (SSE) |

## 开发指南

### 后端开发

```bash
cd D:\phpstudy_pro\safety-system\backend
npm run dev  # 使用 nodemon 热重载
```

### 前端 PC 开发

```bash
cd D:\phpstudy_pro\safety-system\frontend-new
npm run dev  # Vite 热重载，端口 5173
```

### 前端 H5 开发

```bash
cd D:\phpstudy_pro\safety-system\frontend-h5
npm run dev  # Vite 热重载，端口 3002
```

## 生产部署

### 1. 构建前端 PC

```bash
cd D:\phpstudy_pro\safety-system\frontend-new
npm run build:prod  # 输出到 D:/phpstudy_pro/WWW
```

### 2. 启动后端（生产模式）

```bash
cd D:\phpstudy_pro\safety-system\backend
npm run start:prod  # 使用 PM2 守护进程
```

### 3. 配置 Nginx 反向代理

确保 `D:\phpstudy_pro\Extensions\Nginx1.15.11\conf\vhosts\0localhost_80.conf` 包含：
```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

### 4. 启动 Nginx

打开 PHPStudy 控制面板，启动 Nginx 服务。

## API 文档

启动后端后，访问：
```
http://192.168.1.19:3001/api
```

## 预警系统

### SSE 连接端点

```
GET /api/warning/sse
```

### 预警类型

- `ticket_expiring` - 作业票即将到期
- `hazard_overdue` - 隐患整改逾期
- `cert_expiring` - 证书即将过期

## 报表统计

### 隐患统计

```
GET /api/reports/hazard?startDate=2026-01-01&endDate=2026-12-31
```

### 作业票统计

```
GET /api/reports/work-permits?startDate=2026-01-01&endDate=2026-12-31
```

### 培训统计

```
GET /api/reports/training?startDate=2026-01-01&endDate=2026-12-31
```

## 风险提示

```
GET /api/reports/risk-tips
```

返回当前用户的个性化风险提示。

## 维护命令

### 查看后端日志

```bash
type D:\phpstudy_pro\safety-system\backend\logs\*.log
```

### 重启 Nginx

```bash
D:\phpstudy_pro\Extensions\Nginx1.15.11\nginx.exe -s reload
```

### 重启后端

```bash
# 如果使用 PM2
pm2 restart safety-system
```

## 联系方式

- 技术支持：聚通科技
- 版本：v1.0.0
- 更新日期：2026-05-10
