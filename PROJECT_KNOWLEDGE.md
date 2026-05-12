# 安全生产管理系统 - 项目知识库

> **最后更新**: 2026-05-11  
> **目的**: 记录构建部署规范、常见陷阱、关键配置差异，避免重复踩坑。

---

## 一、服务架构

| 服务 | 端口 | 技术栈 | 启动命令 |
|------|------|--------|---------|
| 后端 API | 3001 | Node.js + Express + TypeScript | `cd backend && npm run dev` |
| PC 前端 (生产) | 通过 Nginx:80 | Vue3 + Element Plus + Vite | `cd frontend-new && npm run build:prod` |
| H5 移动端 (生产) | 通过 Nginx:80/h5/ | Vue3 + Vant + Vite | `cd frontend-h5 && npm run build` |
| Nginx | 80 | 反向代理 | 自动启动 |

---

## 二、关键配置差异（⚠️ 最易出错）

### 2.1 API 前缀

| 前端 | 开发环境前缀 | 生产环境前缀 | 配置文件 |
|------|------------|------------|---------|
| **PC (frontend-new)** | `/dev-api` | `/api` | `.env.development` / `.env.production` |
| **H5 (frontend-h5)** | `/api` | `/api` | `src/api/request.js` (硬编码) |

> **⚠️ PC 前端构建必须用 `npm run build:prod`**，否则会用 `/dev-api` 前缀导致生产环境 404。

### 2.2 登录 Token 字段名

| 前端 | 后端返回 | 前端读取方式 |
|------|---------|------------|
| 后端接口 | `res.data.access_token` | - |
| PC 前端 | - | `res.data.access_token` |
| **H5 前端** | - | **`res.data.access_token`**（之前 bug 版本写的是 `res.data.token`） |

> **⚠️ 登录后看 `access_token` 不是 `token`**！这是之前导致 401 的根本原因。

### 2.3 验证码接口

| 项目 | 正确路径 |
|------|---------|
| 后端路由 | `GET /api/code` |
| **错误路径** | ~~`/auth/captcha`~~（不存在） |

---

## 三、构建部署规范

### 3.1 H5 移动端

```bash
# 1. 编辑源码后
cd D:\phpstudy_pro\safety-system\frontend-h5

# 2. 【重要】先清理旧 dist
rmdir /s /q dist

# 3. 构建
npm run build

# 4. 清理并部署到 WWW
rmdir /s /q D:\phpstudy_pro\WWW\h5
xcopy /E /Y dist\* D:\phpstudy_pro\WWW\h5\
```

### 3.2 PC 前端

```bash
# 1. 编辑源码后
cd D:\phpstudy_pro\safety-system\frontend-new

# 2. 【重要】先清理旧 dist
rmdir /s /q dist

# 3. 构建（必须用 build:prod）
npm run build:prod

# 4. 清理并部署到 WWW
del /q D:\phpstudy_pro\WWW\index.html
rmdir /s /q D:\phpstudy_pro\WWW\assets
xcopy /E /Y dist\* D:\phpstudy_pro\WWW\
```

### 3.3 完整重启流程

```bash
# 停后端
taskkill /F /IM node.exe

# 重启后端
cd D:\phpstudy_pro\safety-system\backend
npm run dev

# 构建两前端（按上述步骤）
# Nginx 一般不需要重启（reload 即可）
```

---

## 四、常见问题速查

| 症状 | 可能原因 | 解决方案 |
|------|---------|---------|
| 页面白屏 + 401 | 浏览器 localStorage 有过期 token | 打开 F12 → Application → 清除 localStorage → 刷新 |
| 页面白屏 + 401 | H5 Login 中用了 `res.data.token` | 检查 `Login.vue` 读取 `res.data.access_token` |
| 页面白屏 + 401 | PC 构建用了 `/dev-api` 前缀 | 确认用 `npm run build:prod` |
| 登录报 404 | 验证码路径错误 | 确认 `/code` 不是 `/auth/captcha` |
| 后端启动失败 | PowerShell 执行策略阻止 npx | 用 `cmd` 启动而不是 PowerShell |
| PC 构建内存溢出 | Vite 构建吃太多内存 | 关闭其他程序重试 |
| Nginx 代理不通 | `/api/` 路径未代理到 3001 | 检查 `conf/vhosts/0localhost_80.conf` |
| H5 页面显示旧代码 | 旧构建文件未清理 | 先删除 dist + WWW/h5 再构建 |

---

## 五、Nginx 配置要点

**文件**: `D:\phpstudy_pro\Extensions\Nginx1.15.11\conf\vhosts\0localhost_80.conf`

- `/api/` → `proxy_pass http://127.0.0.1:3001`（后端 API）
- `/dev-api/` → `proxy_pass http://127.0.0.1:3001`（兼容开发）
- `/` → `root D:/phpstudy_pro/WWW`（PC 前端 SPA）
- `try_files $uri $uri/ /index.html`（Vue Router history 模式）

---

## 六、关键文件清单

| 文件 | 作用 | 注意事项 |
|------|------|---------|
| `frontend-h5/src/views/Login.vue` | H5 登录页 | 读取 `access_token` |
| `frontend-h5/src/api/request.js` | H5 请求封装 | baseURL=`/api`, 401拦截 |
| `frontend-h5/src/api/auth.js` | H5 认证 API | logout 仅清本地无后端调用 |
| `frontend-new/.env.production` | PC 生产环境变量 | `VITE_APP_BASE_API = '/api'` |
| `frontend-new/.env.development` | PC 开发环境变量 | `VITE_APP_BASE_API = '/dev-api'` |
| `backend/src/app.ts` | 后端入口 | 端口3001、数据库连接 |

---

## 七、浏览器排查口诀

1. **F12 看 Network**：找到 401 请求，看是哪个 API
2. **F12 看 Application → Local Storage**：token 是否存在、是否过期
3. **清除 localStorage + 硬刷新**（Ctrl+Shift+R）：排除缓存问题
4. **看 Console**：JS 报错会提示具体原因
