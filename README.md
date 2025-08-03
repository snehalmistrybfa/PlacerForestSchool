# Placer Forest School Website - Content Management System

## Overview

This website uses a content management system that separates all text content from the code, making it super easy for non-technical users to edit website content without touching any HTML or JavaScript files.

## How It Works

All website content is stored in JSON files located in the `/content/` folder. The website dynamically loads this content when the page loads, making content editing as simple as editing a text file.

## Content Files Structure

### `/content/site-config.json`
Contains global site configuration that appears on all pages:
- Site title, logo, and tagline
- Contact information (phone, email, location)
- Navigation menu items
- Program details
- Google Analytics ID

### `/content/home-content.json`
Contains all content for the home page:
- Page metadata (SEO)
- Hero section text
- Carousel images and descriptions
- Main content sections
- Call-to-action buttons
- Mission statement

### `/content/enrollment-content.json`
Contains all content for the enrollment form:
- Form field labels and placeholders
- Section titles
- Waiver text
- Success messages
- Google Form integration settings

## How to Edit Content

### For Non-Technical Users:

1. **Navigate to the `/content/` folder**
2. **Open the appropriate JSON file** in any text editor (TextEdit on Mac, Notepad on Windows, or VS Code for better formatting)
3. **Edit the text between the quotation marks** 
   - Example: Change `"title": "Old Title"` to `"title": "New Title"`
4. **Save the file**
5. **Refresh the website** - changes appear immediately!

### Important Rules When Editing:

✅ **DO:**
- Edit text between quotation marks: `"title": "Your New Text Here"`
- Keep the quotation marks around text
- Save the file after making changes

❌ **DON'T:**
- Remove quotation marks or commas
- Delete entire lines or sections
- Change text that appears to be technical (like "entry.123456789")

### Example Edits:

**Changing the site phone number:**
```json
// Before:
"phone": "(123) 456-7890"

// After:
"phone": "(555) 123-4567"
```

**Updating the mission statement:**
```json
// Before:
"content": "At Placer Forest School, our mission is to create..."

// After:
"content": "At Placer Forest School, our updated mission is to create..."
```

## Content Categories

### Site-Wide Content (`site-config.json`)
- Company information
- Contact details
- Navigation menu
- Footer content

### Page-Specific Content
- `home-content.json` - Homepage content
- `enrollment-content.json` - Registration form
- `about-content.json` - About us page (to be created)
- `contact-content.json` - Contact page (to be created)
- `faqs-content.json` - FAQ page (to be created)
- `resources-content.json` - Resources page (to be created)

## Adding New Images

### For Carousel/Gallery Images:

1. **Add new image files** to the `/images/` folder
2. **Update the content file** to reference the new image:

```json
"carousel": {
  "images": [
    {
      "src": "images/your-new-image.jpg",
      "alt": "Description of your new image"
    }
  ]
}
```

3. **Use descriptive alt text** for accessibility

## Google Forms Integration

To connect the enrollment form to a Google Form:

1. **Create a Google Form** with all required fields
2. **Get the form action URL** from the form's HTML source
3. **Update the Google Form settings** in `enrollment-content.json`:

```json
"googleForm": {
  "actionUrl": "https://docs.google.com/forms/d/e/YOUR_ACTUAL_FORM_ID/formResponse",
  "fieldMappings": {
    // Update these with your actual Google Form field IDs
  }
}
```

## Google Analytics Setup

1. **Get your Google Analytics tracking ID**
2. **Update the tracking ID** in `site-config.json`:

```json
"site": {
  "googleAnalyticsId": "G-XXXXXXXXXX"
}
```

## Testing Changes

1. **Save your content files**
2. **Open the website in a browser**
3. **Refresh the page** to see changes
4. **Test all functionality** (forms, links, etc.)

## Backup and Safety

- **Always backup** content files before making major changes
- **Test changes** on a copy of the site first if possible
- **Keep a list** of what you changed in case you need to revert

## Getting Help

If you need help editing content or run into issues:

1. **Check the JSON syntax** - make sure quotes and commas are in place
2. **Revert to a backup** if something breaks
3. **Contact the developer** for technical assistance

## Advanced Features

### Dynamic Form Fields
The enrollment form can automatically add/remove child information sections based on user input.

### SEO Optimization
All content files include SEO metadata that automatically updates page titles, descriptions, and keywords.

### Responsive Design
All content automatically adapts to different screen sizes (mobile, tablet, desktop).

### Analytics Tracking
Button clicks and form submissions are automatically tracked for analytics.

---

This content management system makes it easy to keep your website updated while ensuring a professional, consistent appearance across all pages.
