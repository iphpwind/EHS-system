@echo off
chcp 65001 >nul
title 网站自动浏览工具
echo ========================================
echo   网站自动浏览分析工具
echo ========================================
echo.
echo 此工具将自动：
echo 1. 启动 Edge 浏览器
echo 2. 打开目标网站
echo 3. 您手动登录后，自动点击各菜单并截图
echo.
echo 按任意键开始...
pause >nul

cd /d D:\phpstudy_pro\safety-system\backend\src\schema
node auto_crawl.js

echo.
echo 按任意键退出...
pause >nul
