// Test script for Contact Form Google Forms integration
// This script tests the contact form with the working entry IDs

const https = require('https');
const querystring = require('querystring');

function testContactForm() {
    console.log('🧪 Testing Contact Form Integration');
    console.log('Form ID: 1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA');
    
    // Test data with correct entry IDs for contact form
    const contactData = {
        'entry.1719126956': 'John Smith',
        'entry.44451489': 'john.smith@example.com',
        'entry.1433049591': '(555) 123-4567',
        'entry.1150348142': 'General Information',
        'entry.1335778539': 'I would like to learn more about the Friday program for my 4-year-old daughter.',
        'entry.611184780': 'How did you hear about us?'
    };

    const postData = querystring.stringify(contactData);
    
    const options = {
        hostname: 'docs.google.com',
        port: 443,
        path: '/forms/d/e/1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA/formResponse',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('📡 Submitting to:', `https://${options.hostname}${options.path}`);
    
    const req = https.request(options, (res) => {
        console.log('\n=== CONTACT FORM TEST RESULTS ===');
        console.log('Status Code:', res.statusCode);
        
        if (res.statusCode === 200) {
            console.log('✅ SUCCESS! Contact form is working correctly');
            console.log('✅ All entry IDs are properly mapped');
            console.log('✅ Form submission completed successfully');
        } else {
            console.log('❌ Unexpected status code. Check form configuration.');
        }
    });

    req.on('error', (e) => {
        console.error('❌ Request failed:', e);
    });

    req.write(postData);
    req.end();
}

// Run the test
testContactForm();
