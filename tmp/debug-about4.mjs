import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => logs.push('PAGEERROR: ' + err.message));

// Check network requests
const requests = [];
page.on('request', req => requests.push(req.url()));
page.on('requestfailed', req => requests.push('FAILED: ' + req.url()));

await page.goto('http://localhost:8080/about.html', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Check if ContentManager class exists
const classExists = await page.evaluate(() => typeof ContentManager);
console.log('ContentManager type:', classExists);

const cmExists = await page.evaluate(() => typeof contentManager);
console.log('contentManager instance type:', cmExists);

// Check if script.js loaded
const scriptJS = await page.evaluate(() => typeof changeSlide);
console.log('script.js loaded (changeSlide):', scriptJS);

console.log('All network requests:');
requests.filter(r => r.includes('content') || r.includes('.js')).forEach(r => console.log(' ', r));

console.log('Console logs:', logs.length ? logs.join('\n') : '(none)');

await browser.close();
