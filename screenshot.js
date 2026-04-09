#!/usr/bin/env node
const puppeteer = require('puppeteer');

const URL = process.argv[2] || 'http://localhost:3000';
const OUTPUT = process.argv[3] || 'screenshot.png';

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  try {
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 15000 });

    // Scroll through the page to trigger IntersectionObserver animations
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let y = 0;
        const step = 400;
        const interval = setInterval(() => {
          window.scrollBy(0, step);
          y += step;
          if (y >= document.body.scrollHeight) {
            window.scrollTo(0, 0);
            clearInterval(interval);
            resolve();
          }
        }, 80);
      });
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: OUTPUT, fullPage: true });
    console.log(`Screenshot saved: ${OUTPUT}`);
  } catch (err) {
    console.error(`Failed to screenshot ${URL}: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
