@echo off
echo ====================================
echo  测试后端启动（5秒后自动关闭）
echo ====================================
echo.

cd /d D:\phpstudy_pro\safety-system\backend

echo [1/2] 正在启动后端服务...
echo.

REM 设置Node.js路径
set PATH=C:\Program Files\nodejs;%PATH%

REM 启动后端（5秒后自动超时）
timeout /t 5 >nul & start "" /B node -e "try { require('ts-node').register(); require('./src/app.ts'); setTimeout(() => { console.log('✅ 后端启动成功！'); process.exit(0); }, 3000); } catch(e) { console.log('❌ 启动失败：', e.message); process.exit(1); }"

echo.
echo [2/2] 检查依赖和配置...
node -e "try { require('./src/config/database'); console.log('✅ 数据库配置正确'); } catch(e) { console.log('❌ 数据库配置错误：', e.message); }"

echo.
echo ====================================
echo  测试完成
echo ====================================
echo.
pause
