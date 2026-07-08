import { test, expect, Page } from '@playwright/test';

/**
 * End-to-end verification for Placer Forest School.
 *
 * Goal of this suite: prove that after removing outdated program offerings
 * (Summer Day Camps, Spring Session, fixed dates/times/prices), every page
 * still loads and works, navigation works end to end, and NO specific
 * program dates/times/prices leak anywhere. All current offerings now live
 * only in the embedded Google Form.
 */

// Every page in the site nav, plus the footer-linked Terms page.
const PAGES = [
  { path: '/index.html',       heading: 'Rooted in Respect' },
  { path: '/about.html',       heading: 'About Placer Forest School' },
  { path: '/enrollment.html',  heading: 'Join Our Forest Community' },
  { path: '/resources.html',   heading: 'Resources for Families' },
  { path: '/faqs.html',        heading: 'Frequently Asked Questions' },
  { path: '/contact.html',     heading: 'Contact Us' },
  { path: '/terms.html',       heading: 'Waiver & Release of Liability' },
];

// Text that must NOT appear anywhere on a rendered page (body OR head/meta).
// These are the outdated program specifics that were removed.
const FORBIDDEN: { label: string; re: RegExp }[] = [
  { label: 'summer',                re: /summer/i },
  { label: 'day camp(s)',           re: /\bcamps?\b/i },
  { label: 'Spring Session',        re: /spring session/i },
  { label: 'dollar price',          re: /\$\s?\d/ },
  { label: 'early bird',            re: /early bird/i },
  { label: 'early registration',    re: /early registration/i },
  { label: '9 AM schedule',         re: /\b9\s?AM\b/i },
  { label: 'Fridays schedule',      re: /Fridays\b/i },
  { label: '10-week',               re: /\b10[\s-]?week/i },
  { label: '4 hours/week',          re: /\b4\s?hours?\s?(per|\/|each)/i },
];

// Wait until dynamic JSON-driven content has rendered.
async function settle(page: Page) {
  await page.waitForLoadState('domcontentloaded');
  // content-manager.js / *-dynamic.js populate nav + footer + content after fetch.
  await page.waitForSelector('footer', { timeout: 15000 });
  await page.waitForTimeout(600);
}

test.describe('All pages load and are clean of outdated program specifics', () => {
  for (const p of PAGES) {
    test(`${p.path} loads, renders, and has no outdated specifics`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));

      const resp = await page.goto(p.path);
      expect(resp?.status(), `${p.path} should return HTTP 200`).toBeLessThan(400);
      await settle(page);

      // Heading present
      await expect(page.locator('h1').first()).toContainText(p.heading);

      // Nav + footer present
      await expect(page.locator('nav .nav-menu a').first()).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();

      // No forbidden program specifics anywhere (rendered HTML incl. head/meta).
      const html = await page.content();
      for (const f of FORBIDDEN) {
        expect(f.re.test(html), `${p.path} must not contain "${f.label}"`).toBe(false);
      }

      // No uncaught JS errors while rendering.
      expect(errors, `${p.path} had JS errors: ${errors.join('; ')}`).toHaveLength(0);
    });
  }
});

test.describe('Enrollment page — Google-Form-only offerings', () => {
  test('shows pointer to the form and embeds the Google Form', async ({ page }) => {
    await page.goto('/enrollment.html');
    await settle(page);
    await page.waitForSelector('#pricing-section .pricing-card', { timeout: 15000 });

    // The new pointer line replaces the old program cards.
    await expect(
      page.locator('#pricing-section')
    ).toContainText(/current programs, dates, and pricing/i);

    // General (kept) info is still present.
    await expect(page.locator('#pricing-section')).toContainText(/Ages We Welcome/i);
    await expect(page.locator('#pricing-section')).toContainText(/charter school funds/i);

    // Old program-card structure is gone.
    await expect(page.locator('.program-card')).toHaveCount(0);

    // Google Form is embedded (offerings are managed there).
    const iframe = page.locator('iframe#google-form');
    await expect(iframe).toHaveAttribute('src', /docs\.google\.com\/forms/);
  });
});

test.describe('Navigation works end to end', () => {
  test('every nav link routes to the right page', async ({ page }) => {
    await page.goto('/index.html');
    await settle(page);

    const targets = [
      { text: 'About Us',   heading: 'About Placer Forest School' },
      { text: 'Enrollment', heading: 'Join Our Forest Community' },
      { text: 'Resources',  heading: 'Resources for Families' },
      { text: 'FAQs',       heading: 'Frequently Asked Questions' },
      { text: 'Contact',    heading: 'Contact Us' },
      { text: 'Home',       heading: 'Rooted in Respect' },
    ];

    for (const t of targets) {
      await page.locator('nav .nav-menu a', { hasText: t.text }).first().click();
      await settle(page);
      await expect(page.locator('h1').first()).toContainText(t.heading);
    }
  });
});
