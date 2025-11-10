#!/usr/bin/env node

// Test new contact form without multiple choice
const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing New Contact Form (Simple Fields)');
console.log('==========================================\n');

function testNewContactForm() {
    return new Promise((resolve, reject) => {
        // First, let me try with minimal data to see what happens
        const contactData = querystring.stringify({
            'entry.1000000': 'Test Name',  // Will try different entry numbers
            'entry.1000001': 'test@example.com',
            'entry.1000002': 'This is a test message'
        });

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': contactData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📝 Testing new contact form...');
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Headers:`, res.headers);
            
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 302) {
                    console.log('   ✅ SUCCESS: Form accepted the submission');
                    console.log(`   Response length: ${data.length} bytes`);
                    resolve(true);
                } else {
                    console.log('   ❌ FAILED: Form rejected the submission');
                    console.log(`   Response: ${data.substring(0, 200)}...`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`   ❌ Network Error: ${e.message}`);
            resolve(false);
        });

        req.write(contactData);
        req.end();
    });
}

testNewContactForm().then(success => {
    console.log('\n🎯 Result:');
    if (success) {
        console.log('✅ New contact form is working!');
        console.log('📝 Next: I\'ll inspect the form to get correct entry IDs');
    } else {
        console.log('❌ Still having issues - let me inspect the form structure');
    }
}).catch(console.error);
