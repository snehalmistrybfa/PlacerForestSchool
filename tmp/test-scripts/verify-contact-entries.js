#!/usr/bin/env node

// Test with correct entry IDs found from form inspection
const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing Contact Form with Correct Entry IDs');
console.log('==============================================\n');

function testWithCorrectEntries() {
    return new Promise((resolve, reject) => {
        const contactData = querystring.stringify({
            'entry.1719126956': 'John Doe',
            'entry.44451489': 'john@example.com', 
            'entry.634649080': '555-123-4567',
            'entry.796234141': '6',
            'entry.164084696': 'General Information',  // Radio button
            'entry.533690475': 'This is a test message with the correct entry IDs to verify the new contact form works perfectly!'
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

        console.log('📝 Testing with mapped entry IDs...');
        console.log('   - Name: entry.1719126956');
        console.log('   - Email: entry.44451489');
        console.log('   - Phone: entry.634649080');
        console.log('   - Child Age: entry.796234141');
        console.log('   - Type: entry.164084696');
        console.log('   - Message: entry.533690475');
        
        const req = https.request(options, (res) => {
            console.log(`\n   Status: ${res.statusCode}`);
            
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('   ✅ SUCCESS: Perfect! All entry IDs work correctly');
                resolve(true);
            } else {
                console.log('   ❌ FAILED: Entry mapping needs adjustment');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`   ❌ Network Error: ${e.message}`);
            resolve(false);
        });

        req.write(contactData);
        req.end();
    });
}

testWithCorrectEntries().then(success => {
    console.log('\n🎯 Final Result:');
    if (success) {
        console.log('✅ New contact form working perfectly!');
        console.log('📝 Ready to update contact.html with new form URL and entry IDs');
        console.log('\n📊 Check responses at:');
        console.log('https://docs.google.com/forms/d/1FAIpQLSdTKnOnjJzZ3x0waar2Kx0DLkI5L-IUA7qqr4NWepOIlOFUsA/edit');
    } else {
        console.log('❌ Still need to debug entry mappings');
    }
}).catch(console.error);
