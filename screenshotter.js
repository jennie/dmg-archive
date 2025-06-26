const puppeteer = require('puppeteer');
const fs = require('fs');

const urls = fs.readFileSync('urls.txt', 'utf-8').split('\n').filter(Boolean);

(async () => {
  const browser = await puppeteer.launch();
  
  for (let i = 0; i < urls.length; i++) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    try {
      await page.goto(urls[i], { waitUntil: 'networkidle2', timeout: 60000 });
      const filename = `screenshot_${i}_${urls[i].split('/').pop()}.png`;
      await page.screenshot({ path: filename, fullPage: true });
      console.log(`Captured: ${filename}`);
    } catch (error) {
      console.error(`Failed to capture ${urls[i]}: ${error.message}`);
    }
    
    await page.close();
  }
  
  await browser.close();
})();