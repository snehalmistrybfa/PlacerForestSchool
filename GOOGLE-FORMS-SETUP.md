# Google Forms Integration Guide

## Step 1: Create Your Google Form

1. **Go to Google Forms**: https://forms.google.com
2. **Click "Blank form"**
3. **Add form title**: "Placer Forest School Enrollment"

## Step 2: Add All Required Fields

Copy these fields exactly into your Google Form:

### Program Selection
- **Type**: Multiple choice
- **Question**: "Select Program"
- **Options**: "Friday Program (10 AM - 3 PM)"
- **Required**: Yes

### Child Information
- **Child's Full Name** (Short answer, Required)
- **Date of Birth** (Date, Required)
- **Special Considerations** (Paragraph, Optional)

### Parent Information
- **Parent/Guardian Name** (Short answer, Required)
- **Phone Number** (Short answer, Required)
- **Email Address** (Short answer, Required)
- **Home Address** (Paragraph, Required)

### Emergency Contact
- **Emergency Contact Name** (Short answer, Required)
- **Emergency Contact Phone** (Short answer, Required)
- **Relationship to Child** (Short answer, Required)

### Medical Information
- **Allergies, Medical Conditions, and Medications** (Paragraph, Optional)
- **Dietary Restrictions** (Paragraph, Optional)

### Waivers (All Required)
- **Participation Waiver** (Checkbox)
- **Liability Waiver** (Checkbox)
- **Medical Emergency Authorization** (Checkbox)

### Photo Permission
- **Type**: Multiple choice
- **Options**: 
  - "Yes, I give permission"
  - "No, I do not give permission"

### Additional Information
- **Additional Info** (Paragraph, Optional)

## Step 3: Get Form Integration Code

1. **Click "Send" button** in your Google Form
2. **Click the link icon** (<>) 
3. **Copy the form URL** - it will look like:
   `https://docs.google.com/forms/d/e/1FAIpQLSc...../viewform`

4. **Change "viewform" to "formResponse"** in the URL
5. **This gives you the action URL** for your form

## Step 4: Get Field Names

1. **Right-click on your Google Form** and select "View Page Source"
2. **Search for "entry."** - you'll find field names like:
   - `entry.123456789` 
   - `entry.987654321`
   - etc.

3. **Make note of each field name** and which question it corresponds to

## Step 5: Update Your Website

Edit `/content/enrollment-content.json`:

```json
{
  "googleForm": {
    "actionUrl": "https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse",
    "fieldMappings": {
      "program": "entry.YOUR_ACTUAL_ENTRY_ID",
      "childName": "entry.YOUR_ACTUAL_ENTRY_ID",
      "dateOfBirth": "entry.YOUR_ACTUAL_ENTRY_ID",
      // ... update all entry IDs with real ones
    }
  }
}
```

## Step 6: Test the Integration

1. **Save your changes**
2. **Refresh your website**
3. **Fill out and submit the enrollment form**
4. **Check your Google Form responses** to confirm it worked
5. **Test email notifications** in Google Forms settings

## Contact Form Setup

Repeat the same process for the contact form:

1. **Create a new Google Form** for contact inquiries
2. **Add fields** from `/content/contact-content.json`
3. **Get the action URL and field names**
4. **Update the contact content file**
5. **Test the contact form**

## Email Notifications

In your Google Forms:
1. **Click the "Responses" tab**
2. **Click the three dots menu**
3. **Select "Get email notifications for new responses"**
4. **You'll get an email** every time someone submits the form

## Tips for Success

- **Test every field** to make sure they map correctly
- **Use clear field names** in your Google Form
- **Set up email notifications** so you don't miss submissions
- **Consider using Google Sheets** to track responses over time
- **Make your Google Forms** "Accept responses" and public

This integration is completely free and will handle all your form submissions professionally!
