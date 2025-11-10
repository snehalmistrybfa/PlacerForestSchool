// Auto-fill enrollment form with test data for debugging
// This script will automatically populate the form when the page loads

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all scripts to load
    setTimeout(fillFormWithTestData, 2000);
});

function fillFormWithTestData() {
    console.log('🧪 Auto-filling enrollment form with test data...');
    
    try {
        // Program Selection
        const program = document.getElementById('program');
        if (program) {
            program.value = 'Friday Program (9 AM - 1 PM)';
            program.dispatchEvent(new Event('change'));
            console.log('✅ Program selected');
        }
        
        // Child Information
        const childName = document.getElementById('child1_name');
        if (childName) {
            childName.value = 'Emma Thompson';
            childName.dispatchEvent(new Event('input'));
            console.log('✅ Child name filled');
        }
        
        const childDob = document.getElementById('child1_dob');
        if (childDob) {
            childDob.value = '2018-05-15';
            childDob.dispatchEvent(new Event('change'));
            console.log('✅ Child DOB filled');
        }
        
        const specialNeeds = document.getElementById('child1_special_needs');
        if (specialNeeds) {
            specialNeeds.value = 'No known allergies or special considerations.';
            specialNeeds.dispatchEvent(new Event('input'));
            console.log('✅ Special needs filled');
        }
        
        // Parent Information
        const parentName = document.getElementById('parent_name');
        if (parentName) {
            parentName.value = 'Sarah Thompson';
            parentName.dispatchEvent(new Event('input'));
            console.log('✅ Parent name filled');
        }
        
        const parentPhone = document.getElementById('parent_phone');
        if (parentPhone) {
            parentPhone.value = '555-123-4567';
            parentPhone.dispatchEvent(new Event('input'));
            console.log('✅ Parent phone filled');
        }
        
        const parentEmail = document.getElementById('parent_email');
        if (parentEmail) {
            parentEmail.value = 'sarah.thompson.test@example.com';
            parentEmail.dispatchEvent(new Event('input'));
            console.log('✅ Parent email filled');
        }
        
        const address = document.getElementById('address');
        if (address) {
            address.value = '123 Oak Street\nLincoln, CA 95648';
            address.dispatchEvent(new Event('input'));
            console.log('✅ Address filled');
        }
        
        // Emergency Contact
        const emergencyName = document.getElementById('emergency_name');
        if (emergencyName) {
            emergencyName.value = 'John Thompson';
            emergencyName.dispatchEvent(new Event('input'));
            console.log('✅ Emergency name filled');
        }
        
        const emergencyPhone = document.getElementById('emergency_phone');
        if (emergencyPhone) {
            emergencyPhone.value = '555-987-6543';
            emergencyPhone.dispatchEvent(new Event('input'));
            console.log('✅ Emergency phone filled');
        }
        
        const emergencyRelationship = document.getElementById('emergency_relationship');
        if (emergencyRelationship) {
            emergencyRelationship.value = 'Father';
            emergencyRelationship.dispatchEvent(new Event('input'));
            console.log('✅ Emergency relationship filled');
        }
        
        // Medical Information
        const medicalInfo = document.getElementById('medical_info');
        if (medicalInfo) {
            medicalInfo.value = 'No known allergies or medical conditions.';
            medicalInfo.dispatchEvent(new Event('input'));
            console.log('✅ Medical info filled');
        }
        
        const dietaryRestrictions = document.getElementById('dietary_restrictions');
        if (dietaryRestrictions) {
            dietaryRestrictions.value = 'No dietary restrictions.';
            dietaryRestrictions.dispatchEvent(new Event('input'));
            console.log('✅ Dietary restrictions filled');
        }
        
        // Waivers and Permissions - Updated for separate checkboxes
        const participationWaiver = document.getElementById('participation_waiver');
        if (participationWaiver) {
            participationWaiver.checked = true;
            participationWaiver.dispatchEvent(new Event('change'));
            console.log('✅ Participation waiver checked');
        }
        
        const liabilityWaiver = document.getElementById('liability_waiver');
        if (liabilityWaiver) {
            liabilityWaiver.checked = true;
            liabilityWaiver.dispatchEvent(new Event('change'));
            console.log('✅ Liability waiver checked');
        }
        
        const medicalEmergency = document.getElementById('medical_emergency');
        if (medicalEmergency) {
            medicalEmergency.checked = true;
            medicalEmergency.dispatchEvent(new Event('change'));
            console.log('✅ Medical emergency waiver checked');
        }
        
        // Photo Permission - Updated for checkbox format
        const photoYes = document.getElementById('photo_yes');
        if (photoYes) {
            photoYes.checked = true;
            photoYes.dispatchEvent(new Event('change'));
            console.log('✅ Photo permission (Yes) selected');
        }
        
        // Note: photo_no checkbox intentionally left unchecked as it's mutually exclusive
        
        // Additional Information
        const additionalInfo = document.getElementById('additional_info');
        if (additionalInfo) {
            additionalInfo.value = 'Emma loves nature and is excited to join the forest school program!';
            additionalInfo.dispatchEvent(new Event('input'));
            console.log('✅ Additional info filled');
        }
        
        console.log('🎉 Form auto-filled with test data successfully!');
        
        // Add visual indicator
        addTestDataIndicator();
        
    } catch (error) {
        console.error('❌ Error filling form with test data:', error);
    }
}

function addTestDataIndicator() {
    // Add visual indicator that form is filled with test data
    const header = document.querySelector('.enrollment-header');
    if (header && !document.querySelector('.test-data-notice')) {
        const testNotice = document.createElement('div');
        testNotice.className = 'test-data-notice';
        testNotice.style.background = '#4CAF50';
        testNotice.style.color = 'white';
        testNotice.style.padding = '15px';
        testNotice.style.borderRadius = '5px';
        testNotice.style.margin = '20px 0';
        testNotice.style.textAlign = 'center';
        testNotice.style.fontSize = '16px';
        testNotice.style.fontWeight = 'bold';
        testNotice.innerHTML = '🧪 TEST MODE: Form has been pre-filled with test data for debugging';
        header.appendChild(testNotice);
        
        // Add remove test data button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌ Clear Test Data';
        removeBtn.style.background = '#f44336';
        removeBtn.style.color = 'white';
        removeBtn.style.border = 'none';
        removeBtn.style.padding = '10px 20px';
        removeBtn.style.borderRadius = '5px';
        removeBtn.style.marginTop = '10px';
        removeBtn.style.cursor = 'pointer';
        removeBtn.addEventListener('click', clearTestData);
        testNotice.appendChild(document.createElement('br'));
        testNotice.appendChild(removeBtn);
    }
}

function clearTestData() {
    const form = document.getElementById('enrollmentForm');
    if (form) {
        form.reset();
        const testNotice = document.querySelector('.test-data-notice');
        if (testNotice) {
            testNotice.remove();
        }
        console.log('🧹 Test data cleared');
    }
}

console.log('🧪 Test data auto-fill script loaded');
