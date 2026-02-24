import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto('http://localhost:8080/about.html', { waitUntil: 'domcontentloaded' });

// Try calling each method individually to find which one throws
const result = await page.evaluate(async () => {
  const cm = contentManager;
  const results = {};

  try {
    results.siteConfig = cm.siteConfig != null ? 'loaded' : 'null';
  } catch(e) { results.siteConfig = 'error: ' + e.message; }

  try {
    cm.populateNavigation();
    results.populateNavigation = 'ok';
  } catch(e) { results.populateNavigation = 'error: ' + e.message; }

  try {
    cm.populateFooter();
    results.populateFooter = 'ok';
  } catch(e) { results.populateFooter = 'error: ' + e.message; }

  try {
    cm.updateGoogleAnalytics();
    results.updateGoogleAnalytics = 'ok';
  } catch(e) { results.updateGoogleAnalytics = 'error: ' + e.message; }

  try {
    await cm.loadPageContent('about');
    results.loadPageContent = cm.pageContent != null ? 'loaded' : 'null';
  } catch(e) { results.loadPageContent = 'error: ' + e.message; }

  try {
    cm.renderAboutPage();
    results.renderAboutPage = 'ok';
  } catch(e) { results.renderAboutPage = 'error: ' + e.message; }

  results.teamMembers = document.querySelectorAll('.team-member').length;

  return results;
});

console.log(JSON.stringify(result, null, 2));

await browser.close();
