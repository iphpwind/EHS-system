const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const OUTPUT_DIR = 'D:\\phpstudy_pro\\safety-system\\backend\\src\\schema\\screenshots';
const ANALYSIS_FILE = 'D:\\phpstudy_pro\\safety-system\\backend\\src\\schema\\site_analysis.json';

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Analysis data structure
let analysis = {
  pages: [],
  menuStructure: [],
  components: [],
  colors: {},
  layout: {}
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capturePage(page, name) {
  const timestamp = Date.now();
  const filename = `${name}_${timestamp}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  await page.screenshot({ path: filepath, fullPage: true });
  console.log(`✓ Screenshot: ${filename}`);
  return filepath;
}

async function analyzePage(page, url, title) {
  console.log(`\nAnalyzing: ${title}`);
  
  // Extract page info
  const pageInfo = await page.evaluate(() => {
    return {
      title: document.title,
      url: window.location.href,
      bodyClasses: document.body.className,
      // Extract all text content from menu items
      menuItems: Array.from(document.querySelectorAll('.el-menu-item, .el-sub-menu__title, .menu-item, [class*="menu"], [class*="nav"]')).map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        tagName: el.tagName
      })).filter(item => item.text),
      // Extract buttons
      buttons: Array.from(document.querySelectorAll('button, .el-button, [class*="btn"]')).map(el => ({
        text: el.textContent?.trim(),
        className: el.className,
        type: el.type
      })).filter(item => item.text),
      // Extract form fields
      forms: Array.from(document.querySelectorAll('input, select, textarea, .el-input, .el-select')).map(el => ({
        tagName: el.tagName,
        type: el.type,
        placeholder: el.placeholder,
        className: el.className,
        name: el.name
      })),
      // Extract table info
      tables: Array.from(document.querySelectorAll('table, .el-table')).map(el => ({
        className: el.className,
        rowCount: el.querySelectorAll('tr').length,
        headers: Array.from(el.querySelectorAll('th')).map(th => th.textContent?.trim())
      })),
      // Extract colors from computed styles
      colors: (() => {
        const computed = window.getComputedStyle(document.body);
        return {
          backgroundColor: computed.backgroundColor,
          color: computed.color,
          fontFamily: computed.fontFamily
        };
      })()
    };
  });

  analysis.pages.push({
    title: pageInfo.title,
    url: pageInfo.url,
    menuItems: pageInfo.menuItems,
    buttons: pageInfo.buttons,
    forms: pageInfo.forms,
    tables: pageInfo.tables,
    colors: pageInfo.colors
  });

  return pageInfo;
}

async function clickAndAnalyze(page, selector, name) {
  try {
    await page.waitForSelector(selector, { timeout: 5000 });
    await page.click(selector);
    await delay(2000); // Wait for page to load
    await capturePage(page, name);
    await analyzePage(page, page.url(), name);
    return true;
  } catch (e) {
    console.log(`✗ Could not click ${name}: ${e.message}`);
    return false;
  }
}

async function main() {
  console.log('========================================');
  console.log('  网站自动浏览分析工具');
  console.log('========================================\n');

  let browser;
  try {
    // Launch Edge browser
    browser = await puppeteer.launch({
      executablePath: EDGE_PATH,
      headless: false, // Show browser window
      defaultViewport: { width: 1920, height: 1080 },
      args: ['--start-maximized']
    });

    const page = await browser.newPage();
    
    // Navigate to target site
    console.log('Opening website...');
    await page.goto('http://222.133.13.78:8088/', { waitUntil: 'networkidle2' });
    
    console.log('\n=======================================');
    console.log('请手动登录网站！');
    console.log('账号: 13791358848');
    console.log('密码: 123456ABC');
    console.log('验证码: 9903');
    console.log('=======================================\n');
    
    console.log('登录完成后，请按 Enter 键继续...');
    
    // Wait for user to press Enter
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

    console.log('\n开始自动浏览和分析...\n');

    // Capture homepage
    await capturePage(page, '01_homepage');
    const homeInfo = await analyzePage(page, page.url(), 'homepage');
    
    // Try to find and click menu items
    console.log('\n发现菜单项:');
    homeInfo.menuItems.forEach((item, i) => {
      console.log(`  [${i}] ${item.text}`);
    });

    // Common menu item selectors to try
    const menuSelectors = [
      // By text content
      { selector: 'text/安全办公', name: '02_safety_office' },
      { selector: 'text/教育培训', name: '03_training' },
      { selector: 'text/双重预防', name: '04_dual_prevention' },
      { selector: 'text/作业管理', name: '05_operation_mgmt' },
      { selector: 'text/危险源监测', name: '06_hazard_monitor' },
      { selector: 'text/相关方管理', name: '07_related_party' },
      { selector: 'text/风险管控', name: '08_risk_control' },
      { selector: 'text/事故应急', name: '09_emergency' },
      { selector: 'text/电子巡检', name: '10_inspection' },
      { selector: 'text/封闭化管理', name: '11_enclosed_mgmt' },
      { selector: 'text/视频IOT', name: '12_iot_video' },
      { selector: 'text/系统管理', name: '13_system_mgmt' },
      { selector: 'text/基础档案', name: '14_basic_archive' },
      { selector: 'text/流程办理', name: '15_process' },
    ];

    // Try clicking each menu item
    for (const menu of menuSelectors) {
      console.log(`\n尝试点击: ${menu.name}`);
      const success = await clickAndAnalyze(page, menu.selector, menu.name);
      if (success) {
        // Go back to homepage
        await page.goto('http://222.133.13.78:8088/', { waitUntil: 'networkidle2' });
        await delay(1000);
      }
    }

    // Save analysis results
    fs.writeFileSync(ANALYSIS_FILE, JSON.stringify(analysis, null, 2), 'utf-8');
    console.log(`\n✓ 分析结果已保存到: ${ANALYSIS_FILE}`);
    console.log(`✓ 截图已保存到: ${OUTPUT_DIR}`);

    console.log('\n浏览完成！');
    console.log('按 Enter 键关闭浏览器...');
    
    await new Promise(resolve => {
      process.stdin.once('data', () => resolve());
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('浏览器已关闭');
    }
  }
}

main();
