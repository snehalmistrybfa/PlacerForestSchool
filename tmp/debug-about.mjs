import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
const logs = [];
page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
page.on('pageerror', err => logs.push('ERROR: ' + err.message));
await page.goto('http://localhost:8080/about.html', { waitUntil: 'networkidle' });

const cmState = await page.evaluate(() => {
  return {
    cmExists: typeof contentManager !== 'undefined',
    hasSiteConfig: contentManager?.siteConfig != null,
    hasPageContent: contentManager?.pageContent != null,
    pageContentKeys: contentManager?.pageContent ? Object.keys(contentManager.pageContent) : [],
    hasTeam: contentManager?.pageContent?.team != null,
    teamMembersCount: contentManager?.pageContent?.team?.members?.length || 0
  };
});
console.log('CM State:', JSON.stringify(cmState, null, 2));
console.log('Console logs:', logs.join('\n'));

const teamHTML = await page.evaluate(() => document.getElementById('team-members')?.innerHTML);
console.log('Team HTML length:', teamHTML?.length);
console.log('Team HTML preview:', teamHTML?.substring(0, 300));

const footerHTML = await page.evaluate(() => document.querySelector('.footer')?.innerHTML);
console.log('Footer has times:', footerHTML?.includes('AM') || footerHTML?.includes('PM'));

await browser.close();
