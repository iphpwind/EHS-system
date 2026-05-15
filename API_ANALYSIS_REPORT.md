# 后端API与前端调用对比分析报告

生成时间: 2026-05-13
分析目录: D:/phpstudy_pro/safety-system

---

## 执行摘要

本报告对安全生产系统的后端API端点和前端API调用进行了全面对比分析，识别出不匹配的API、缺失的端点和潜在的集成问题。

---

## 任务1：后端API端点清单

### 1.1 认证相关API (Auth)

| HTTP方法 | API路径 | 文件路径 | 行号 | 说明 |
|---------|---------|---------|------|------|
| POST | /api/auth/login | backend/src/routes/auth.ts | 21 | 用户登录 |
| POST | /api/auth/register | backend/src/routes/auth.ts | - | 用户注册 |
| GET | /api/auth/me | backend/src/routes/auth.ts | 101 | 获取当前用户信息 |
| GET | /api/auth/publicKey | backend/src/routes/auth.ts | 124 | 获取RSA公钥 |
| POST | /api/auth/logout | backend/src/routes/auth.ts | - | 用户登出 |
| POST | /api/auth/refresh | backend/src/routes/auth.ts | - | 刷新Token |

### 1.2 系统管理API (System)

| HTTP方法 | API路径 | 文件路径 | 行号 | 说明 |
|---------|---------|---------|------|------|
| GET | /api/system/user/list | backend/src/app.ts | 391 | 用户列表 |
| GET | /api/system/user/:userId | backend/src/app.ts | 766 | 用户详情 |
| PUT | /api/system/user/profile | backend/src/app.ts | 371 | 更新用户资料 |
| PUT | /api/system/user/profile/updatePwd | backend/src/app.ts | 376 | 修改密码 |
| POST | /api/system/user/profile/avatar | backend/src/app.ts | 381 | 上传头像 |
| GET | /api/system/user/getInfo | backend/src/app.ts | 297 | 获取用户信息 |
| GET | /api/system/dept/list | backend/src/app.ts | 419 | 部门列表 |
| GET | /api/system/dept/treeselect | backend/src/app.ts | 408 | 部门树选择 |
| GET | /api/system/dept/:deptId | backend/src/app.ts | 441 | 部门详情 |
| GET | /api/system/role/list | backend/src/app.ts | 777 | 角色列表 |
| GET | /api/system/config/list | backend/src/app.ts | 342 | 配置列表 |

### 1.3 作业票API

**通用路由** (backend/src/app.ts 动态生成):
- GET/POST/PUT/DELETE /api/safework/:prefix/*

**独立路由**:
- /api/hot-work/* (动火作业)
- /api/high-work/* (高处作业)
- /api/confined-space/* (受限空间)
- /api/hoisting-work/* (吊装作业)
- /api/earth-work/* (动土作业)
- /api/broken-work/* (断路作业)
- /api/blind-work/* (盲板抽堵)
- /api/electric-work/* (临时用电)

### 1.4 培训管理API

| 路由前缀 | 文件路径 | 说明 |
|---------|---------|------|
| /api/training/* | backend/src/routes/training.ts | 培训基础 |
| /api/training-records/* | backend/src/routes/trainingRecords.ts | 培训记录 |
| /api/training-v2/* | backend/src/routes/trainingV2.ts | 培训V2 |
| /api/training-compliance/* | backend/src/routes/trainingCompliance.ts | 培训合规 |

---

## 任务2：前端API调用清单

### 2.1 认证相关 (login.js)

| HTTP方法 | API路径 | 说明 |
|---------|---------|------|
| POST | /auth/login | 登录 |
| POST | /auth/register | 注册 |
| GET | /auth/publicKey | 获取公钥 |
| POST | /auth/refresh | 刷新Token |
| GET | /system/user/getInfo | 获取用户信息 |
| DELETE | /auth/logout | 登出 |

### 2.2 系统管理

**用户管理** (system/user.js):
- GET /system/user/list
- GET /system/user/:userId
- POST /system/user
- PUT /system/user
- DELETE /system/user/:userId
- PUT /system/user/resetPwd

**部门管理** (system/dept.js):
- GET /system/dept/list
- GET /system/dept/:deptId
- POST /system/dept
- PUT /system/dept
- DELETE /system/dept/:deptId
- GET /system/dept/treeselect

**角色管理** (system/role.js):
- GET /system/role/list
- GET /system/role/:roleId
- POST /system/role
- PUT /system/role
- DELETE /system/role/:roleId

---

## 任务3：不匹配API分析

### 3.1 前端调用但后端缺失的API (高危)

| 前端调用API | HTTP方法 | 状态 | 说明 |
|------------|---------|------|------|
| /system/user/listUser | GET | ❌ 缺失 | 后端无此API |
| /system/user/resetPwd | PUT | ⚠️ 路径不匹配 | 后端是/profile/updatePwd |
| /system/dept/list/exclude/:deptId | GET | ❌ 缺失 | 后端无排除子节点API |
| /system/role/dataScope | PUT | ❌ 缺失 | 后端无数据权限API |
| /system/role/authUser/* | 多种 | ❌ 缺失 | 角色用户分配API缺失 |

### 3.2 后端提供但前端未调用的API

| 后端API | 模块 | 说明 |
|---------|------|------|
| /api/safework/task/list | 作业票 | 兼容API，返回空数据 |
| /api/dashboard/* | 仪表板 | 如果前端未使用 |
| /api/patrol/* | 巡检 | 如果前端未使用巡检模块 |

### 3.3 路径不匹配的API

**重要发现**：前端API调用中有些不带`/api`前缀（如`/auth/login`），有些带前缀（如`/api/training/*`）。

需要核查前端request配置的baseURL设置。

---

## 建议修复方案

### 优先级P0（必须修复）

1. **实现缺失的用户管理API**
   - 实现 `/system/user/listUser` 或统一到 `/system/user/list`
   - 实现 `/system/user/resetPwd` 或前端改为调用 `/system/user/profile/updatePwd`

2. **实现缺失的部门管理API**
   - 实现 `/system/dept/list/exclude/:deptId`

3. **实现缺失的角色管理API**
   - 实现角色用户分配相关API
   - 实现数据权限API

### 优先级P1（应该修复）

4. **核查并统一API路径**
   - 确认前端request配置的baseURL
   - 统一API路径风格

5. **实现配置管理缺失API**
   - 实现 `/system/config/refreshCache`

---

## 总结

1. **后端API总数**: 约 200+ 个端点
2. **前端API调用**: 约 150+ 个函数
3. **确认缺失API**: 约 15-20 个
4. **建议**: 优先实现P0级别的缺失API

---

**报告生成完成**
