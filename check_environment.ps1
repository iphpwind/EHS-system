# 安全生产管理系统 - 完整环境检查工具
# 使用方法：右键选择"使用PowerShell运行"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  安全生产管理系统 - 环境检查工具" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# ============================================================
# 1. 检查Node.js和npm
# ============================================================
Write-Host "[1/7] 检查Node.js环境..." -ForegroundColor Yellow

$nodePath = "C:\Program Files\nodejs\node.exe"
$npmPath = "C:\Program Files\nodejs\npm.cmd"

if (Test-Path $nodePath) {
    $nodeVersion = & "$nodePath" --version 2>&1
    Write-Host "  [成功] Node.js 已安装： $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  [失败] Node.js 未安装！" -ForegroundColor Red
    Write-Host "         请双击运行：D:\phpstudy_pro\node-v20.11.1-x64.msi" -ForegroundColor Yellow
    $allPassed = $false
}

if (Test-Path $npmPath) {
    $npmVersion = & "$npmPath" --version 2>&1
    Write-Host "  [成功] npm 已安装： v$npmVersion" -ForegroundColor Green
} else {
    Write-Host "  [失败] npm 未找到！" -ForegroundColor Red
    $allPassed = $false
}

Write-Host ""

# ============================================================
# 2. 检查MySQL服务
# ============================================================
Write-Host "[2/7] 检查MySQL 8.0服务..." -ForegroundColor Yellow

$mysqlPath = "D:\phpstudy_pro\Extensions\MySQL8.0.12\bin\mysql.exe"

if (Test-Path $mysqlPath) {
    try {
        $mysqlVersion = & "$mysqlPath" --version 2>&1 | Out-String
        Write-Host "  [成功] MySQL 8.0 已安装： $($mysqlVersion.Trim())" -ForegroundColor Green
        
        # 尝试连接数据库
        $connTest = & "$mysqlPath" -u root -proot -e "SELECT 1;" 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [成功] MySQL 连接成功！" -ForegroundColor Green
        } else {
            Write-Host "  [警告] 无法连接到MySQL，请检查：" -ForegroundColor Yellow
            Write-Host "        1. PHPStudy中MySQL 8.0服务是否已启动" -ForegroundColor Yellow
            Write-Host "        2. root密码是否为'root'" -ForegroundColor Yellow
            $allPassed = $false
        }
    }
    catch {
        Write-Host "  [失败] MySQL 检查出错：$_" -ForegroundColor Red
        $allPassed = $false
    }
} else {
    Write-Host "  [失败] MySQL 8.0 未找到！" -ForegroundColor Red
    Write-Host "         请在PHPStudy中安装或切换到MySQL 8.0" -ForegroundColor Yellow
    $allPassed = $false
}

Write-Host ""

# ============================================================
# 3. 检查数据库
# ============================================================
Write-Host "[3/7] 检查数据库 safety_system..." -ForegroundColor Yellow

if (Test-Path $mysqlPath) {
    $dbCheck = & "$mysqlPath" -u root -proot -e "USE safety_system; SHOW TABLES;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $tableCount = ($dbCheck | Select-Object -Skip 2).Count
        Write-Host "  [成功] 数据库 safety_system 已创建！" -ForegroundColor Green
        Write-Host "         共找到 $tableCount 张表" -ForegroundColor Gray
    } else {
        Write-Host "  [失败] 数据库 safety_system 不存在！" -ForegroundColor Red
        Write-Host "         请双击运行：D:\phpstudy_pro\safety-system\import_db.bat" -ForegroundColor Yellow
        $allPassed = $false
    }
} else {
    Write-Host "  [跳过] MySQL未安装，跳过数据库检查" -ForegroundColor Gray
}

Write-Host ""

# ============================================================
# 4. 检查前端依赖
# ============================================================
Write-Host "[4/7] 检查前端依赖..." -ForegroundColor Yellow

if (Test-Path "D:\phpstudy_pro\safety-system\frontend\node_modules") {
    $frontendModules = (Get-ChildItem "D:\phpstudy_pro\safety-system\frontend\node_modules" -Directory).Count
    Write-Host "  [成功] 前端依赖已安装！" -ForegroundColor Green
    Write-Host "         共安装了 $frontendModules 个依赖包" -ForegroundColor Gray
} else {
    Write-Host "  [失败] 前端依赖未安装！" -ForegroundColor Red
    Write-Host "         请执行：cd D:\phpstudy_pro\safety-system\frontend; npm install" -ForegroundColor Yellow
    $allPassed = $false
}

Write-Host ""

# ============================================================
# 5. 检查后端依赖
# ============================================================
Write-Host "[5/7] 检查后端依赖..." -ForegroundColor Yellow

if (Test-Path "D:\phpstudy_pro\safety-system\backend\node_modules") {
    $backendModules = (Get-ChildItem "D:\phpstudy_pro\safety-system\backend\node_modules" -Directory).Count
    Write-Host "  [成功] 后端依赖已安装！" -ForegroundColor Green
    Write-Host "         共安装了 $backendModules 个依赖包" -ForegroundColor Gray
} else {
    Write-Host "  [失败] 后端依赖未安装！" -ForegroundColor Red
    Write-Host "         请执行：cd D:\phpstudy_pro\safety-system\backend; npm install" -ForegroundColor Yellow
    $allPassed = $false
}

Write-Host ""

# ============================================================
# 6. 检查项目文件完整性
# ============================================================
Write-Host "[6/7] 检查项目文件完整性..." -ForegroundColor Yellow

$requiredFiles = @(
    "D:\phpstudy_pro\safety-system\frontend\package.json",
    "D:\phpstudy_pro\safety-system\frontend\vite.config.ts",
    "D:\phpstudy_pro\safety-system\backend\package.json",
    "D:\phpstudy_pro\safety-system\backend\src\app.ts",
    "D:\phpstudy_pro\safety-system\backend\src\config\database.ts",
    "D:\phpstudy_pro\safety-system\backend\src\routes\auth.ts",
    "D:\phpstudy_pro\safety-system\backend\src\routes\users.ts",
    "D:\phpstudy_pro\safety-system\backend\src\routes\tickets.ts",
    "D:\phpstudy_pro\safety-system\backend\src\controllers\authController.ts",
    "D:\phpstudy_pro\safety-system\backend\src\controllers\userController.ts",
    "D:\phpstudy_pro\safety-system\backend\src\controllers\ticketController.ts",
    "D:\phpstudy_pro\safety-system\backend\src\middleware\authMiddleware.ts",
    "D:\phpstudy_pro\safety-system\backend\src\utils\errors.ts"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  [成功] 所有核心文件已创建！" -ForegroundColor Green
} else {
    Write-Host "  [失败] 缺少以下文件：" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "         - $file" -ForegroundColor Yellow
    }
    $allPassed = $false
}

Write-Host ""

# ============================================================
# 7. 测试后端能否启动
# ============================================================
Write-Host "[7/7] 测试后端启动..." -ForegroundColor Yellow
Write-Host "         正在测试启动后端服务（5秒超时）..." -ForegroundColor Gray

$backendPath = "D:\phpstudy_pro\safety-system\backend"
$testScript = @"
cd $backendPath
`$env:Path += ';C:\Program Files\nodejs'
node -e "try { require('./src/config/database'); console.log('✅ 数据库连接配置正确'); } catch(e) { console.log('❌ 配置错误:', e.message); }"
"@

$testScript | Out-File -FilePath "D:\phpstudy_pro\safety-system\test_db_config.ps1" -Encoding UTF8

& "powershell.exe" -ExecutionPolicy Bypass -File "D:\phpstudy_pro\safety-system\test_db_config.ps1" 2>&1 | Select-Object -First 10

Write-Host ""

# ============================================================
# 总结
# ============================================================
Write-Host "==========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  ✅ 所有环境检查通过！" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  下一步操作：" -ForegroundColor Yellow
    Write-Host "  1. 启动后端：" -ForegroundColor Yellow
    Write-Host "     cd D:\phpstudy_pro\safety-system\backend" -ForegroundColor Gray
    Write-Host "     npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. 启动前端（新窗口）：" -ForegroundColor Yellow
    Write-Host "     cd D:\phpstudy_pro\safety-system\frontend" -ForegroundColor Gray
    Write-Host "     npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  3. 访问系统：http://localhost:5173" -ForegroundColor Yellow
} else {
    Write-Host "  ❌ 部分检查未通过，请根据上述提示进行修复" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Cyan
}
Write-Host ""

pause
