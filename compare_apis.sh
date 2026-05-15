#!/bin/bash
# API对比脚本：比较前端API调用和后端API端点

echo "========================================="
echo "安全生产管理系统 - 前后端API对比"
echo "========================================="
echo ""

# 1. 提取后端API端点
echo "📊 步骤1: 提取后端API端点..."
cd "D:/phpstudy_pro/safety-system/backend/src/routes"

echo "后端路由文件数量: $(ls -1 *.ts | wc -l)"

# 提取所有路由定义
echo "" > /tmp/backend_apis_full.txt
for f in *.ts; do
    echo "=== $f ===" >> /tmp/backend_apis_full.txt
    grep -n "router\.\(get\|post\|put\|delete\)" "$f" >> /tmp/backend_apis_full.txt 2>&1
done

echo "后端API端点数量（粗略统计): $(grep -c "router\." /tmp/backend_apis_full.txt)"
echo "✅ 后端API端点已保存到 /tmp/backend_apis_full.txt"
echo ""

# 2. 提取前端API调用
echo "📊 步骤2: 提取前端API调用..."
cd "D:/phpstudy_pro/safety-system/frontend-new/src/api"

echo "前端API文件数量: $(find . -name "*.js" | wc -l)"

# 提取所有URL
echo "" > /tmp/frontend_apis_full.txt
for f in $(find . -name "*.js" -type f); do
    echo "=== $f ===" >> /tmp/frontend_apis_full.txt
    grep -n "url:" "$f" >> /tmp/frontend_apis_full.txt 2>&1
done

echo "前端API调用数量（粗略统计): $(grep -c "url:" /tmp/frontend_apis_full.txt)"
echo "✅ 前端API调用已保存到 /tmp/frontend_apis_full.txt"
echo ""

# 3. 提取app.ts中的兼容API
echo "📊 步骤3: 提取app.ts中的兼容API..."
cd "D:/phpstudy_pro/safety-system/backend/src"

grep -n "app\.\(get\|post\|put\|delete\)" app.ts > /tmp/backend_compat_apis.txt 2>&1

echo "后端兼容API数量: $(wc -l < /tmp/backend_compat_apis.txt)"
echo "✅ 后端兼容API已保存到 /tmp/backend_compat_apis.txt"
echo ""

# 4. 对比分析
echo "📊 步骤4: 对比分析..."
echo "正在生成对比报告..."

# 创建对比报告
{
    echo "# 前后端API对比报告"
    echo ""
    echo "**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "---"
    echo ""
    echo "## 一、统计概览"
    echo ""
    echo "- **后端路由文件**: $(ls -1 D:/phpstudy_pro/safety-system/backend/src/routes/*.ts | wc -l) 个"
    echo "- **后端API端点**: 约 $(grep -c "router\." /tmp/backend_apis_full.txt 2>/dev/null || echo "0") 个"
    echo "- **后端兼容API**: $(wc -l < /tmp/backend_compat_apis.txt 2>/dev/null || echo "0") 个"
    echo "- **前端API文件**: $(find D:/phpstudy_pro/safety-system/frontend-new/src/api -name "*.js" | wc -l) 个"
    echo "- **前端API调用**: 约 $(grep -c "url:" /tmp/frontend_apis_full.txt 2>/dev/null || echo "0") 个"
    echo ""
    echo "---"
    echo ""
    echo "## 二、后端API端点列表"
    echo ""
    echo "\`\`\`"
    cat /tmp/backend_apis_full.txt 2>/dev/null || echo "文件不存在"
    echo "\`\`\`"
    echo ""
    echo "---"
    echo ""
    echo "## 三、前端API调用列表"
    echo ""
    echo "\`\`\`"
    cat /tmp/frontend_apis_full.txt 2>/dev/null || echo "文件不存在"
    echo "\`\`\`"
    echo ""
    echo "---"
    echo ""
    echo "## 四、后端兼容API列表"
    echo ""
    echo "\`\`\`"
    cat /tmp/backend_compat_apis.txt 2>/dev/null || echo "文件不存在"
    echo "\`\`\`"
    echo ""
    echo "---"
    echo ""
    echo "## 五、待分析问题"
    echo ""
    echo "需要手动检查："
    echo "1. 前端调用的API是否在后端有对应端点"
    echo "2. 后端提供的API是否被前端调用"
    echo "3. HTTP方法是否匹配（GET/POST/PUT/DELETE）"
    echo "4. 路径参数是否正确"
    echo ""
    echo "---"
    echo ""
    echo "**报告生成完成**"
} > /tmp/api_comparison_report.md

echo "✅ 对比报告已生成: /tmp/api_comparison_report.md"
echo ""
echo "========================================="
echo "📋 下一步:"
echo "1. 查看对比报告: cat /tmp/api_comparison_report.md"
echo "2. 手动检查不匹配的API"
echo "3. 修复发现的问题"
echo "========================================="
