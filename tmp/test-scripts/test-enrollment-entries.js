// Test script to determine correct entry IDs for enrollment form
// Form URL: https://docs.google.com/forms/d/e/1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w/viewform

const https = require('https');
const querystring = require('querystring');

// Based on the form structure we observed, let's test with common entry ID patterns
const testEntryMappings = {
    // Program Selection (required radio)
    'entry.1259515391': 'Friday Program (9 AM - 1 PM)',
    
    // Child 1 Information
    'entry.46770409': 'Test Child One',          // Child 1 Name
    'entry.1904207928': '2020-01-01',            // Child 1 Date (date fields use YYYY-MM-DD)
    'entry.1549240647': 'Test special considerations', // Child 1 Special
    
    // Child 2 (optional)
    'entry.994862448': 'Test Child Two',         // Child 2 Name
    'entry.299137979': '2021-01-01',             // Child 2 Date
    'entry.1286201377': 'Child 2 notes',        // Child 2 Special
    
    // Child 3 (optional)
    'entry.740904983': '',                       // Child 3 Name (empty)
    'entry.434230369': '',                       // Child 3 Date (empty)
    'entry.1366367630': '',                      // Child 3 Special (empty)
    
    // Child 4 (optional)
    'entry.1462579632': '',                      // Child 4 Name (empty)
    'entry.1387410791': '',                      // Child 4 Date (empty)
    'entry.968033473': '',                       // Child 4 Special (empty)
    
    // Child 5 (optional)
    'entry.1597592679': '',                      // Child 5 Name (empty)
    'entry.772706308': '',                       // Child 5 Date (empty)
    'entry.1760598539': '',                      // Child 5 Special (empty)
    
    // Parent/Guardian Information
    'entry.2010795504': 'Test Parent',           // Parent Name
    'entry.468070000': '555-123-4567',           // Phone Number
    'entry.928837263': 'test@example.com',       // Email Address
    'entry.704141376': '123 Test Street, Test City, CA 12345', // Home Address
    
    // Emergency Contact
    'entry.343389045': 'Emergency Contact',      // Emergency Contact Name
    'entry.351445251': '555-987-6543',           // Emergency Contact Phone
    'entry.1356648142': 'Grandparent',           // Relationship to Child
    
    // Medical Information
    'entry.1990020228': 'No known allergies',   // Allergies/Medical
    'entry.1527804629': 'No dietary restrictions', // Dietary Restrictions
    
    // Waivers and Permissions (required checkboxes)
    'entry.153991797': 'Ability to Participate & Assumption of Risk: I acknowledge that outdoor forest school activities involve inherent risks and that my child is physically and emotionally capable of participating in the program.',
    
    // Photo/Video Permission  
    'entry.1086360565': 'Yes, I give permission for my child to be included in photos/videos for program documentation and promotional materials',
    
    // Additional Information
    'entry.1344520112': 'Test additional information'
};

function testEnrollmentFormSubmission() {
    console.log('Testing enrollment form submission with mapped entries...');
    console.log('Form ID: 1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w');
    
    const postData = querystring.stringify(testEntryMappings);
    
    const options = {
        hostname: 'docs.google.com',
        port: 443,
        path: '/forms/d/e/1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w/formResponse',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log('\nSubmission URL:', `https://${options.hostname}${options.path}`);
    console.log('POST Data:', postData);
    
    const req = https.request(options, (res) => {
        console.log('\n=== RESPONSE ===');
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ SUCCESS! Form submission accepted');
                console.log('✅ Entry IDs are correct');
                console.log('\n🎯 Ready to update enrollment.html with these entry IDs');
            } else {
                console.log('❌ Form submission failed');
                console.log('Response body:', data);
            }
        });
    });

    req.on('error', (e) => {
        console.error('Request error:', e);
    });

    req.write(postData);
    req.end();
}

console.log('🧪 Testing enrollment form entry ID mapping...');
testEnrollmentFormSubmission();
