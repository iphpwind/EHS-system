@echo off
chcp 65001 > nul
title 安全生产管理系统 - 启动中...
echo =====================================
echo   安全生产管理系统 EHS v2.0 - 启动
echo =====================================
echo.

REM 设置项目目录
set PROJECT_DIR=%~dp0
set BACKEND_DIR=%PROJECT_DIR%backend
set FRONTEND_DIR=%PROJECT_DIR%frontend-new
set H5_DIR=%PROJECT_DIR%frontend-h5
set NGINX_DIR=D:\phpstudy_pro\Extensions\Nginx1.15.11
set WWW_DIR=D:\phpstudy_pro\WWW

echo [1/5] 检查运行环境...
where node >nul 2>nul
if errorlevel 1 (
  echo [错误] 未检测到 Node.js，请先安装
  pause
  exit /b 1
)
echo [OK] Node.js 环境正常

echo.
echo [2/5] 释放80端口（若有旧的proxy-80或Apache占用）...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :80 ') do (
  if not "%%a"=="0" (
    taskkill /PID %%a /F > nul 2>&1
  )
)
echo [OK] 80端口已释放

echo.
echo [3/5] 构建并启动后端服务（端口 3001）...
cd /d %BACKEND_DIR%
if not exist "node_modules\" (
  echo [信息] 首次运行，正在安装后端依赖...
  call npm install
)
echo [构建] 编译TypeScript...
call npm run build > nul 2>&1
echo [PM2] 启动后端服务（进程守护中）...
pm2 restart safety-backend > nul 2>&1 || pm2 start dist/app.js --name safety-backend --log backend.log
pm2 save > nul 2>&1
echo [OK] 后端已启动（PID: %errorlevel%）...

timeout /t 3 > nul

echo.
echo [4/5] 构建前端并部署到WWW...
cd /d %FRONTEND_DIR%
if not exist "node_modules\" (
  echo [信息] 首次运行，正在安装前端依赖...
  call npm install
)
echo [构建] npm run build:prod ...
call npm run build:prod > nul 2>&1
if exist "%WWW_DIR%\index.html" (
  echo [OK] 前端构建完成 -> %WWW_DIR%
) else (
  echo [警告] 前端构建可能失败，请检查日志
)

echo.
echo [5/5] 启动 Nginx 80端口（统一入口）...
if exist "%NGINX_DIR%\nginx.exe" (
  cd /d %NGINX_DIR%
  nginx -s quit > nul 2>&1
  timeout /t 1 > nul
  start "Nginx-80" nginx.exe
  timeout /t 2 > nul
  echo [OK] Nginx 已启动
) else (
  echo [警告] 未找到 Nginx，尝试 Node Proxy 备选方案...
  cd /d %PROJECT_DIR%
  start "Proxy-80" cmd /k "node proxy-80.js"
  echo [OK] Node Proxy 已启动（备选方案）
)

echo.
echo ================================================
echo   所有服务已启动！30秒后自动验证...
echo ================================================
echo.

timeout /t 8 > nul

echo ----- 自动验证结果 -----
echo.

REM 验证后端
curl -s -o nul -w "  后端API(3001): HTTP %%{http_code}" http://localhost:3001/api/health 2>nul
if errorlevel 1 (
  echo   [警告] 后端API未响应
) else (
  echo.
)

REM 验证80端口
curl -s -o nul -w "  Nginx 80入口: HTTP %%{http_code}" http://localhost/ 2>nul
if errorlevel 1 (
  echo   [警告] 80端口未响应
) else (
  echo.
)

REM 验证API代理
curl -s -o nul -w "  API代理(/api/health): HTTP %%{http_code}" http://localhost/api/health 2>nul
if errorlevel 1 (
  echo   [警告] API代理不通
) else (
  echo.
)

echo.
echo  访问地址：
echo    http://localhost      （本地）
echo    http://192.168.1.19   （局域网）
echo.
echo  按任意键关闭此窗口（服务后台运行）...
pause > nul
