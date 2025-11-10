#!/usr/bin/env node

// Test the user's custom Google Form
const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing User\'s Custom Google Form');
console.log('====================================\n');

function testUserForm() {
    return new Promise((resolve, reject) => {
        // Since this is a new test form, we'll try with common field names
        // We'll need to inspect the form to get actual entry IDs
        const testData = querystring.stringify({
            'entry.123456789': 'Test Name',
            'entry.987654321': 'test@example.com',
            'entry.555666777': 'Test message for custom form'
        });

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1FAIpQLSfG-Rk0JSgxoc2CHTFNlV8C27X1RKb2ON-E6abmhKa16qRmGw/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': testData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📝 Testing your custom form...');
        console.log('Form ID: 1FAIpQLSfG-Rk0JSgxoc2CHTFNlV8C27X1RKb2ON-E6abmhKa16qRmGw');
        
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Headers: ${JSON.stringify(res.headers, null, 2)}`);
            
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('   ✅ Form Response: SUCCESS\n');
                resolve(true);
            } else {
                console.log('   ❌ Form Response: FAILED\n');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`   ❌ Error: ${e.message}\n`);
            resolve(false);
        });

        req.write(testData);
        req.end();
    });
}

// Also test with empty data to see what happens
function testEmptySubmission() {
    return new Promise((resolve, reject) => {
        const emptyData = querystring.stringify({});

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1FAIpQLSfG-Rk0JSgxoc2CHTFNlV8C27X1RKb2ON-E6abmhKa16qRmGw/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': emptyData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📝 Testing empty submission...');
        
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('   ✅ Empty Submission: SUCCESS (form accepts requests)\n');
                resolve(true);
            } else {
                console.log('   ❌ Empty Submission: FAILED\n');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`   ❌ Error: ${e.message}\n`);
            resolve(false);
        });

        req.write(emptyData);
        req.end();
    });
}

async function runTests() {
    console.log('Testing your custom Google Form...\n');
    
    const emptyTest = await testEmptySubmission();
    const dataTest = await testUserForm();
    
    console.log('🎯 Test Results:');
    console.log('================');
    console.log(`Empty submission test: ${emptyTest ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Data submission test: ${dataTest ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (emptyTest) {
        console.log('\n🎉 Your Google Form is accessible and responding!');
        console.log('📋 To get actual field entry IDs:');
        console.log('   1. Open your form in edit mode');
        console.log('   2. Right-click on a field → Inspect Element');
        console.log('   3. Look for name="entry.XXXXXXXXX"');
        console.log('   4. Use those entry IDs for real submissions');
        
        console.log('\n🔗 Check responses at:');
        console.log('Edit: https://docs.google.com/forms/d/1FAIpQLSfG-Rk0JSgxoc2CHTFNlV8C27X1RKb2ON-E6abmhKa16qRmGw/edit');
        console.log('Responses: Go to your form → Responses tab');
    } else {
        console.log('\n⚠️ Form may not be accessible or configured correctly');
    }
}

runTests().catch(console.error);
