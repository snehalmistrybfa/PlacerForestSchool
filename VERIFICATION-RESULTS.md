# Placer Forest School - Website Verification Results

**Date:** 2026-02-23  
**Tool:** Playwright 1.56.1 (Chromium)  
**Server:** Local HTTP server on port 8787  
**Test File:** `verification-test.spec.ts`

---

## Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 56 |
| **Passed** | 55 |
| **Failed** | 1 |
| **Pass Rate** | 98.2% |

---

## Results by Category

### 1. Pages Load Without Console Errors — 6/7 PASSED

| Page | Result | Notes |
|------|--------|-------|
| index.html | PASS | No errors |
| about.html | PASS | No errors |
| enrollment.html | PASS | No errors |
| faqs.html | PASS | No errors |
| contact.html | **FAIL** | `contactSubmitted is not defined` — see details below |
| resources.html | PASS | No errors |
| terms.html | PASS | No errors |

**Failure Detail:** In `contact.html`, line 169, the `<iframe>` element's `onload` attribute references `contactSubmitted`, which is declared with `let` inside a `<script>` block (line 203). Because `let` is block-scoped, it is not accessible from the inline `onload` handler, which runs in global scope. The variable should be declared with `var` or moved to the global `window` object (e.g., `window.contactSubmitted`).

### 2. Google Fonts Loading (Lora & Source Sans 3) — 7/7 PASSED

| Page | Result |
|------|--------|
| index.html | PASS |
| about.html | PASS |
| enrollment.html | PASS |
| faqs.html | PASS |
| contact.html | PASS |
| resources.html | PASS |
| terms.html | PASS |

All pages correctly reference both Lora and Source Sans 3 from Google Fonts.

### 3. All Images Load (No Broken Images) — 8/8 PASSED

| Page / Check | Result |
|------|--------|
| index.html | PASS |
| about.html | PASS |
| enrollment.html | PASS |
| faqs.html | PASS |
| contact.html | PASS |
| resources.html | PASS |
| terms.html | PASS |
| Carousel images 1-8 (HTTP 200) | PASS |

All images load successfully. All eight carousel images (`carousel-1.jpg` through `carousel-8.jpg`) return HTTP 200.

### 4. Copyright Year Shows 2026 — 7/7 PASSED

| Page | Result |
|------|--------|
| index.html | PASS |
| about.html | PASS |
| enrollment.html | PASS |
| faqs.html | PASS |
| contact.html | PASS |
| resources.html | PASS |
| terms.html | PASS |

All pages display "© 2026" in the footer.

### 5. No Specific Times on Pages — 7/7 PASSED

| Page | Result |
|------|--------|
| index.html | PASS |
| about.html | PASS |
| enrollment.html | PASS |
| faqs.html | PASS |
| contact.html | PASS |
| resources.html | PASS |
| terms.html | PASS |

No instances of times like "10:00 AM", "11:30 AM", "3:30 PM", "9 AM", etc. were found on any page.

### 6. Schedule Shows "Monday, Wednesday & Friday" — 3/3 PASSED

| Check | Result |
|-------|--------|
| index.html mentions Mon/Wed/Fri | PASS |
| enrollment.html schedule days | PASS |
| faqs.html schedule days | PASS |

The schedule correctly lists "Monday, Wednesday & Friday" without specific times.

### 7. Phone Number is (916) 258-5035 — 8/8 PASSED

| Page / Check | Result |
|------|--------|
| index.html — no placeholder phone | PASS |
| about.html — no placeholder phone | PASS |
| enrollment.html — no placeholder phone | PASS |
| faqs.html — no placeholder phone | PASS |
| contact.html — no placeholder phone | PASS |
| resources.html — no placeholder phone | PASS |
| terms.html — no placeholder phone | PASS |
| contact.html shows (916) 258-5035 | PASS |

No placeholder phone numbers found. The correct number (916) 258-5035 is displayed on contact.html.

### 8. Carousel Has 8 Slides and 8 Dots — 2/2 PASSED

| Check | Result |
|-------|--------|
| 8 carousel slides on homepage | PASS |
| 8 carousel dots/indicators on homepage | PASS |

The homepage carousel contains exactly 8 slides and 8 navigation dots.

### 9. Mobile Responsiveness at 375px — 7/7 PASSED

| Page | Result |
|------|--------|
| index.html | PASS |
| about.html | PASS |
| enrollment.html | PASS |
| faqs.html | PASS |
| contact.html | PASS |
| resources.html | PASS |
| terms.html | PASS |

All pages render at 375px viewport width (iPhone X) without horizontal scrollbar. A 5px tolerance was used.

---

## Action Items

### Must Fix (1 issue)

1. **contact.html — JavaScript scope error:** The `contactSubmitted` variable is declared with `let` inside a `<script>` block (line 203) but referenced in the `<iframe onload="...">` attribute (line 169). Inline event handlers execute in global scope and cannot access block-scoped `let` variables. **Fix:** Change `let contactSubmitted = false;` to `var contactSubmitted = false;` or assign it to `window.contactSubmitted`.

---

## Test Execution Details

- **Duration:** ~1.5 minutes
- **Browser:** Chromium (headless)
- **Viewport:** Default 1280x720 (desktop tests), 375x812 (mobile tests)
- **Server:** `python3 -m http.server 8787` from project root
- **Test file:** `/Users/s0m0ohl/placerforestschool/verification-test.spec.ts`
- **Config:** `/Users/s0m0ohl/placerforestschool/playwright.config.ts`

To re-run tests:
```bash
cd /Users/s0m0ohl/placerforestschool
python3 -m http.server 8787 &
npx playwright test --config=playwright.config.ts
```
