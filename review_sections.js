const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Force all fade-up elements visible
  await page.addStyleTag({ content: '.fade-up { opacity: 1 !important; transform: none !important; }' });
  await new Promise(r => setTimeout(r, 600));

  const sections = [
    ['hero', '.hero'],
    ['logos', '.logos-section'],
    ['features', '.features-section'],
    ['how', '.how-section'],
    ['stats', '.stats-section'],
    ['pricing', '.pricing-section'],
    ['testimonials', '.testimonials-section'],
    ['cta', '.cta-section'],
    ['footer', 'footer'],
  ];

  for (const [name, selector] of sections) {
    const el = await page.$(selector);
    if (el) {
      await el.screenshot({ path: `temporary_screenshots/sec_${name}.png` });
      console.log(`Saved: sec_${name}.png`);
    } else {
      console.log(`Not found: ${selector}`);
    }
  }

  await browser.close();
})();
