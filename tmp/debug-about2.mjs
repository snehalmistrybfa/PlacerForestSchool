import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => logs.push('PAGEERROR: ' + err.message));
await page.goto('http://localhost:8080/about.html', { waitUntil: 'networkidle' });

// Try fetching the JSON directly in browser
const fetchResult = await page.evaluate(async () => {
  try {
    const response = await fetch('/content/about-content.json');
    const text = await response.text();
    const json = JSON.parse(text);
    return { ok: response.ok, status: response.status, hasTeam: !!json.team, membersCount: json.team?.members?.length };
  } catch(e) {
    return { error: e.message };
  }
});
console.log('Direct fetch result:', JSON.stringify(fetchResult));

// Check contentManager init flow
const initResult = await page.evaluate(async () => {
  const cm = new ContentManager();
  const config = await cm.loadSiteConfig();
  const content = await cm.loadPageContent('about');
  return {
    configLoaded: !!config,
    contentLoaded: !!content,
    contentKeys: content ? Object.keys(content) : null,
    contentHasTeam: content?.team != null
  };
});
console.log('Re-init result:', JSON.stringify(initResult));
console.log('Console logs:', logs.join('\n'));

await browser.close();
