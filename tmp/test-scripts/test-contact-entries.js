#!/usr/bin/env node

// Test script to find correct entry IDs for copied contact form

const https = require('https');
const querystring = require('querystring');

console.log('🧪 Testing Copied Contact Form Entry IDs');
console.log('==========================================\n');

// Known entry IDs from the HTML inspection
const possibleEntries = [
    'entry.517667635',
    'entry.1174741512', 
    'entry.169318541',
    'entry.917394998',
    'entry.1213721999',
    'entry.84527671'
];

function testContactForm(entryMapping) {
    return new Promise((resolve) => {
        const contactData = querystring.stringify(entryMapping);

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

        const req = https.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('✅ SUCCESS! Found working entry mapping:');
                Object.keys(entryMapping).forEach(key => {
                    console.log(`  ${key}: "${entryMapping[key]}"`);
                });
                resolve(true);
            } else {
                console.log('❌ Failed with this mapping');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`❌ Error: ${e.message}`);
            resolve(false);
        });

        req.write(contactData);
        req.end();
    });
}

async function findCorrectMapping() {
    // Test different combinations based on typical Google Forms patterns
    const testMappings = [
        // Test 1: Try the entries in order
        {
            'entry.517667635': 'Test Name 1',
            'entry.1174741512': 'test1@example.com',
            'entry.169318541': '555-123-4567',
            'entry.917394998': '5',
            'entry.1213721999': 'General Information',
            'entry.84527671': 'Test message 1'
        },
        // Test 2: Different order
        {
            'entry.517667635': 'Test Name 2', 
            'entry.1174741512': 'test2@example.com',
            'entry.169318541': '555-987-6543',
            'entry.917394998': 'General Information',
            'entry.1213721999': 'Test message 2',
            'entry.84527671': '6'
        },
        // Test 3: Simple minimal test
        {
            'entry.517667635': 'Simple Test',
            'entry.1174741512': 'simple@test.com'
        }
    ];

    for (let i = 0; i < testMappings.length; i++) {
        console.log(`\n🧪 Test ${i + 1}:`);
        const success = await testContactForm(testMappings[i]);
        if (success) {
            console.log('\n🎉 Found the correct mapping!');
            return testMappings[i];
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between tests
    }
    
    console.log('\n⚠️  No mapping worked. The form might need manual inspection.');
    return null;
}

findCorrectMapping().then(result => {
    if (result) {
        console.log('\n📝 Update contact.html with these entry IDs:');
        Object.keys(result).forEach(key => {
            console.log(`name="${key}"`);
        });
    }
});
