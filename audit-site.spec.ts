import { test, expect } from '@playwright/test';

test.describe('Placer Forest School - Content Verification', () => {
  
  // Test 1: Verify Home Page Schedule
  test('should display Monday, Wednesday, Friday schedule on home page', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    
    // Check for new schedule
    await expect(page.locator('text=Monday, Wednesday, and Friday')).toBeVisible();
    await expect(page.locator('text=11:30 AM - 3:30 PM')).toBeVisible();
    await expect(page.locator('text=10-week session starting January 5th')).toBeVisible();
    
    // Verify old schedule is NOT present
    const fridaysOnly = page.locator('text=Fridays');
    const oldTime = page.locator('text=9:00 AM - 1:00 PM');
    const oldStart = page.locator('text=September 19th');
    
    // Check if these old references are NOT in the schedule card
    const scheduleCard = page.locator('.schedule-card');
    await expect(scheduleCard.locator('text=Fridays').or(oldTime)).not.toBeVisible();
  });

  // Test 2: Verify Home Page Pricing
  test('should display $520 pricing on home page', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    
    await expect(page.locator('text=$520 per session')).toBeVisible();
    await expect(page.locator('text=4 hours/week')).toBeVisible();
  });

  // Test 3: Verify Enrollment Page Program Options
  test('should have three program options on enrollment page', async ({ page }) => {
    await page.goto('http://localhost:3000/enrollment.html');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check for the three program options
    await expect(page.locator('text=Monday Program')).toBeVisible();
    await expect(page.locator('text=Wednesday Program')).toBeVisible();
    await expect(page.locator('text=Friday Program')).toBeVisible();
    
    // Verify they all have the new time
    await expect(page.locator('text=11:30 AM - 3:30 PM')).toBeVisible();
  });

  // Test 4: Verify Enrollment Page Pricing Details
  test('should display correct pricing on enrollment page', async ({ page }) => {
    await page.goto('http://localhost:3000/enrollment.html');
    
    await page.waitForLoadState('networkidle');
    
    // Check new pricing details
    await expect(page.locator('text=Session Length: 4 hours per week for 10 consecutive weeks')).toBeVisible();
    await expect(page.locator('text=starting the week of 01/05')).toBeVisible();
    await expect(page.locator('text=Format: Drop-off program')).toBeVisible();
    await expect(page.locator('text=Tuition: $520 per session')).toBeVisible();
    await expect(page.locator('text=Sibling Discount: 10% off tuition')).toBeVisible();
    await expect(page.locator('text=Charter Funds: We accept charter school funds')).toBeVisible();
    await expect(page.locator('text=Ages We Welcome: Children ages 4–12')).toBeVisible();
  });

  // Test 5: Verify Enrollment Page Refund Policy
  test('should display nonrefundable tuition policy on enrollment page', async ({ page }) => {
    await page.goto('http://localhost:3000/enrollment.html');
    
    await page.waitForLoadState('networkidle');
    
    // Check for refund policy
    await expect(page.locator('text=Refund Policy')).toBeVisible();
    await expect(page.locator('text=Tuition is nonrefundable once classes start')).toBeVisible();
  });

  // Test 6: Verify Terms Page has Nonrefundable Clause
  test('should display nonrefundable tuition clause on terms page', async ({ page }) => {
    await page.goto('http://localhost:3000/terms.html');
    
    await expect(page.locator('text=Nonrefundable Tuition Policy')).toBeVisible();
    await expect(page.locator('text=Tuition is nonrefundable once classes start')).toBeVisible();
  });

  // Test 7: Verify FAQs Page Updated Information
  test('should show updated FAQ information', async ({ page }) => {
    await page.goto('http://localhost:3000/faqs.html');
    
    await page.waitForLoadState('networkidle');
    
    // Check for updated rate information
    await expect(page.locator('text=Tuition is $520 per session')).toBeVisible();
    await expect(page.locator('text=10-week session')).toBeVisible();
    
    // Check for program schedule information
    await expect(page.locator('text=Monday, Wednesday, and Friday')).toBeVisible();
    await expect(page.locator('text=11:30 AM to 3:30 PM')).toBeVisible();
  });

  // Test 8: Verify Footer on Multiple Pages Shows New Schedule
  test('should display new schedule in footer across pages', async ({ page }) => {
    const pages = [
      'http://localhost:3000/index.html',
      'http://localhost:3000/enrollment.html',
      'http://localhost:3000/about.html',
      'http://localhost:3000/faqs.html'
    ];
    
    for (const url of pages) {
      await page.goto(url);
      
      // Check footer contains new schedule
      const footer = page.locator('.footer');
      await expect(footer.locator('text=Monday, Wednesday, and Friday: 11:30 AM - 3:30 PM')).toBeVisible();
      await expect(footer.locator('text=Nature-based drop-off program')).toBeVisible();
    }
  });

  // Test 9: Verify Home Page Intro Text Updated
  test('should have updated intro text mentioning three programs', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');
    
    // Check that the intro mentions programs (plural)
    await expect(page.locator('text=our programs meet Monday, Wednesday, and Friday')).toBeVisible();
  });

  // Test 10: Verify Enrollment Footer Updated
  test('should have updated footer on enrollment page', async ({ page }) => {
    await page.goto('http://localhost:3000/enrollment.html');
    
    const footer = page.locator('.footer');
    await expect(footer.locator('text=Monday, Wednesday, and Friday: 11:30 AM - 3:30 PM')).toBeVisible();
    await expect(footer.locator('text=Ages 4-12 years old')).toBeVisible();
  });

  // Test 11: Verify Contact Page Shows New Schedule
  test('should show new schedule on contact page footer', async ({ page }) => {
    await page.goto('http://localhost:3000/contact.html');
    
    const footer = page.locator('.footer');
    await expect(footer.locator('text=Monday, Wednesday, and Friday: 11:30 AM - 3:30 PM')).toBeVisible();
  });

  // Test 12: Verify Resources Page Shows New Schedule
  test('should show new schedule on resources page footer', async ({ page }) => {
    await page.goto('http://localhost:3000/resources.html');
    
    const footer = page.locator('.footer');
    await expect(footer.locator('text=Monday, Wednesday, and Friday: 11:30 AM - 3:30 PM')).toBeVisible();
  });

  // Test 13: Verify old pricing is removed from enrollment
  test('should not show old pricing ($11.50/hour or $552)', async ({ page }) => {
    await page.goto('http://localhost:3000/enrollment.html');
    
    await page.waitForLoadState('networkidle');
    
    // These old values should not be on the enrollment page
    const page_content = await page.content();
    
    // Check that old pricing is not visible in main content
    expect(page_content).not.toContain('$11.50/hour');
    expect(page_content).not.toContain('$552');
    expect(page_content).not.toContain('12-week session');
  });

  // Test 14: Verify new pricing is consistent
  test('should consistently show $520 pricing across pages', async ({ page }) => {
    const pagesToCheck = [
      'http://localhost:3000/index.html',
      'http://localhost:3000/enrollment.html'
    ];
    
    for (const url of pagesToCheck) {
      await page.goto(url);
      
      // Look for any reference to the new pricing
      const content = await page.content();
      expect(content).toContain('$520');
    }
  });
});

