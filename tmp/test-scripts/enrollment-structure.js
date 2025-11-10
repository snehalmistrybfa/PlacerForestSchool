// Based on form field mapping from screenshots, here are the entry IDs we need to discover
// We'll use a direct HTTP approach to test the enrollment form

const https = require('https');
const querystring = require('querystring');

function testEnrollmentFormSubmission() {
    console.log('Testing enrollment form submission...');
    
    // Form data based on the structure we observed
    const formData = {
        // Program Selection (required radio)
        'entry.PROGRAM_ENTRY': 'Acorns (3-5 years old)',
        
        // Child 1 Information
        'entry.CHILD1_NAME': 'Test Child One',
        'entry.CHILD1_DATE': '01/01/2020',
        'entry.CHILD1_SPECIAL': 'Test special considerations',
        
        // Child 2-5 (all optional)
        'entry.CHILD2_NAME': 'Test Child Two',
        'entry.CHILD3_NAME': '',
        'entry.CHILD4_NAME': '',
        'entry.CHILD5_NAME': '',
        
        // Parent/Guardian Information
        'entry.PARENT_NAME': 'Test Parent',
        'entry.PHONE': '555-123-4567',
        'entry.EMAIL': 'test@example.com',
        'entry.ADDRESS': '123 Test Street, Test City, CA 12345',
        
        // Emergency Contact
        'entry.EMERGENCY_NAME': 'Emergency Contact',
        'entry.EMERGENCY_PHONE': '555-987-6543',
        'entry.RELATIONSHIP': 'Grandparent',
        
        // Medical Information
        'entry.ALLERGIES': 'No known allergies',
        'entry.DIETARY': 'No dietary restrictions',
        
        // Waivers (required checkboxes)
        'entry.PARTICIPATION': 'Ability to Participate & Assumption of Risk: I acknowledge that outdoor forest school activities involve inherent risks and that my child is physically and emotionally capable of participating in the program.',
        'entry.LIABILITY': 'Waiver & Release of Liability: I release Placer Forest School, its instructors, and associated parties from any liability for injuries or damages that may occur during participation in the program.',
        'entry.MEDICAL_AUTH': 'Medical Emergency Authorization: I authorize Placer Forest School staff to seek emergency medical treatment for my child if needed and agree to be responsible for any associated costs.',
        
        // Photo Permission
        'entry.PHOTO_PERMISSION': 'Yes, I give permission for my child to be included in photos/videos for program documentation and promotional materials',
        
        // Additional Information
        'entry.ADDITIONAL_INFO': 'Test additional information'
    };

    // Convert to URL-encoded string
    const postData = querystring.stringify(formData);
    
    console.log('POST Data to be sent:');
    console.log(postData);
    
    console.log('\nThis shows the structure we need to map to actual entry IDs');
    console.log('We need to manually test the form to get the real entry IDs');
}

testEnrollmentFormSubmission();
