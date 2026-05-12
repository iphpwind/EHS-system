@echo off
cd /d D:\phpstudy_pro\safety-system\frontend-new
set NODE_OPTIONS=--max-old-space-size=4096
del /f /q D:\phpstudy_pro\WWW\build-result.txt 2>nul
npx vite build > D:\phpstudy_pro\WWW\build-result.txt 2>&1
echo BUILD_EXIT_CODE=%ERRORLEVEL% >> D:\phpstudy_pro\WWW\build-result.txt
