import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:8787';
const PAGES = [
  { name: 'index.html', path: '/index.html' },
  { name: 'about.html', path: '/about.html' },
  { name: 'enrollment.html', path: '/enrollment.html' },
  { name: 'faqs.html', path: '/faqs.html' },
  { name: 'contact.html', path: '/contact.html' },
  { name: 'resources.html', path: '/resources.html' },
  { name: 'terms.html', path: '/terms.html' },
];

// 1. All pages load without console errors
test.describe('1. Pages load without console errors', () => {
  for (const pg of PAGES) {
    test(`${pg.name} has no console errors`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      page.on('pageerror', err => errors.push(err.message));
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
      expect(errors, `Console errors on ${pg.name}: ${errors.join('; ')}`).toEqual([]);
    });
  }
});

// 2. Google Fonts load (Lora and Source Sans 3)
test.describe('2. Google Fonts loading', () => {
  for (const pg of PAGES) {
    test(`${pg.name} loads Lora and Source Sans 3 fonts`, async ({ page }) => {
      const fontRequests: string[] = [];
      page.on('request', req => {
        const url = req.url();
        if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
          fontRequests.push(url);
        }
      });
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });

      const linkHrefs = await page.$$eval('link[href*="fonts.googleapis.com"]', els =>
        els.map(el => el.getAttribute('href') || '')
      );
      const allFontText = [...linkHrefs, ...fontRequests].join(' ');
      expect(allFontText, `Lora font not referenced on ${pg.name}`).toMatch(/Lora/i);
      expect(allFontText, `Source Sans 3 font not referenced on ${pg.name}`).toMatch(/Source\+Sans\+3|Source%20Sans%203|Source Sans 3/i);
    });
  }
});

// 3. All images load (no broken images)
test.describe('3. All images load without errors', () => {
  for (const pg of PAGES) {
    test(`${pg.name} has no broken images`, async ({ page }) => {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
      const broken = await page.$$eval('img', imgs =>
        imgs
          .filter(img => !img.complete || img.naturalWidth === 0)
          .map(img => img.src)
      );
      expect(broken, `Broken images on ${pg.name}: ${broken.join(', ')}`).toEqual([]);
    });
  }

  test('Carousel images 1-8 load via HTTP', async ({ page }) => {
    const results: { file: string; status: number }[] = [];
    for (let i = 1; i <= 8; i++) {
      const resp = await page.request.get(`${BASE}/images/carousel-${i}.jpg`);
      results.push({ file: `carousel-${i}.jpg`, status: resp.status() });
    }
    for (const r of results) {
      expect(r.status, `${r.file} returned ${r.status}`).toBe(200);
    }
  });
});

// 4. Copyright year shows 2026
test.describe('4. Copyright year is 2026', () => {
  for (const pg of PAGES) {
    test(`${pg.name} shows copyright 2026`, async ({ page }) => {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
      const bodyText = await page.textContent('body');
      const hasCopyright2026 =
        bodyText?.includes('\u00A9 2026') ||
        bodyText?.includes('\u00A92026') ||
        bodyText?.includes('Copyright 2026');
      expect(hasCopyright2026, `Copyright 2026 not found on ${pg.name}. Body snippet near copyright: ${bodyText?.match(/.{0,30}\u00A9.{0,30}/)?.[0] || 'no copyright symbol found'}`).toBeTruthy();
    });
  }
});

// 5. No specific times appear on any page
test.describe('5. No specific times on pages', () => {
  const timePatterns = [
    /\b\d{1,2}:\d{2}\s*(?:AM|PM|am|pm|a\.m\.|p\.m\.)\b/g,
    /\b\d{1,2}\s+(?:AM|PM|am|pm|a\.m\.|p\.m\.)\b/g,
  ];

  for (const pg of PAGES) {
    test(`${pg.name} has no specific times`, async ({ page }) => {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
      const bodyText = await page.textContent('body') || '';
      const matches: string[] = [];
      for (const pat of timePatterns) {
        const m = bodyText.match(pat);
        if (m) matches.push(...m);
      }
      expect(matches, `Times found on ${pg.name}: ${matches.join(', ')}`).toEqual([]);
    });
  }
});

// 6. Schedule shows Monday, Wednesday & Friday
test.describe('6. Schedule shows Monday, Wednesday & Friday', () => {
  test('index.html mentions Monday, Wednesday & Friday', async ({ page }) => {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const text = await page.textContent('body') || '';
    const hasSchedule = /Monday.*Wednesday.*Friday/i.test(text);
    expect(hasSchedule, `"Monday, Wednesday & Friday" not found on index.html`).toBeTruthy();
  });

  for (const pgName of ['enrollment.html', 'faqs.html']) {
    test(`${pgName} mentions schedule days if schedule is present`, async ({ page }) => {
      await page.goto(`${BASE}/${pgName}`, { waitUntil: 'networkidle' });
      const text = await page.textContent('body') || '';
      if (/schedule|session|day/i.test(text)) {
        const hasCorrectDays = /Monday/i.test(text) && /Wednesday/i.test(text) && /Friday/i.test(text);
        expect(hasCorrectDays, `${pgName} discusses schedule but doesn't mention Monday, Wednesday & Friday`).toBeTruthy();
      }
    });
  }
});

// 7. Phone number is (916) 258-5035
test.describe('7. Correct phone number (916) 258-5035', () => {
  for (const pg of PAGES) {
    test(`${pg.name} has no placeholder phone`, async ({ page }) => {
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });
      const text = await page.textContent('body') || '';
      expect(text, `Placeholder phone on ${pg.name}`).not.toMatch(/1234567890|123-456-7890|\(123\)\s*456/);
      if (/\(\d{3}\)\s*\d{3}[-.]\d{4}|\d{3}[-.]\d{3}[-.]\d{4}/.test(text)) {
        const hasCorrectPhone = text.includes('(916) 258-5035') || text.includes('916-258-5035') || text.includes('9162585035');
        expect(hasCorrectPhone, `Wrong phone number on ${pg.name}`).toBeTruthy();
      }
    });
  }

  test('contact.html specifically shows (916) 258-5035', async ({ page }) => {
    await page.goto(`${BASE}/contact.html`, { waitUntil: 'networkidle' });
    const text = await page.textContent('body') || '';
    expect(text).toContain('(916) 258-5035');
  });
});

// 8. Carousel has exactly 8 slides and 8 dots
test.describe('8. Carousel has 8 slides and 8 dots', () => {
  test('index.html carousel has 8 slides', async ({ page }) => {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    // Try multiple selectors to find carousel slides
    let count = await page.$$eval('.carousel-slide, .carousel-item, .slide', els => els.length);
    if (count === 0) {
      // Fallback: count carousel images
      count = await page.$$eval('img[src*="carousel"]', imgs => imgs.length);
    }
    expect(count, `Expected 8 carousel slides, found ${count}`).toBe(8);
  });

  test('index.html carousel has 8 dots/indicators', async ({ page }) => {
    await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    const dots = await page.$$('.carousel-dot, .dot, .carousel-indicator, .carousel-dots button, .carousel-dots span, .carousel-indicators button, .carousel-indicators li');
    expect(dots.length, `Expected 8 carousel dots, found ${dots.length}`).toBe(8);
  });
});

// 9. Mobile responsiveness at 375px
test.describe('9. Mobile responsiveness at 375px', () => {
  for (const pg of PAGES) {
    test(`${pg.name} renders at 375px without horizontal scroll`, async ({ browser }) => {
      const context = await browser.newContext({
        viewport: { width: 375, height: 812 },
      });
      const page = await context.newPage();
      await page.goto(`${BASE}${pg.path}`, { waitUntil: 'networkidle' });

      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

      expect(
        scrollWidth,
        `${pg.name} has horizontal scroll: scrollWidth=${scrollWidth}, clientWidth=${clientWidth}`
      ).toBeLessThanOrEqual(clientWidth + 5);

      await context.close();
    });
  }
});
