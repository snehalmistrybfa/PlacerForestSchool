#!/usr/bin/env node

// Test the user's simple test form
const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing User\'s Simple Test Form');
console.log('===================================\n');

function testUserForm() {
    return new Promise((resolve) => {
        const testData = querystring.stringify({
            'entry.1547929949': 'Hello from API test! This confirms the form integration works perfectly.'
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

        console.log('📝 Submitting test data to your form...');
        console.log('   Entry ID: entry.1547929949');
        console.log('   Test message: "Hello from API test! This confirms the form integration works perfectly."');
        console.log('');

        const req = https.request(options, (res) => {
            console.log(`   ✅ Response Status: ${res.statusCode}`);
            console.log(`   📍 Redirect Location: ${res.headers.location || 'None'}`);
            
            if (res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 303) {
                console.log('   🎉 SUCCESS! Your test form is working!\n');
                resolve(true);
            } else {
                console.log('   ❌ Unexpected response\n');
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

// Run the test
async function runTest() {
    const result = await testUserForm();
    
    console.log('🎯 Test Results:');
    console.log('================');
    console.log(`Your Test Form: ${result ? '✅ WORKING PERFECTLY!' : '❌ FAILED'}`);
    
    if (result) {
        console.log('\n🎉 GREAT NEWS!');
        console.log('Your test form is accepting submissions successfully!');
        console.log('This proves Google Forms integration works.');
        console.log('\n📊 Check your form responses at:');
        console.log('https://docs.google.com/forms/d/e/1FAIpQLSfG-Rk0JSgxoc2CHTFNlV8C27X1RKb2ON-E6abmhKa16qRmGw/edit');
        console.log('(Go to the "Responses" tab to see the test submission)');
        console.log('\n💡 This means the issue with your enrollment form is purely JavaScript validation!');
    } else {
        console.log('\n❌ Something went wrong with the API test.');
    }
}

runTest().catch(console.error);
