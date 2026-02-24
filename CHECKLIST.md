# Placer Forest School - Website Improvement Checklist

## Task Tracking

### 1. Playwright Website Audit
- [x] Set up Playwright test environment
- [ ] Audit all pages (index, about, enrollment, faqs, contact, resources, terms)
- [ ] Check broken images and links
- [ ] Check console errors
- [ ] Check mobile responsiveness (375px, 768px, 1024px, 1440px)
- [ ] Check accessibility (alt text, ARIA, contrast)
- [ ] Check font loading
- [ ] Check performance (image sizes, load times)
- [ ] Document all issues in WEBSITE-AUDIT.md

### 2. Carousel Image Replacement
- [x] Convert HEIC images to JPG
- [x] Review all 34 candidate photos
- [x] Select top 8 photos for carousel
- [x] Optimize images to 1920x800 landscape (carousel aspect ratio)
- [x] Compress images for web (215-387KB each - well under 500KB target)
- [x] Replace carousel images in /images/ directory
- [x] Update index.html carousel HTML (8 slides, proper alt text)
- [x] Update content/home-content.json
- [x] Verify no images are cut off or distorted
- [x] Fix dot/slide mismatch (was 10 dots for 9 slides, now 8 dots for 8 slides)

### 3. Image Enhancement (Gemini API)
- [x] Enhance all 8 carousel images with gemini-2.5-flash-image
- [x] Use natural/photographic prompt (no AI look)
- [x] Optimize enhanced images (final sizes 215-387KB)
- [x] Verify enhanced images look natural and professional
- [ ] Enhance team photos (Beth-photo.jpg, gosia-center-2.jpg) - IN PROGRESS

### 4. Font Update
- [x] Research best fonts for forest school theme
- [x] Fix font mismatch (CSS declared Playfair Display + Lato, HTML imported Merriweather + Open Sans)
- [x] Apply new font pairing: Lora (headings) + Source Sans 3 (body)
- [x] Update Google Fonts import in ALL 7 HTML files
- [x] Update CSS custom properties in styles.css
- [ ] Verify fonts load correctly on all pages

### 5. Additional Fixes
- [x] Fix copyright year: 2025 -> 2026 (all 7 pages)
- [x] Copy Claude settings from Nilay plastic project (permissions)

### 6. SEO Optimization
- [ ] Research SEO keywords for forest school niche - IN PROGRESS
- [ ] Audit current meta tags, titles, descriptions
- [ ] Optimize keyword coverage across all pages
- [ ] Add structured data / schema markup if needed
- [ ] Check internal linking strategy

### 7. Final Verification
- [ ] Run Playwright tests to verify all changes
- [ ] Check all pages at desktop and mobile widths
- [ ] Verify carousel transitions smoothly
- [ ] Verify fonts render correctly
- [ ] Verify images look elegant and nothing is cut off
- [ ] Cross-browser check

---

## Selected Carousel Photos (from ~/Downloads/Photos for Website)

| # | File | Description | Why Selected |
|---|------|-------------|-------------|
| 1 | IMG_2796.jpg | Children walking hand-in-hand through green meadow | Stunning landscape, perfect hero shot |
| 2 | IMG_2768.jpg | Kids playing in green meadow with oaks | Beautiful wide landscape scene |
| 3 | IMG_2900.jpg | Children climbing magnificent oak tree | Vibrant, great composition |
| 4 | 565803589*.jpg | Group reading under sprawling oaks | Gorgeous wide landscape |
| 5 | 581013050*.jpg | Children exploring fields framed by branches | Scenic golden-hour feel |
| 6 | 581013616*.jpg | Kids tug-of-war in open meadow | Dynamic action, blue sky |
| 7 | 566228048*.jpg | Children watercolor painting outdoors | Creative activities showcase |
| 8 | 551315149*.jpg | Circle of hands sharing nature finds | Community connection |

## Font Decision

**Selected: Lora + Source Sans 3**
- Lora (headings): Calligraphic warmth, organic feel, nature-connected
- Source Sans 3 (body): Humanist, warm, excellent readability
- Best balance of nature aesthetic + professional education feel

## Image Enhancement

**Model used:** gemini-2.5-flash-image (Google Gemini API)
**Approach:** Subtle Lightroom-style enhancement - warmer white balance, lifted shadows, natural color boost
**Result:** Natural-looking photos that appear professionally shot, not AI-processed

## Changes Summary

| File | Change |
|------|--------|
| index.html | New carousel (8 slides), font import, copyright year |
| about.html | Font import, copyright year |
| enrollment.html | Font import, copyright year |
| faqs.html | Font import, copyright year |
| contact.html | Font import, copyright year |
| resources.html | Font import, copyright year |
| terms.html | Font import, copyright year |
| css/styles.css | Font variables: Lora + Source Sans 3 |
| content/home-content.json | Updated carousel image list and alt text |
| images/carousel-1 through 8.jpg | New enhanced photos from Downloads |
