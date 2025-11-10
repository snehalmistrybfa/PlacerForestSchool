#!/usr/bin/env node

// Test Contact Form Direct API
const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing Contact Form Direct API');
console.log('=================================\n');

function testContactFormAPI() {
    return new Promise((resolve, reject) => {
        // Testing with minimal data to find working entry IDs
        // Since this is a different form, let me try basic entry IDs
        const contactData = querystring.stringify({
            'entry.1547929949': 'API Test Contact User - Name',
            'entry.1234567890': 'apitest@contactform.com',
            'entry.0987654321': '555-API-TEST',
            'entry.1111111111': '5',
            'entry.2222222222': 'General Information',
            'entry.3333333333': 'This is a direct API test message.'
        });

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1FAIpQLSf1ZB-pnWuoGDT3eqLGdk2aQxlHLZBNSUyIFSwqHHAnd-Wshg/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': contactData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📞 Testing Contact Form API...');
        console.log('   Form ID: 1FAIpQLSf1ZB-pnWuoGDT3eqLGdk2aQxlHLZBNSUyIFSwqHHAnd-Wshg');
        
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 302) {
                    console.log('   ✅ Contact Form API: SUCCESS');
                    console.log('   📊 Check responses at: https://docs.google.com/forms/d/1FAIpQLSf1ZB-pnWuoGDT3eqLGdk2aQxlHLZBNSUyIFSwqHHAnd-Wshg/edit');
                    resolve(true);
                } else {
                    console.log('   ❌ Contact Form API: FAILED');
                    console.log(`   Response: ${data.substring(0, 200)}...`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ Contact Form Error: ${e.message}`);
            resolve(false);
        });

        req.write(contactData);
        req.end();
    });
}

// Run test
testContactFormAPI().then(success => {
    console.log('\n🎯 Contact Form API Test Complete');
    console.log('==================================');
    
    if (success) {
        console.log('✅ Contact form API is working correctly!');
        console.log('📋 Next: Check if contact.html needs any fixes');
        console.log('🔗 Form responses: https://docs.google.com/forms/d/1FAIpQLSf1ZB-pnWuoGDT3eqLGdk2aQxlHLZBNSUyIFSwqHHAnd-Wshg/edit');
    } else {
        console.log('❌ Contact form API test failed');
        console.log('🔍 Need to check entry IDs and form configuration');
    }
}).catch(console.error);
