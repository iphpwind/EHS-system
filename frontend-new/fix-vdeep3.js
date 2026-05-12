const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    
    // 模式1: ::v-deep(.selector) -> :deep(.selector)
    content = content.replace(/::v-deep\(/g, ':deep(');
    
    // 模式2: 多行 ::v-deep .selector { 或 ::v-deep .selector,\n .selector2 {
    // 已经由第二批处理，这里处理特殊情况
    content = content.replace(/::v-deep\s+([^{]+?)\s*\{/g, (match, selector) => {
        return `:deep(${selector.trim()}) {`;
    });
    
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log('Updated:', filePath);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && file !== 'node_modules') {
            walkDir(fullPath);
        } else if (stat.isFile() && (file.endsWith('.vue') || file.endsWith('.scss'))) {
            processFile(fullPath);
        }
    }
}

walkDir('src');
console.log('Done!');
