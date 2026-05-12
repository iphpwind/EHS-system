@echo off
chcp 65001 >nul
echo 正在启动 Edge 浏览器（开启远程调试模式）...
echo.
echo 启动后会自动打开目标网站
echo 请手动登录后，运行 auto_browse.js 脚本
echo.

"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" ^
  --remote-debugging-port=9222 ^
  --user-data-dir=D:\edge_debug_profile ^
  http://222.133.13.78:8088/

echo.
echo Edge 已启动，远程调试端口: 9222
echo 登录后请运行 auto_browse.js 自动浏览脚本
pause
