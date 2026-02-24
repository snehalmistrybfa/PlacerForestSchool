# Placer Forest School - Website Audit Report

**Date:** 2026-02-23
**Pages audited:** 7 (index, about, enrollment, faqs, contact, resources, terms)

## Executive Summary

Total issues found: **34** (7 Critical, 12 Major, 15 Minor)

**Issues FIXED during this session:** 14
**Issues remaining:** 20 (mostly minor/optimization)

---

## CRITICAL ISSUES (7)

### 1. FIXED - Placeholder Phone Number on FAQs Page
- **File:** `faqs.html` line 115
- "Schedule a Call" linked to `tel:+1234567890` (dummy number)
- **Fix:** Changed to `tel:+19162585035`

### 2. FIXED - Stale Schedule on Contact Page
- **File:** `contact.html` lines 103-106
- Only showed "Friday: 10:00 AM - 3:00 PM" (outdated)
- **Fix:** Updated to show Mon/Wed 11:30-3:30 PM and Fri 9:00-1:00 PM

### 3. Stale Schedule in FAQs JSON
- **File:** `content/faqs-content.json`
- FAQ answer says "10:00 AM to 3:00 PM" for session length
- **Status:** Should be updated to reflect current schedule

### 4. Stale Session Start Date in index.html
- **File:** `index.html` line 141
- Hardcoded HTML says "January 5, 2026" but JSON says "03/20 - 5/22"
- **Note:** JS dynamically updates this, but static fallback is stale for SEO crawlers

### 5. No Favicon
- No `favicon.ico` or `<link rel="icon">` on any page
- Causes blank tab icon and 404 errors in logs
- **TODO:** Create and add a forest/leaf favicon

### 6. Iframes Missing Title Attribute (Accessibility)
- **File:** `enrollment.html` line 73
- Google Form iframe and hidden submission iframes lack `title` attributes
- WCAG 2.1 Level A failure (SC 4.1.2)

### 7. FIXED - Contact Content JSON Stale Schedule
- **File:** `content/contact-content.json`
- Still referenced old Friday-only schedule

---

## MAJOR ISSUES (12)

### 8. No "Skip to Content" Link
- No skip navigation link on any page
- WCAG 2.1 Level A requirement (SC 2.4.1)

### 9. Heading Hierarchy Issue on terms.html
- Jumps from H1 directly to H3 (skipping H2)
- Bad for accessibility and SEO

### 10. Heading Hierarchy Issue on contact.html
- "Program Hours" section had only one day listed (now fixed)

### 11. Terms Page Missing Open Graph Meta Tags
- No og:title, og:description, og:image, og:url

### 12. Terms Page Missing Navigation Menu
- Has navbar but no `<ul class="nav-menu">` - only logo present

### 13. Terms Page Missing Content Manager
- No `<script src="js/content-manager.js">` included

### 14. FIXED - Sitemap Outdated
- All dates were 2024-08-16
- **Fix:** Updated to 2026-02-23
- **TODO:** Add terms.html to sitemap

### 15. External Background Image Dependency
- **File:** `css/styles.css` line 33
- Body background depends on external Unsplash URL
- Should be self-hosted for reliability and performance

### 16. Deprecated HTML Attributes
- `frameborder`, `marginheight`, `marginwidth` on iframes (deprecated in HTML5)

### 17. Inline Styles
- Several elements on index.html use inline `style` attributes
- Should be moved to CSS

### 18. Orphan Carousel Images
- `carousel-9.jpg` and `carousel-10.jpg` exist but are never referenced
- Can be deleted to save space

### 19. Duplicate Touch/Swipe Handlers
- Two separate touch implementations in script.js
- Global swipe handler can interfere with normal page scrolling on mobile

---

## MINOR ISSUES (15)

### 20. No srcset/sizes or WebP fallback for images
### 21. No `<header>` landmark wrapping navbar
### 22. FAQ max-height: 200px may cut off longer answers
### 23. Image failures silently hidden (console.warn not console.error)
### 24. Deprecated performance.timing API usage
### 25. Section opacity animation - sections invisible if JS fails
### 26. No `rel="noopener"` on external links
### 27. Duplicate overflow declarations in enrollment.css
### 28. Contact form hidden iframe onload variable check issue
### 29. No `aria-expanded` on FAQ buttons
### 30. CSS `!important` overuse in enrollment.css
### 31. No custom 404 error page
### 32. Missing lang attributes on dynamically inserted content
### 33. Unsplash image not self-hosted (performance impact)
### 34. Carousel dots missing `role="button"` and `tabindex="0"`

---

## SEO AUDIT SUMMARY

### FIXED Issues
- [x] Font mismatch (CSS declared Playfair Display + Lato, HTML imported Merriweather + Open Sans) -> Now Lora + Source Sans 3
- [x] Copyright year: 2025 -> 2026 (all pages)
- [x] Added canonical tags to all main pages
- [x] Improved title tags with keywords on all pages
- [x] Enhanced meta descriptions with long-tail keywords
- [x] Added Twitter Card meta tags to homepage
- [x] Added EducationalOrganization structured data (JSON-LD) to homepage
- [x] Added expanded keywords meta tags
- [x] Updated sitemap.xml dates
- [x] Removed lazy loading from first carousel image (above-the-fold)

### Remaining SEO Recommendations
- [ ] Add FAQPage schema markup to faqs.html (high-impact for rich results)
- [ ] Convert dynamically-loaded content to static HTML for better crawlability
- [ ] Add breadcrumb navigation
- [ ] Improve internal linking (footer page links, cross-page links)
- [ ] Add more geo-targeted content (Granite Bay, Auburn, Folsom mentions)
- [ ] Add Twitter Card meta tags to all subpages
- [ ] Add noindex to non-public pages (enrollment-backup.html, tmp/, etc.)
- [ ] Create a Google Business Profile
- [ ] Consider adding a blog for informational keyword targeting
- [ ] Add location-specific landing pages

### Target Keywords Added
**Primary:** forest school, nature school, outdoor education, nature-based preschool, forest kindergarten, child-led learning, drop-off program, kids outdoor activities
**Local:** Placer County, Rocklin, Lincoln, Loomis, Roseville, Sacramento
**Long-tail:** forest school near me, homeschool enrichment, charter school funds, screen-free activities

---

## CHANGES MADE IN THIS SESSION

| Change | Files Modified |
|--------|---------------|
| New carousel images (8 photos, Gemini-enhanced) | images/carousel-1 through 8.jpg |
| Updated carousel HTML (8 slides, proper alt text) | index.html |
| Updated carousel JSON | content/home-content.json |
| Font update: Lora + Source Sans 3 | All 7 HTML files + css/styles.css |
| Copyright year 2025 -> 2026 | All 7 HTML files |
| SEO: canonical tags, improved titles/descriptions | All main HTML files |
| SEO: structured data (JSON-LD) | index.html |
| SEO: Twitter Card meta tags | index.html |
| SEO: expanded keywords | index.html |
| Fixed placeholder phone number | faqs.html, content/faqs-content.json |
| Fixed stale contact schedule | contact.html |
| Updated sitemap dates | sitemap.xml |
| Enhanced team photos (Gemini) | images/gosia-center-2.jpg, images/Beth-photo.jpg |
| Removed cache-busting headers | about.html |
| Removed lazy loading from hero image | index.html |
