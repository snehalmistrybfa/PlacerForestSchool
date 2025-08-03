# 📋 Google Integration Setup Guide

## 🔗 Google Forms Integration

Your website already has Google Forms integration built-in! Here's how to set it up:

### Step 1: Create Google Forms

#### Enrollment Form
1. Go to [forms.google.com](https://forms.google.com)
2. Click "Create a new form"
3. Title: "Placer Forest School - Enrollment Application"
4. Add these fields (matching your website):
   - **Parent/Guardian Name** (Short answer, required)
   - **Email Address** (Email, required)
   - **Phone Number** (Short answer, required)
   - **Child's Name** (Short answer, required)
   - **Child's Age** (Short answer, required)
   - **Emergency Contact Name** (Short answer, required)
   - **Emergency Contact Phone** (Short answer, required)
   - **Additional Information** (Paragraph, optional)

#### Contact Form
1. Create another form: "Placer Forest School - Contact"
2. Add fields:
   - **Your Name** (Short answer, required)
   - **Email Address** (Email, required)
   - **Subject** (Short answer, required)
   - **Message** (Paragraph, required)

### Step 2: Get Form URLs
1. In each form, click "Send" button
2. Click the link icon 🔗
3. Copy the form URL
4. **Important:** Change the end of URL from `/viewform` to `/formResponse`

### Step 3: Update Your Website
Replace the placeholder URLs in these files:

#### In `/content/enrollment-content.json`:
```json
"form": {
  "action": "YOUR_ENROLLMENT_FORM_URL_HERE",
  "method": "POST"
}
```

#### In `/content/contact-content.json`:
```json
"form": {
  "action": "YOUR_CONTACT_FORM_URL_HERE", 
  "method": "POST"
}
```

---

## 📊 Google Analytics Integration

### Step 1: Create Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com)
2. Click "Get started" and sign in with Google account
3. Create a new account: "Placer Forest School"
4. Create a property: "Placer Forest School Website"
5. Select "Web" as platform
6. Enter your website URL (will be your hosting URL)
7. Copy your **Measurement ID** (looks like: G-XXXXXXXXXX)

### Step 2: Update Your Website
Replace the placeholder in `/content/site-config.json`:

```json
"analytics": {
  "googleAnalyticsId": "YOUR_MEASUREMENT_ID_HERE"
}
```

**Example:**
```json
"analytics": {
  "googleAnalyticsId": "G-ABC123DEF4"
}
```

### Step 3: Verify Setup
1. Deploy your website with the new Analytics ID
2. Go to Google Analytics → Realtime
3. Visit your website
4. You should see your visit appear in real-time!

---

## 🎯 What Analytics Will Track

Your website automatically tracks:
- **Page views** on all pages
- **Button clicks** (Register Now, Contact Us, etc.)
- **Form submissions** 
- **Carousel interactions**
- **User engagement metrics**
- **Mobile vs desktop usage**
- **Geographic data** of visitors
- **Traffic sources** (Google, social media, direct, etc.)

---

## 📧 Form Notifications Setup

### Get Email Notifications for Form Submissions:

1. In Google Forms, click "Responses" tab
2. Click the 3-dot menu → "Get email notifications for new responses"
3. You'll get emails when parents submit enrollment applications!

### Export Responses:
- Click "Create Spreadsheet" to export all responses to Google Sheets
- Perfect for managing enrollments and contacts

---

## 🔒 Privacy & GDPR Compliance

Your website includes:
- ✅ Privacy-friendly analytics
- ✅ Secure form submissions
- ✅ No third-party cookies
- ✅ Location privacy (exact location shared only after registration)

---

## 🚀 Quick Setup Checklist

- [ ] Create Google Forms (enrollment & contact)
- [ ] Update form URLs in content files
- [ ] Create Google Analytics account
- [ ] Add Analytics ID to site-config.json
- [ ] Deploy website to hosting platform
- [ ] Test forms and analytics
- [ ] Set up email notifications

**Total setup time: ~30 minutes** ⏱️
