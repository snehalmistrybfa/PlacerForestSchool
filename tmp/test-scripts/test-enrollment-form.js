// Test script to prefill enrollment form with random values
console.log('🧪 Starting enrollment form test...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        fillFormWithTestData();
    }, 1000);
});

function fillFormWithTestData() {
    console.log('📝 Filling form with test data...');
    
    // Program Selection
    const program = document.getElementById('program');
    if (program) {
        program.value = 'Friday Program (9 AM - 1 PM)';
        console.log('✅ Program selected');
    }
    
    // Child Information
    const childName = document.getElementById('child1_name');
    if (childName) {
        childName.value = 'Emma Thompson';
        console.log('✅ Child name filled');
    }
    
    const childDob = document.getElementById('child1_dob');
    if (childDob) {
        childDob.value = '2018-05-15'; // 6-7 years old
        console.log('✅ Child DOB filled');
    }
    
    const specialNeeds = document.getElementById('child1_special_needs');
    if (specialNeeds) {
        specialNeeds.value = 'No known allergies or special considerations.';
        console.log('✅ Special needs filled');
    }
    
    // Parent Information
    const parentName = document.getElementById('parent_name');
    if (parentName) {
        parentName.value = 'Sarah Thompson';
        console.log('✅ Parent name filled');
    }
    
    const parentPhone = document.getElementById('parent_phone');
    if (parentPhone) {
        parentPhone.value = '555-123-4567';
        console.log('✅ Parent phone filled');
    }
    
    const parentEmail = document.getElementById('parent_email');
    if (parentEmail) {
        parentEmail.value = 'sarah.thompson.test@example.com';
        console.log('✅ Parent email filled');
    }
    
    const address = document.getElementById('address');
    if (address) {
        address.value = '123 Oak Street\nLincoln, CA 95648';
        console.log('✅ Address filled');
    }
    
    // Emergency Contact
    const emergencyName = document.getElementById('emergency_name');
    if (emergencyName) {
        emergencyName.value = 'John Thompson';
        console.log('✅ Emergency name filled');
    }
    
    const emergencyPhone = document.getElementById('emergency_phone');
    if (emergencyPhone) {
        emergencyPhone.value = '555-987-6543';
        console.log('✅ Emergency phone filled');
    }
    
    const emergencyRelationship = document.getElementById('emergency_relationship');
    if (emergencyRelationship) {
        emergencyRelationship.value = 'Father';
        console.log('✅ Emergency relationship filled');
    }
    
    // Medical Information
    const medicalInfo = document.getElementById('medical_info');
    if (medicalInfo) {
        medicalInfo.value = 'No known allergies or medical conditions.';
        console.log('✅ Medical info filled');
    }
    
    const dietaryRestrictions = document.getElementById('dietary_restrictions');
    if (dietaryRestrictions) {
        dietaryRestrictions.value = 'No dietary restrictions.';
        console.log('✅ Dietary restrictions filled');
    }
    
    // Waivers and Permissions - Check all required checkboxes
    const participationWaiver = document.getElementById('participation_waiver');
    if (participationWaiver) {
        participationWaiver.checked = true;
        console.log('✅ Participation waiver checked');
    }
    
    const liabilityWaiver = document.getElementById('liability_waiver');
    if (liabilityWaiver) {
        liabilityWaiver.checked = true;
        console.log('✅ Liability waiver checked');
    }
    
    const medicalEmergency = document.getElementById('medical_emergency');
    if (medicalEmergency) {
        medicalEmergency.checked = true;
        console.log('✅ Medical emergency checked');
    }
    
    // Photo Permission
    const photoYes = document.getElementById('photo_yes');
    if (photoYes) {
        photoYes.checked = true;
        console.log('✅ Photo permission selected');
    }
    
    // Additional Information
    const additionalInfo = document.getElementById('additional_info');
    if (additionalInfo) {
        additionalInfo.value = 'Emma loves nature and is excited to join the forest school program!';
        console.log('✅ Additional info filled');
    }
    
    console.log('🎉 Form filled with test data successfully!');
    
    // Add visual indicator that form is filled
    const header = document.querySelector('.enrollment-header');
    if (header) {
        const testNotice = document.createElement('div');
        testNotice.style.background = '#4CAF50';
        testNotice.style.color = 'white';
        testNotice.style.padding = '10px';
        testNotice.style.borderRadius = '5px';
        testNotice.style.margin = '10px 0';
        testNotice.style.textAlign = 'center';
        testNotice.innerHTML = '🧪 TEST MODE: Form has been pre-filled with test data';
        header.appendChild(testNotice);
    }
    
    // Add submit test button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        const testSubmitBtn = document.createElement('button');
        testSubmitBtn.type = 'button';
        testSubmitBtn.textContent = '🧪 Test Submit Form';
        testSubmitBtn.style.backgroundColor = '#FF9800';
        testSubmitBtn.style.color = 'white';
        testSubmitBtn.style.border = 'none';
        testSubmitBtn.style.padding = '12px 24px';
        testSubmitBtn.style.borderRadius = '5px';
        testSubmitBtn.style.marginLeft = '10px';
        testSubmitBtn.style.cursor = 'pointer';
        
        testSubmitBtn.addEventListener('click', function() {
            console.log('🧪 Test submit clicked - triggering form submission...');
            testFormSubmission();
        });
        
        submitBtn.parentNode.appendChild(testSubmitBtn);
    }
}

function testFormSubmission() {
    console.log('🔍 Testing form submission...');
    
    const form = document.getElementById('enrollmentForm');
    if (!form) {
        console.error('❌ Form not found!');
        return;
    }
    
    console.log('📋 Form details:');
    console.log('- Action:', form.action);
    console.log('- Method:', form.method);
    console.log('- Target:', form.target);
    
    // Check if all required fields are filled
    const requiredFields = form.querySelectorAll('[required]');
    const emptyRequired = [];
    
    requiredFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            if (!field.checked) {
                // For checkbox/radio groups, check if any in the group is checked
                const groupName = field.name;
                const groupChecked = form.querySelector(`[name="${groupName}"]:checked`);
                if (!groupChecked) {
                    emptyRequired.push(field);
                }
            }
        } else if (!field.value.trim()) {
            emptyRequired.push(field);
        }
    });
    
    if (emptyRequired.length > 0) {
        console.warn('⚠️ Empty required fields found:', emptyRequired.map(f => f.id || f.name));
        emptyRequired.forEach(field => {
            console.log(`- ${field.id || field.name}: "${field.value}"`);
        });
    } else {
        console.log('✅ All required fields are filled');
    }
    
    // Check form validation
    if (form.checkValidity()) {
        console.log('✅ Form passes HTML5 validation');
        
        // Test the actual submission
        console.log('🚀 Attempting form submission...');
        
        // Set up iframe load listener to track submission
        const iframe = document.getElementById('hidden_iframe');
        if (iframe) {
            iframe.onload = function() {
                console.log('📨 Iframe loaded - submission may have completed');
                if (window.submitted) {
                    console.log('✅ Form submission successful!');
                } else {
                    console.log('⚠️ Form submitted but success flag not set');
                }
            };
        }
        
        // Submit the form
        form.submit();
        
    } else {
        console.error('❌ Form fails HTML5 validation');
        form.reportValidity();
    }
}

// Inject the script into the page
if (typeof window !== 'undefined') {
    console.log('🧪 Test script loaded');
}
