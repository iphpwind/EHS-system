const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;
    
    // 模式1: ::v-deep .selector {  ->  :deep(.selector) {
    content = content.replace(/::v-deep\s+([.#\w-]+(?:\s*[>+~]\s*[.#\w-]+)*)\s*\{/g, (match, selector) => {
        return `:deep(${selector.trim()}) {`;
    });
    
    // 模式2: .parent ::v-deep .child {  ->  .parent :deep(.child) {
    content = content.replace(/\.([\w-]+)\s+::v-deep\s+([.#\w-]+(?:\s*[>+~]\s*[.#\w-]+)*)\s*\{/g, (match, parent, selector) => {
        return `.${parent} :deep(${selector.trim()}) {`;
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
