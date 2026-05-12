import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        # Launch Edge browser with user's profile
        browser = await p.chromium.launch(
            headless=False,
            executable_path="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
        )
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        
        # Navigate to the site
        await page.goto("http://222.133.13.78:8088/")
        print("Page loaded. Please login manually and press Enter in terminal when done...")
        
        # Wait for user to login manually
        input("Press Enter after you have logged in...")
        
        # Take screenshot of homepage
        await page.screenshot(path="D:/phpstudy_pro/safety-system/backend/src/schema/screenshot_home.png", full_page=True)
        print("Homepage screenshot saved")
        
        # Get page content
        content = await page.content()
        with open("D:/phpstudy_pro/safety-system/backend/src/schema/page_home.html", "w", encoding="utf-8") as f:
            f.write(content)
        
        # Try to expand menu and take screenshots
        # Get all menu items
        menu_items = await page.query_selector_all(".el-menu-item, .el-sub-menu__title, .menu-item, [class*='menu']")
        print(f"Found {len(menu_items)} menu items")
        
        # Keep browser open for inspection
        print("Browser will stay open. Press Enter to close...")
        input()
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
