# 🧪 Test Scripts Directory

This directory contains all test scripts for the Placer Forest School Google Forms integration.

## 📋 Test Files Overview

### Contact Form Tests
- **`test-contact-form.js`** - Basic contact form API testing
- **`test-contact-api.js`** - Contact form API validation
- **`test-contact-entries.js`** - Contact form entry ID mapping tests

### Enrollment Form Tests
- **`test-enrollment-mapping.js`** - Manual enrollment form field mapping
- **`test-enrollment-entries.js`** - Enrollment form entry ID discovery
- **`test-corrected-enrollment.js`** - Corrected enrollment form validation
- **`final-enrollment-test.js`** - Final enrollment form integration test
- **`enrollment-structure.js`** - Enrollment form structure analysis

### General Form Tests
- **`test-simple-form.js`** - Simple form submission testing
- **`test-custom-form.js`** - Custom form creation and testing

### Integration Tests
- **`test-enrollment-integration.html`** - HTML test page for enrollment form
- **`test-forms.html`** - General forms testing interface
- **`test-integration.sh`** - Shell script for integration testing

## 🚀 How to Run Tests

### Prerequisites
```bash
# Install dependencies (if not already installed)
npm install puppeteer
```

### Running Individual Tests
```bash
# Test contact form
node test-scripts/test-contact-form.js

# Test enrollment form
node test-scripts/final-enrollment-test.js

# Test form structure
node test-scripts/enrollment-structure.js
```

### Running Integration Tests
```bash
# Run shell integration test
./test-scripts/test-integration.sh

# Open HTML test pages in browser
open test-scripts/test-enrollment-integration.html
open test-scripts/test-forms.html
```

## 📊 Test Results Summary

### Contact Form ✅
- **Form ID**: `1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA`
- **Status**: ✅ Working perfectly
- **Entry Fields**: 6 fields mapped correctly
- **Last Test**: Passed with 200 response

### Enrollment Form ✅
- **Form ID**: `1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w`
- **Status**: ✅ Working perfectly
- **Entry Fields**: 16+ fields mapped correctly
- **Waivers**: Multiple checkboxes working
- **Last Test**: Passed with 200 response

## 🔧 Test Configuration

### Form URLs
```javascript
// Contact Form
const CONTACT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA/formResponse';

// Enrollment Form
const ENROLLMENT_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w/formResponse';
```

### Test Data Examples
All test files include realistic test data that matches the actual form requirements.

## 📝 Adding New Tests

When creating new tests:

1. **Name Convention**: `test-[description].js` or `test-[description].html`
2. **Include Error Handling**: All tests should handle both success and failure cases
3. **Use Realistic Data**: Test with data that matches actual use cases
4. **Document Results**: Include console logging for test results
5. **Clean Up**: Remove temporary files after testing

## 🎯 Production Readiness

Both contact and enrollment forms have passed all tests and are ready for production use. The test scripts can be used for:

- Regression testing after changes
- Validating new form integrations
- Debugging form submission issues
- Performance monitoring

## 🔄 Maintenance

Run tests periodically to ensure:
- Form URLs remain valid
- Entry IDs haven't changed
- API responses are still successful
- All required fields are working
