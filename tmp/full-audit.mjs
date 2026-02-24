import { chromium } from 'playwright';

const BASE = 'http://localhost:8080';
const PAGES = [
  { name: 'Home', path: '/index.html' },
  { name: 'About', path: '/about.html' },
  { name: 'Enrollment', path: '/enrollment.html' },
  { name: 'FAQs', path: '/faqs.html' },
  { name: 'Contact', path: '/contact.html' },
  { name: 'Resources', path: '/resources.html' },
  { name: 'Terms', path: '/terms.html' },
];

const issues = [];
const browser = await chromium.launch();

for (const pg of PAGES) {
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on('pageerror', err => pageErrors.push(err.message));
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('requestfailed', req => failedRequests.push(req.url()));

  console.log(`\n=== ${pg.name} (${pg.path}) ===`);

  try {
    const resp = await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    console.log(`  Status: ${resp.status()}`);
    if (resp.status() !== 200) issues.push(`${pg.name}: HTTP ${resp.status()}`);
  } catch (e) {
    console.log(`  LOAD ERROR: ${e.message}`);
    issues.push(`${pg.name}: Failed to load - ${e.message}`);
    await page.close();
    continue;
  }

  // JS errors
  if (pageErrors.length) {
    console.log(`  JS ERRORS: ${pageErrors.join('; ')}`);
    pageErrors.forEach(e => issues.push(`${pg.name}: JS error - ${e}`));
  }
  if (consoleErrors.length) {
    console.log(`  Console errors: ${consoleErrors.join('; ')}`);
  }

  // Failed requests
  if (failedRequests.length) {
    console.log(`  Failed requests: ${failedRequests.join(', ')}`);
    failedRequests.forEach(r => issues.push(`${pg.name}: Failed request - ${r}`));
  }

  // Check all images
  const brokenImgs = await page.$$eval('img', imgs =>
    imgs.filter(img => !img.complete || img.naturalWidth === 0)
        .map(img => img.src || img.getAttribute('src'))
  );
  if (brokenImgs.length) {
    console.log(`  BROKEN IMAGES: ${brokenImgs.join(', ')}`);
    brokenImgs.forEach(i => issues.push(`${pg.name}: Broken image - ${i}`));
  } else {
    const imgCount = await page.$$eval('img', imgs => imgs.length);
    console.log(`  Images: ${imgCount} (all loaded)`);
  }

  // Check all internal links
  const links = await page.$$eval('a[href]', anchors =>
    anchors.map(a => ({ href: a.getAttribute('href'), text: a.textContent.trim().substring(0, 30) }))
      .filter(l => l.href && !l.href.startsWith('http') && !l.href.startsWith('mailto:') && !l.href.startsWith('tel:') && !l.href.startsWith('#'))
  );
  for (const link of links) {
    try {
      const url = new URL(link.href, BASE);
      const r = await page.evaluate(async (u) => {
        try { const r = await fetch(u, { method: 'HEAD' }); return r.status; } catch(e) { return 0; }
      }, url.href);
      if (r !== 200) {
        console.log(`  BROKEN LINK: "${link.text}" -> ${link.href} (${r})`);
        issues.push(`${pg.name}: Broken link "${link.text}" -> ${link.href} (status ${r})`);
      }
    } catch(e) {}
  }

  // Check nav menu
  const navLinks = await page.$$eval('.nav-menu .nav-link', els => els.map(e => ({ text: e.textContent, href: e.getAttribute('href') })));
  if (navLinks.length < 6) {
    console.log(`  NAV ISSUE: Only ${navLinks.length} nav links (expected 6)`);
    issues.push(`${pg.name}: Only ${navLinks.length} nav links`);
  } else {
    console.log(`  Nav: ${navLinks.length} links OK`);
  }

  // Check footer
  const footerText = await page.$eval('.footer', el => el.textContent);
  const hasPhone = footerText.includes('258-5035');
  const hasEmail = footerText.includes('placerforestschool@gmail.com');
  const hasCopyright = footerText.includes('2026');
  const hasSchedule = footerText.includes('Monday') || footerText.includes('Monday');
  if (!hasPhone || !hasEmail || !hasCopyright) {
    const missing = [];
    if (!hasPhone) missing.push('phone');
    if (!hasEmail) missing.push('email');
    if (!hasCopyright) missing.push('2026 copyright');
    console.log(`  FOOTER MISSING: ${missing.join(', ')}`);
    issues.push(`${pg.name}: Footer missing ${missing.join(', ')}`);
  } else {
    console.log(`  Footer: OK (phone, email, copyright 2026)`);
  }

  // Check for stale times
  const bodyText = await page.textContent('body');
  const timePattern = /\d{1,2}:\d{2}\s*(AM|PM|am|pm)/g;
  const times = bodyText.match(timePattern);
  if (times) {
    console.log(`  STALE TIMES FOUND: ${times.join(', ')}`);
    issues.push(`${pg.name}: Stale times found - ${times.join(', ')}`);
  }

  // Page-specific checks
  if (pg.name === 'Home') {
    const slides = await page.$$('.carousel-slide');
    const dots = await page.$$('.dot');
    console.log(`  Carousel: ${slides.length} slides, ${dots.length} dots`);
    if (slides.length !== dots.length) issues.push(`Home: Carousel mismatch - ${slides.length} slides vs ${dots.length} dots`);

    const hasIntro = bodyText.includes('Nature-Based Drop-Off Program');
    const hasSchedule = bodyText.includes('Program Schedule');
    const hasMission = bodyText.includes('Mission Statement');
    const hasCTA = bodyText.includes('Ready to Learn More');
    console.log(`  Sections: intro=${hasIntro} schedule=${hasSchedule} mission=${hasMission} cta=${hasCTA}`);
    if (!hasIntro) issues.push('Home: Missing intro section');
    if (!hasSchedule) issues.push('Home: Missing schedule section');
    if (!hasMission) issues.push('Home: Missing mission section');
  }

  if (pg.name === 'About') {
    const teamMembers = await page.$$('.team-member');
    const hasGosia = bodyText.includes('Gosia');
    const hasBeth = bodyText.includes('Beth');
    console.log(`  Team: ${teamMembers.length} members, Gosia=${hasGosia}, Beth=${hasBeth}`);
    if (!hasGosia) issues.push('About: Missing Gosia bio');
    if (!hasBeth) issues.push('About: Missing Beth bio');
    if (teamMembers.length < 2) issues.push(`About: Only ${teamMembers.length} team members (expected 2)`);
  }

  if (pg.name === 'FAQs') {
    const faqItems = await page.$$('.faq-item');
    console.log(`  FAQ items: ${faqItems.length}`);
    if (faqItems.length < 3) issues.push(`FAQs: Only ${faqItems.length} FAQ items`);
    const hasContact = bodyText.includes('Still Have Questions');
    console.log(`  Has contact CTA: ${hasContact}`);
  }

  if (pg.name === 'Contact') {
    const hasForm = (await page.$$('#contactForm')).length > 0;
    const hasPhoneLink = bodyText.includes('258-5035');
    console.log(`  Contact form: ${hasForm}, Phone: ${hasPhoneLink}`);
    if (!hasForm) issues.push('Contact: Missing contact form');
  }

  if (pg.name === 'Enrollment') {
    const hasIframe = (await page.$$('iframe#google-form')).length > 0;
    console.log(`  Google Form iframe: ${hasIframe}`);
    if (!hasIframe) issues.push('Enrollment: Missing Google Form iframe');
  }

  if (pg.name === 'Resources') {
    const hasReading = bodyText.includes('Recommended Reading') || bodyText.includes('Balanced and Barefoot');
    console.log(`  Has reading section: ${hasReading}`);
    if (!hasReading) issues.push('Resources: Missing reading section');
  }

  // Mobile check
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(500);
  const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientW = await page.evaluate(() => document.documentElement.clientWidth);
  if (scrollW > clientW + 5) {
    console.log(`  MOBILE OVERFLOW: scrollWidth=${scrollW} > clientWidth=${clientW}`);
    issues.push(`${pg.name}: Mobile horizontal overflow (${scrollW} > ${clientW})`);
  } else {
    console.log(`  Mobile: OK (no overflow)`);
  }

  await page.close();
}

console.log('\n\n========== AUDIT SUMMARY ==========');
if (issues.length === 0) {
  console.log('ALL CHECKS PASSED! No issues found.');
} else {
  console.log(`${issues.length} ISSUES FOUND:`);
  issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
}

await browser.close();
