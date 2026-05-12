const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    
    // 模式: ::v-deep <selector> {  ->  :deep(<selector>) {
    // 选择器可以包含:伪类、::伪元素、属性选择器[]等
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
