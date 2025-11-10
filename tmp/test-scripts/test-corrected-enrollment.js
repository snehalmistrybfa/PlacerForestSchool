// Correct entry ID mapping extracted from the enrollment form response
// Based on actual form structure from Google Forms

const https = require('https');
const querystring = require('querystring');

// CORRECT Entry IDs extracted from the actual form
const correctEntryMappings = {
    // Program Selection (required radio) - entry.153991797
    'entry.153991797': 'Friday Program (9 AM - 1 PM)',
    
    // Child 1 Information
    'entry.1259515391': 'Test Child One',          // Child 1 Name
    'entry.1904207928': '2020-01-01',              // Child 1 Date
    'entry.46770409': 'Test special considerations', // Child 1 Special
    
    // Child 2 (optional)
    'entry.1549240647': '',                        // Child 2 Name (leaving empty)
    'entry.299137979': '',                         // Child 2 Date (leaving empty)
    'entry.994862448': '',                         // Child 2 Special (leaving empty)
    
    // Child 3 (optional) 
    'entry.1286201377': '',                        // Child 3 Name (leaving empty)
    'entry.434230369': '',                         // Child 3 Date (leaving empty)
    'entry.740904983': '',                         // Child 3 Special (leaving empty)
    
    // Child 4 (optional)
    'entry.1366367630': '',                        // Child 4 Name (leaving empty)
    'entry.1387410791': '',                        // Child 4 Date (leaving empty)
    'entry.1462579632': '',                        // Child 4 Special (leaving empty)
    
    // Child 5 (optional)
    'entry.968033473': '',                         // Child 5 Name (leaving empty)
    'entry.772706308': '',                         // Child 5 Date (leaving empty)
    'entry.1597592679': '',                        // Child 5 Special (leaving empty)
    
    // Parent/Guardian Information
    'entry.1760598539': 'Test Parent',             // Parent Name
    'entry.2010795504': '555-123-4567',            // Phone Number
    'entry.468070000': 'test@example.com',         // Email Address
    'entry.928837263': '123 Test Street, Test City, CA 12345', // Home Address
    
    // Emergency Contact
    'entry.704141376': 'Emergency Contact',        // Emergency Contact Name
    'entry.343389045': '555-987-6543',             // Emergency Contact Phone
    'entry.351445251': 'Grandparent',              // Relationship to Child
    
    // Medical Information
    'entry.1356648142': 'No known allergies',     // Allergies/Medical
    'entry.1990020228': 'No dietary restrictions', // Dietary Restrictions
    
    // Waivers and Permissions (required checkboxes) - entry.1086360565
    'entry.1086360565': [
        'Ability to Participate & Assumption of Risk: I acknowledge that outdoor forest school activities involve inherent risks and that my child is physically and emotionally capable of participating in the program.',
        'Waiver & Release of Liability: I release Placer Forest School, its instructors, and associated parties from any liability for injuries or damages that may occur during participation in the program.',
        'Medical Emergency Authorization: I authorize Placer Forest School staff to seek emergency medical treatment for my child if needed and agree to be responsible for any associated costs.'
    ],
    
    // Photo/Video Permission - entry.1344520112
    'entry.1344520112': 'Yes, I give permission for my child to be included in photos/videos for program documentation and promotional materials',
    
    // Additional Information
    'entry.1527804629': 'Test additional information'
};

function testCorrectedEnrollmentFormSubmission() {
    console.log('🧪 Testing CORRECTED enrollment form submission...');
    console.log('Form ID: 1FAIpQLSfhLKmg5axwS2wpd2OuFm61qqnT2RpVQ4vEy4ooPjCR7UCY-w');
    
    const postData = querystring.stringify(correctEntryMappings);
    
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
    
    const req = https.request(options, (res) => {
        console.log('\n=== RESPONSE ===');
        console.log('Status:', res.statusCode);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            if (res.statusCode === 200) {
                console.log('✅ SUCCESS! Enrollment form submission accepted');
                console.log('✅ Entry IDs are correct');
                console.log('\n🎯 Ready to update enrollment.html with these entry IDs');
                
                // Show the mapping for reference
                console.log('\n📋 CORRECT ENTRY ID MAPPING:');
                Object.entries(correctEntryMappings).forEach(([key, value]) => {
                    if (Array.isArray(value)) {
                        console.log(`${key}: [${value.length} checkboxes]`);
                    } else {
                        console.log(`${key}: "${value}"`);
                    }
                });
            } else {
                console.log('❌ Form submission failed with status:', res.statusCode);
                console.log('Still need to adjust entry IDs');
            }
        });
    });

    req.on('error', (e) => {
        console.error('Request error:', e);
    });

    req.write(postData);
    req.end();
}

testCorrectedEnrollmentFormSubmission();
