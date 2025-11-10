#!/usr/bin/env node

// Direct Google Forms API Test Script
// This tests form submissions without any UI validation

const https = require('https');
const querystring = require('querystring');

console.log('🧪 Direct Google Forms API Test');
console.log('================================\n');

// Test Contact Form
function testContactForm() {
    return new Promise((resolve, reject) => {
        const contactData = querystring.stringify({
            'entry.164836039': 'Direct API Test User',
            'entry.1716120589': 'directtest@example.com',
            'entry.1926431274': '555-999-8888',
            'entry.681349440': '6',
            'entry.670603499': 'General Information',
            'entry.1758251351': 'This is a direct API test submission to verify Google Forms integration works without UI validation.'
        });

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1Cvcc51jn66cvQlTmcqYKEJ5wR1MJkNOhZgasuclgkz8/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': contactData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📝 Testing Contact Form...');
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Location: ${res.headers.location || 'No redirect'}`);
            
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('   ✅ Contact Form: SUCCESS\n');
                resolve(true);
            } else {
                console.log('   ❌ Contact Form: FAILED\n');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`   ❌ Contact Form Error: ${e.message}\n`);
            resolve(false);
        });

        req.write(contactData);
        req.end();
    });
}

// Test Enrollment Form
function testEnrollmentForm() {
    return new Promise((resolve, reject) => {
        const enrollmentData = querystring.stringify({
            'entry.1726062227': 'Friday Program (Ages 4+)',
            'entry.813947346': 'Direct Test Child',
            'entry.2069853666': '2018-03-15',
            'entry.987328947': 'No special needs - API test',
            'entry.774375289': 'Direct Test Parent',
            'entry.1435621706': '555-888-7777',
            'entry.1926472464': 'directparent@example.com',
            'entry.53085399': '456 API Test Lane, Test City, CA 95678',
            'entry.740413830': 'Emergency Contact API Test',
            'entry.1679890137': '555-666-5555',
            'entry.332620735': 'Aunt',
            'entry.797895403': 'No medical conditions - API test',
            'entry.756357284': 'No dietary restrictions - API test',
            'entry.1216078250': 'I acknowledge that outdoor forest school activities involve inherent risks and that my child is physically and emotionally capable of participating in the program.',
            'entry.656444490': 'I release Placer Forest School, its instructors, and associated parties from any liability for injuries or damages that may occur during participation in the program.',
            'entry.1201074543': 'I authorize Placer Forest School staff to seek emergency medical treatment for my child if needed and agree to be responsible for any associated costs.',
            'entry.1822853686': 'Yes, I give permission for my child to be included in photos/videos',
            'entry.1133428336': 'This is a direct API test submission for enrollment form.'
        });

        const options = {
            hostname: 'docs.google.com',
            path: '/forms/d/e/1wNBRJtqxfExE-UCNpYdoESAc9xhuPY3t3n2y_CIjTF0/formResponse',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': enrollmentData.length,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        };

        console.log('📋 Testing Enrollment Form...');
        const req = https.request(options, (res) => {
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Location: ${res.headers.location || 'No redirect'}`);
            
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log('   ✅ Enrollment Form: SUCCESS\n');
                resolve(true);
            } else {
                console.log('   ❌ Enrollment Form: FAILED\n');
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`   ❌ Enrollment Form Error: ${e.message}\n`);
            resolve(false);
        });

        req.write(enrollmentData);
        req.end();
    });
}

// Run tests
async function runTests() {
    const contactResult = await testContactForm();
    const enrollmentResult = await testEnrollmentForm();
    
    console.log('🎯 Test Results Summary:');
    console.log('========================');
    console.log(`Contact Form API: ${contactResult ? '✅ WORKING' : '❌ FAILED'}`);
    console.log(`Enrollment Form API: ${enrollmentResult ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (contactResult && enrollmentResult) {
        console.log('\n🎉 Both forms are working! The issue is JavaScript validation.');
        console.log('Check your Google Forms responses dashboard for the test submissions.');
    } else {
        console.log('\n⚠️  Some forms failed. Check entry IDs and form URLs.');
    }
    
    console.log('\n📊 Check responses at:');
    console.log('Contact: https://docs.google.com/forms/d/e/1FAIpQLSf1ZB-pnWuoGDT3eqLGdk2aQxlHLZBNSUyIFSwqHHAnd-Wshg/edit');
    console.log('Enrollment: https://docs.google.com/forms/d/e/1FAIpQLSfAX9KkEpvYusgDwgLSg_cwF1dUnoctCDZBcGzMQgqjDmA-2Q/edit');
}

runTests().catch(console.error);
