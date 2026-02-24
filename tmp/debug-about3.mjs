import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => logs.push('PAGEERROR: ' + err.message));

await page.goto('http://localhost:8080/about.html', { waitUntil: 'networkidle' });

// Wait extra time for any async operations
await page.waitForTimeout(3000);

const teamMembers = await page.$$('.team-member');
console.log('Team members after 3s wait:', teamMembers.length);

const hasPageContent = await page.evaluate(() => contentManager?.pageContent != null);
console.log('Has page content after 3s:', hasPageContent);

console.log('All console logs:', logs.join('\n'));

await browser.close();
