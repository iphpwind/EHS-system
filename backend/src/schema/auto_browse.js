const http = require('http');
const fs = require('fs');
const path = require('path');

const DEBUG_PORT = 9222;
const OUTPUT_DIR = 'D:\\phpstudy_pro\\safety-system\\backend\\src\\schema\\screenshots';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper to make HTTP request to Chrome DevTools Protocol
function cdpRequest(endpoint, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: DEBUG_PORT,
      path: endpoint,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

// Get list of pages
async function getPages() {
  return cdpRequest('/json/list');
}

// Connect to a page via WebSocket (simplified - just use CDP HTTP for screenshots)
async function captureScreenshot(pageId, filename) {
  try {
    // Activate the page
    await cdpRequest(`/json/activate/${pageId}`);
    
    // Capture screenshot via CDP
    const result = await cdpRequest(`/json/screenshot/${pageId}`);
    
    if (result && result.data) {
      const buffer = Buffer.from(result.data, 'base64');
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
      console.log(`✓ Screenshot saved: ${filename}`);
      return true;
    }
  } catch (e) {
    console.error(`✗ Failed to capture ${filename}:`, e.message);
  }
  return false;
}

// Main function
async function main() {
  console.log('========================================');
  console.log('  Edge 浏览器自动浏览工具');
  console.log('========================================');
  console.log('');

  try {
    // Check if Edge is running with debugging
    const pages = await getPages();
    console.log(`发现 ${pages.length} 个页面:`);
    pages.forEach((p, i) => {
      console.log(`  [${i}] ${p.title} - ${p.url}`);
    });
    console.log('');

    if (pages.length === 0) {
      console.log('错误: 没有找到可连接的页面');
      console.log('请先运行 launch_edge_debug.bat 启动 Edge');
      return;
    }

    // Find the target page
    const targetPage = pages.find(p => p.url.includes('222.133.13.78'));
    if (!targetPage) {
      console.log('错误: 没有找到目标网站页面');
      return;
    }

    console.log(`已连接到页面: ${targetPage.title}`);
    console.log('');
    console.log('注意: 此工具目前只能截图当前页面');
    console.log('要实现自动点击浏览，需要更复杂的 WebSocket CDP 连接');
    console.log('');
    console.log('建议操作:');
    console.log('1. 手动点击各个菜单项');
    console.log('2. 每切换一个页面，运行: node auto_browse.js');
    console.log('3. 截图会自动保存到 screenshots 目录');
    console.log('');

    // Take screenshot of current page
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await captureScreenshot(targetPage.id, `page_${timestamp}.png`);

    console.log('');
    console.log(`截图已保存到: ${OUTPUT_DIR}`);

  } catch (error) {
    console.error('连接失败:', error.message);
    console.log('');
    console.log('请确保:');
    console.log('1. 已运行 launch_edge_debug.bat 启动 Edge');
    console.log('2. Edge 正在运行且开启了远程调试 (端口 9222)');
  }
}

main();
