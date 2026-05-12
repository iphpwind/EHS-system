# 安全生产管理系统 - 依赖安装检查工具
# 使用方法：右键选择"使用PowerShell运行"

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  依赖安装检查工具" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# 检查前端依赖
Write-Host "[1/2] 检查前端依赖 (node_modules)..." -ForegroundColor Yellow
if (Test-Path "D:\phpstudy_pro\safety-system\frontend\node_modules") {
    $frontendCount = (Get-ChildItem "D:\phpstudy_pro\safety-system\frontend\node_modules" -Directory).Count
    Write-Host "  [成功] 前端依赖已安装！" -ForegroundColor Green
    Write-Host "  共安装了 $frontendCount 个依赖包" -ForegroundColor Gray
} else {
    Write-Host "  [失败] 前端依赖未安装！" -ForegroundColor Red
    Write-Host "  请执行：cd D:\phpstudy_pro\safety-system\frontend; npm install" -ForegroundColor Yellow
}
Write-Host ""

# 检查后端依赖
Write-Host "[2/2] 检查后端依赖 (node_modules)..." -ForegroundColor Yellow
if (Test-Path "D:\phpstudy_pro\safety-system\backend\node_modules") {
    $backendCount = (Get-ChildItem "D:\phpstudy_pro\safety-system\backend\node_modules" -Directory).Count
    Write-Host "  [成功] 后端依赖已安装！" -ForegroundColor Green
    Write-Host "  共安装了 $backendCount 个依赖包" -ForegroundColor Gray
} else {
    Write-Host "  [失败] 后端依赖未安装！" -ForegroundColor Red
    Write-Host "  请执行：cd D:\phpstudy_pro\safety-system\backend; npm install" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "======================================" -ForegroundColor Cyan
if ((Test-Path "D:\phpstudy_pro\safety-system\frontend\node_modules") -and (Test-Path "D:\phpstudy_pro\safety-system\backend\node_modules")) {
    Write-Host "  ✅ 所有依赖安装成功！" -ForegroundColor Green
    Write-Host ""
    Write-Host "  下一步：" -ForegroundColor Yellow
    Write-Host "  1. 启动后端：cd D:\phpstudy_pro\safety-system\backend; npm run dev" -ForegroundColor Yellow
    Write-Host "  2. 启动前端：cd D:\phpstudy_pro\safety-system\frontend; npm run dev" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ 部分依赖未安装，请查看上述提示" -ForegroundColor Red
}
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
pause
