import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// ── Built-in HTTP Server ────────────────────────────────────────────
const ROOT = '/Users/s0m0ohl/placerforestschool';
const PORT = 8765;
const SCREENSHOTS_DIR = path.join(ROOT, 'tmp', 'audit-screenshots');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.mp4': 'video/mp4',
  '.heic': 'image/heic',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let urlPath = req.url.split('?')[0];
      if (urlPath === '/') urlPath = '/index.html';
      const filePath = path.join(ROOT, urlPath);
      const ext = path.extname(filePath);

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

// ── Ensure screenshots directory ────────────────────────────────────
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

// ── Pages to audit ──────────────────────────────────────────────────
const BASE = `http://localhost:${PORT}`;
const pages = [
  'index.html',
  'about.html',
  'enrollment.html',
  'faqs.html',
  'contact.html',
  'resources.html',
  'terms.html',
];

// ── Main audit ──────────────────────────────────────────────────────
async function runAudit() {
  const server = await startServer();
  const results = {};

  const browser = await chromium.launch({ headless: true });

  for (const pageName of pages) {
    const url = `${BASE}/${pageName}`;
    const slug = pageName.replace('.html', '');
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Auditing: ${pageName}`);
    console.log('='.repeat(60));

    const pageResult = {
      url,
      consoleErrors: [],
      brokenImages: [],
      brokenLinks: [],
      missingAltText: [],
      headingHierarchy: [],
      headingIssues: [],
      metaTags: {},
      fontStatus: [],
      accessibilityIssues: [],
      screenshotDesktop: '',
      screenshotMobile: '',
    };

    // ── Create a fresh context for each page ──
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // ── Capture console errors ──
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        pageResult.consoleErrors.push(msg.text());
      }
    });

    // ── Navigate ──
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      console.log(`  ERROR navigating to ${url}: ${e.message}`);
      results[pageName] = pageResult;
      await context.close();
      continue;
    }

    // ── 1. Check images ──
    console.log('  Checking images...');
    const images = await page.$$eval('img', (imgs) =>
      imgs.map((img) => ({
        src: img.src,
        alt: img.alt,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        complete: img.complete,
        displayed: img.offsetWidth > 0 || img.offsetHeight > 0,
      }))
    );

    for (const img of images) {
      if (!img.alt && !img.src.includes('data:')) {
        pageResult.missingAltText.push(img.src);
      }
      if (img.complete && img.naturalWidth === 0) {
        pageResult.brokenImages.push(img.src);
      }
    }
    console.log(`    Total images: ${images.length}`);
    console.log(`    Broken images: ${pageResult.brokenImages.length}`);
    console.log(`    Missing alt text: ${pageResult.missingAltText.length}`);

    // ── 2. Check links ──
    console.log('  Checking links...');
    const links = await page.$$eval('a[href]', (anchors) =>
      anchors.map((a) => ({
        href: a.href,
        text: a.textContent.trim().substring(0, 60),
      }))
    );

    for (const link of links) {
      // Only check internal links & skip mailto/tel/javascript
      if (
        link.href.startsWith(BASE) &&
        !link.href.includes('mailto:') &&
        !link.href.includes('tel:') &&
        !link.href.startsWith('javascript:')
      ) {
        try {
          const resp = await page.request.get(link.href);
          if (resp.status() >= 400) {
            pageResult.brokenLinks.push({
              href: link.href,
              text: link.text,
              status: resp.status(),
            });
          }
        } catch (e) {
          pageResult.brokenLinks.push({
            href: link.href,
            text: link.text,
            status: 'error: ' + e.message,
          });
        }
      }
    }
    console.log(`    Total links: ${links.length}`);
    console.log(`    Broken internal links: ${pageResult.brokenLinks.length}`);

    // ── 3. Heading hierarchy ──
    console.log('  Checking heading hierarchy...');
    const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (els) =>
      els.map((el) => ({
        tag: el.tagName,
        text: el.textContent.trim().substring(0, 80),
      }))
    );
    pageResult.headingHierarchy = headings;

    // Check for heading hierarchy issues
    let prevLevel = 0;
    for (const h of headings) {
      const level = parseInt(h.tag.replace('H', ''));
      if (level > prevLevel + 1 && prevLevel > 0) {
        pageResult.headingIssues.push(
          `Skipped heading level: ${h.tag} ("${h.text}") after H${prevLevel}`
        );
      }
      prevLevel = level;
    }

    // Check for multiple H1s
    const h1Count = headings.filter((h) => h.tag === 'H1').length;
    if (h1Count === 0) {
      pageResult.headingIssues.push('No H1 heading found on the page');
    } else if (h1Count > 1) {
      pageResult.headingIssues.push(`Multiple H1 headings found (${h1Count})`);
    }

    console.log(`    Headings: ${headings.length}`);
    console.log(`    Hierarchy issues: ${pageResult.headingIssues.length}`);

    // ── 4. Meta tags ──
    console.log('  Checking meta tags...');
    pageResult.metaTags = await page.evaluate(() => {
      const getMeta = (name) => {
        const el =
          document.querySelector(`meta[name="${name}"]`) ||
          document.querySelector(`meta[property="${name}"]`);
        return el ? el.getAttribute('content') : null;
      };
      return {
        title: document.title || null,
        description: getMeta('description'),
        keywords: getMeta('keywords'),
        viewport: getMeta('viewport'),
        ogTitle: getMeta('og:title'),
        ogDescription: getMeta('og:description'),
        ogImage: getMeta('og:image'),
        ogUrl: getMeta('og:url'),
        ogType: getMeta('og:type'),
        author: getMeta('author'),
        charset: document.querySelector('meta[charset]')?.getAttribute('charset') || null,
        lang: document.documentElement.lang || null,
      };
    });

    const missingMeta = [];
    if (!pageResult.metaTags.title) missingMeta.push('title');
    if (!pageResult.metaTags.description) missingMeta.push('meta description');
    if (!pageResult.metaTags.viewport) missingMeta.push('viewport');
    if (!pageResult.metaTags.lang) missingMeta.push('lang attribute');
    console.log(`    Missing meta: ${missingMeta.length > 0 ? missingMeta.join(', ') : 'none'}`);

    // ── 5. Font loading ──
    console.log('  Checking fonts...');
    const fontStatus = await page.evaluate(async () => {
      if (!document.fonts) return [{ note: 'document.fonts API not available' }];
      await document.fonts.ready;
      const results = [];
      document.fonts.forEach((font) => {
        results.push({
          family: font.family,
          style: font.style,
          weight: font.weight,
          status: font.status,
        });
      });
      return results;
    });
    pageResult.fontStatus = fontStatus;
    const loadedFonts = fontStatus.filter((f) => f.status === 'loaded').length;
    const failedFonts = fontStatus.filter((f) => f.status === 'error').length;
    console.log(`    Fonts loaded: ${loadedFonts}, failed: ${failedFonts}`);

    // ── 6. Additional accessibility checks ──
    console.log('  Checking accessibility...');

    // Check for form labels
    const formIssues = await page.evaluate(() => {
      const issues = [];
      const inputs = document.querySelectorAll('input, select, textarea');
      inputs.forEach((input) => {
        const id = input.id;
        const type = input.type;
        if (type === 'hidden' || type === 'submit' || type === 'button') return;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledby = input.getAttribute('aria-labelledby');
        const isWrappedInLabel = input.closest('label');
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby && !isWrappedInLabel) {
          issues.push(`Input "${id || type || 'unknown'}" has no associated label`);
        }
      });
      return issues;
    });
    pageResult.accessibilityIssues.push(...formIssues);

    // Check for color contrast on buttons/links (basic check)
    const contrastIssues = await page.evaluate(() => {
      const issues = [];
      const buttons = document.querySelectorAll('button, .btn, a.cta-button, a.nav-link');
      buttons.forEach((btn) => {
        const style = window.getComputedStyle(btn);
        if (style.color === style.backgroundColor && style.display !== 'none') {
          issues.push(`Potential contrast issue on "${btn.textContent.trim().substring(0, 30)}"`);
        }
      });
      return issues;
    });
    pageResult.accessibilityIssues.push(...contrastIssues);

    // Check for skip navigation link
    const hasSkipNav = await page.evaluate(() => {
      const firstLink = document.querySelector('a');
      return firstLink && firstLink.textContent.toLowerCase().includes('skip');
    });
    if (!hasSkipNav) {
      pageResult.accessibilityIssues.push('No "skip to content" navigation link found');
    }

    // Check for ARIA landmarks
    const landmarks = await page.evaluate(() => {
      return {
        hasMain: !!document.querySelector('main, [role="main"]'),
        hasNav: !!document.querySelector('nav, [role="navigation"]'),
        hasFooter: !!document.querySelector('footer, [role="contentinfo"]'),
        hasHeader: !!document.querySelector('header, [role="banner"]'),
      };
    });
    if (!landmarks.hasMain) pageResult.accessibilityIssues.push('No <main> landmark');
    if (!landmarks.hasNav) pageResult.accessibilityIssues.push('No <nav> landmark');
    if (!landmarks.hasFooter) pageResult.accessibilityIssues.push('No <footer> landmark');

    console.log(`    Accessibility issues: ${pageResult.accessibilityIssues.length}`);

    // ── 7. Desktop screenshot (1440px) ──
    console.log('  Taking desktop screenshot (1440px)...');
    const desktopPath = path.join(SCREENSHOTS_DIR, `${slug}-desktop-1440.png`);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: desktopPath, fullPage: true });
    pageResult.screenshotDesktop = desktopPath;

    // ── 8. Mobile screenshot (375px) ──
    console.log('  Taking mobile screenshot (375px)...');
    const mobilePath = path.join(SCREENSHOTS_DIR, `${slug}-mobile-375.png`);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(500);
    await page.screenshot({ path: mobilePath, fullPage: true });
    pageResult.screenshotMobile = mobilePath;

    results[pageName] = pageResult;
    await context.close();
  }

  await browser.close();

  // ── Print summary report ──
  console.log('\n\n');
  console.log('='.repeat(80));
  console.log('  PLACER FOREST SCHOOL - COMPREHENSIVE SITE AUDIT REPORT');
  console.log('='.repeat(80));
  console.log(`  Date: ${new Date().toISOString()}`);
  console.log(`  Base URL: ${BASE}`);
  console.log(`  Pages audited: ${pages.length}`);
  console.log('='.repeat(80));

  let totalIssues = 0;

  for (const [pageName, r] of Object.entries(results)) {
    console.log(`\n${'─'.repeat(80)}`);
    console.log(`  PAGE: ${pageName}`);
    console.log('─'.repeat(80));

    // Console Errors
    if (r.consoleErrors.length > 0) {
      console.log(`\n  CONSOLE ERRORS (${r.consoleErrors.length}):`);
      r.consoleErrors.forEach((e) => console.log(`    - ${e}`));
      totalIssues += r.consoleErrors.length;
    }

    // Broken Images
    if (r.brokenImages.length > 0) {
      console.log(`\n  BROKEN IMAGES (${r.brokenImages.length}):`);
      r.brokenImages.forEach((img) => console.log(`    - ${img}`));
      totalIssues += r.brokenImages.length;
    }

    // Missing Alt Text
    if (r.missingAltText.length > 0) {
      console.log(`\n  MISSING ALT TEXT (${r.missingAltText.length}):`);
      r.missingAltText.forEach((img) => console.log(`    - ${img}`));
      totalIssues += r.missingAltText.length;
    }

    // Broken Links
    if (r.brokenLinks.length > 0) {
      console.log(`\n  BROKEN LINKS (${r.brokenLinks.length}):`);
      r.brokenLinks.forEach((l) => console.log(`    - [${l.status}] ${l.href} ("${l.text}")`));
      totalIssues += r.brokenLinks.length;
    }

    // Heading Hierarchy
    console.log(`\n  HEADING HIERARCHY (${r.headingHierarchy.length} headings):`);
    r.headingHierarchy.forEach((h) => {
      const indent = '  '.repeat(parseInt(h.tag.replace('H', '')) - 1);
      console.log(`    ${indent}${h.tag}: ${h.text}`);
    });
    if (r.headingIssues.length > 0) {
      console.log(`  HEADING ISSUES (${r.headingIssues.length}):`);
      r.headingIssues.forEach((i) => console.log(`    - ${i}`));
      totalIssues += r.headingIssues.length;
    }

    // Meta Tags
    console.log('\n  META TAGS:');
    for (const [key, val] of Object.entries(r.metaTags)) {
      const status = val ? 'OK' : 'MISSING';
      const display = val ? (val.length > 70 ? val.substring(0, 70) + '...' : val) : '';
      console.log(`    ${status.padEnd(8)} ${key}: ${display}`);
    }

    // Fonts
    if (r.fontStatus.length > 0) {
      const failed = r.fontStatus.filter((f) => f.status === 'error');
      const loaded = r.fontStatus.filter((f) => f.status === 'loaded');
      console.log(`\n  FONTS: ${loaded.length} loaded, ${failed.length} failed`);
      if (failed.length > 0) {
        failed.forEach((f) =>
          console.log(`    FAILED: ${f.family} (${f.weight} ${f.style})`)
        );
        totalIssues += failed.length;
      }
    }

    // Accessibility
    if (r.accessibilityIssues.length > 0) {
      console.log(`\n  ACCESSIBILITY ISSUES (${r.accessibilityIssues.length}):`);
      r.accessibilityIssues.forEach((i) => console.log(`    - ${i}`));
      totalIssues += r.accessibilityIssues.length;
    }

    // Screenshots
    console.log(`\n  SCREENSHOTS:`);
    console.log(`    Desktop: ${r.screenshotDesktop}`);
    console.log(`    Mobile:  ${r.screenshotMobile}`);
  }

  console.log(`\n${'='.repeat(80)}`);
  console.log(`  TOTAL ISSUES FOUND: ${totalIssues}`);
  console.log('='.repeat(80));

  // ── Save JSON results ──
  const jsonPath = path.join(ROOT, 'tmp', 'audit-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`\nDetailed results saved to: ${jsonPath}`);

  // ── Shutdown server ──
  server.close();
  console.log('Server stopped. Audit complete.');
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
