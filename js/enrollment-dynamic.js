/**
 * Enrollment Form Dynamic Content Management
 */

let childCount = 1;
let submitted = false;
let enrollmentContent = null;

/**
 * Initialize enrollment page with dynamic content
 */
async function initializePage() {
    if (contentManager.pageContent) {
        enrollmentContent = contentManager.pageContent;
        populateEnrollmentContent();
    }
}

/**
 * Populate enrollment form with content from JSON
 */
function populateEnrollmentContent() {
    if (!enrollmentContent) return;

    // Update page title and description
    const pageTitle = document.querySelector('.enrollment-header h1');
    const pageDescription = document.querySelector('.enrollment-header p');
    
    if (pageTitle) pageTitle.textContent = enrollmentContent.pageTitle;
    if (pageDescription) pageDescription.textContent = enrollmentContent.pageDescription;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', enrollmentContent.metaDescription);

    // Update form action URL
    const form = document.getElementById('enrollmentForm');
    if (form) {
        form.action = enrollmentContent.googleForm.actionUrl;
    }

    // Populate form sections
    populateFormSections();
    
    // Update submit button
    const submitBtn = document.querySelector('.submit-btn');
    const formNote = document.querySelector('.form-note');
    
    if (submitBtn) submitBtn.textContent = enrollmentContent.submitButton.text;
    if (formNote) formNote.textContent = enrollmentContent.submitButton.note;

    // Update success message
    populateSuccessMessage();
}

/**
 * Populate form sections dynamically
 */
function populateFormSections() {
    // Program Selection
    populateProgramSelection();
    
    // Child Information
    populateChildInformation();
    
    // Parent Information
    populateParentInformation();
    
    // Emergency Contact
    populateEmergencyContact();
    
    // Medical Information
    populateMedicalInformation();
    
    // Waivers and Permissions
    populateWaiversAndPermissions();
    
    // Additional Information
    populateAdditionalInformation();
    
    // Payment Information
    populatePaymentInformation();
}

/**
 * Populate program selection section
 */
function populateProgramSelection() {
    const section = enrollmentContent.formSections.programSelection;
    const select = document.getElementById('program');
    const label = document.querySelector('label[for="program"]');
    
    if (label) label.textContent = section.fields.program.label;
    
    if (select) {
        select.innerHTML = '';
        select.name = enrollmentContent.googleForm.fieldMappings.program;
        
        section.fields.program.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            select.appendChild(optionElement);
        });
    }
}

/**
 * Populate child information section
 */
function populateChildInformation() {
    const section = enrollmentContent.formSections.childInformation;
    
    // Update section title
    const title = document.querySelector('.form-section h2');
    if (title && title.textContent.includes('Child Information')) {
        title.textContent = section.title;
    }
    
    // Update field labels and attributes
    updateChildFields();
    
    // Update add child button
    const addButton = document.querySelector('.add-child-btn');
    if (addButton) addButton.textContent = section.addChildButton;
}

/**
 * Update child information fields
 */
function updateChildFields() {
    const section = enrollmentContent.formSections.childInformation;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    // Update first child fields
    const nameInput = document.getElementById('child1_name');
    const dobInput = document.getElementById('child1_dob');
    const specialInput = document.getElementById('child1_special_needs');
    
    const nameLabel = document.querySelector('label[for="child1_name"]');
    const dobLabel = document.querySelector('label[for="child1_dob"]');
    const specialLabel = document.querySelector('label[for="child1_special_needs"]');
    
    if (nameLabel) nameLabel.textContent = section.fields.childName.label;
    if (dobLabel) dobLabel.textContent = section.fields.dateOfBirth.label;
    if (specialLabel) specialLabel.textContent = section.fields.specialNeeds.label;
    
    if (nameInput) nameInput.name = mappings.childName;
    if (dobInput) dobInput.name = mappings.dateOfBirth;
    if (specialInput) {
        specialInput.name = mappings.specialNeeds;
        specialInput.placeholder = section.fields.specialNeeds.placeholder;
    }
}

/**
 * Populate other form sections
 */
function populateParentInformation() {
    const section = enrollmentContent.formSections.parentInformation;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    // Update labels and field mappings
    updateFieldLabel('parent_name', section.fields.parentName.label, mappings.parentName);
    updateFieldLabel('parent_phone', section.fields.phone.label, mappings.phone);
    updateFieldLabel('parent_email', section.fields.email.label, mappings.email);
    updateFieldLabel('address', section.fields.address.label, mappings.address);
    
    // Update placeholder
    const addressField = document.getElementById('address');
    if (addressField) addressField.placeholder = section.fields.address.placeholder;
}

function populateEmergencyContact() {
    const section = enrollmentContent.formSections.emergencyContact;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    updateFieldLabel('emergency_name', section.fields.emergencyName.label, mappings.emergencyName);
    updateFieldLabel('emergency_phone', section.fields.emergencyPhone.label, mappings.emergencyPhone);
    updateFieldLabel('emergency_relationship', section.fields.emergencyRelationship.label, mappings.emergencyRelationship);
    
    const relationshipField = document.getElementById('emergency_relationship');
    if (relationshipField) relationshipField.placeholder = section.fields.emergencyRelationship.placeholder;
}

function populateMedicalInformation() {
    const section = enrollmentContent.formSections.medicalInformation;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    updateFieldLabel('medical_info', section.fields.medicalInfo.label, mappings.medicalInfo);
    updateFieldLabel('dietary_restrictions', section.fields.dietaryRestrictions.label, mappings.dietaryRestrictions);
    
    const medicalField = document.getElementById('medical_info');
    const dietaryField = document.getElementById('dietary_restrictions');
    
    if (medicalField) medicalField.placeholder = section.fields.medicalInfo.placeholder;
    if (dietaryField) dietaryField.placeholder = section.fields.dietaryRestrictions.placeholder;
}

function populateWaiversAndPermissions() {
    const section = enrollmentContent.formSections.waiversAndPermissions;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    // Update waiver checkboxes
    section.waivers.forEach((waiver, index) => {
        const checkbox = document.getElementById(waiver.id);
        const label = document.querySelector(`label[for="${waiver.id}"]`);
        
        if (checkbox) {
            const fieldMapping = Object.values(mappings)[13 + index]; // Adjust index as needed
            checkbox.name = fieldMapping;
        }
        
        if (label) {
            label.innerHTML = `<strong>${waiver.title}</strong> ${waiver.text}`;
        }
    });
    
    // Update photo permission
    const photoRadios = document.querySelectorAll('input[name="entry.171717171"]');
    const photoLabels = document.querySelectorAll('label[for^="photo_"]');
    
    photoRadios.forEach(radio => {
        radio.name = mappings.photoPermission;
    });
    
    section.photoPermission.options.forEach((option, index) => {
        if (photoRadios[index]) {
            photoRadios[index].value = option.value;
        }
        if (photoLabels[index]) {
            photoLabels[index].textContent = option.text;
        }
    });
}

function populateAdditionalInformation() {
    const section = enrollmentContent.formSections.additionalInformation;
    const mappings = enrollmentContent.googleForm.fieldMappings;
    
    updateFieldLabel('additional_info', section.fields.additionalInfo.label, mappings.additionalInfo);
    
    const additionalField = document.getElementById('additional_info');
    if (additionalField) additionalField.placeholder = section.fields.additionalInfo.placeholder;
}

function populatePaymentInformation() {
    const section = enrollmentContent.formSections.paymentInformation;
    const noticeBox = document.querySelector('.notice-box');
    
    if (noticeBox && section.notices) {
        let noticesHTML = '';
        section.notices.forEach(notice => {
            noticesHTML += `<p><strong>${notice.icon} ${notice.title}</strong> ${notice.text}</p>`;
        });
        noticeBox.innerHTML = noticesHTML;
    }
}

/**
 * Populate success message
 */
function populateSuccessMessage() {
    const successDiv = document.getElementById('success-message');
    if (!successDiv) return;
    
    const success = enrollmentContent.successMessage;
    const contact = contentManager.siteConfig?.site;
    
    if (success && contact) {
        successDiv.innerHTML = `
            <h2>${success.title}</h2>
            <p>${success.message}</p>
            <p>${success.contactPrompt}</p>
            <p>📞 ${contact.phone} | ✉️ ${contact.email}</p>
        `;
    }
}

/**
 * Helper function to update field labels and mappings
 */
function updateFieldLabel(fieldId, labelText, fieldMapping) {
    const field = document.getElementById(fieldId);
    const label = document.querySelector(`label[for="${fieldId}"]`);
    
    if (label) label.textContent = labelText;
    if (field && fieldMapping) field.name = fieldMapping;
}

/**
 * Add another child to the form
 */
function addChild() {
    childCount++;
    const container = document.getElementById('children-container');
    const section = enrollmentContent?.formSections.childInformation;
    
    if (!container || !section) return;
    
    const childDiv = document.createElement('div');
    childDiv.className = 'child-info-group';
    childDiv.setAttribute('data-child', childCount);
    
    childDiv.innerHTML = `
        <h3>Child ${childCount}</h3>
        <div class="form-row">
            <div class="form-group">
                <label for="child${childCount}_name">${section.fields.childName.label}</label>
                <input type="text" name="entry.child${childCount}_name" id="child${childCount}_name" required>
            </div>
            <div class="form-group">
                <label for="child${childCount}_dob">${section.fields.dateOfBirth.label}</label>
                <input type="date" name="entry.child${childCount}_dob" id="child${childCount}_dob" required>
            </div>
        </div>
        <div class="form-group">
            <label for="child${childCount}_special_needs">${section.fields.specialNeeds.label}</label>
            <textarea name="entry.child${childCount}_special_needs" id="child${childCount}_special_needs" rows="3" placeholder="${section.fields.specialNeeds.placeholder}"></textarea>
        </div>
        <button type="button" class="remove-child-btn" onclick="removeChild(${childCount})">Remove Child</button>
    `;
    
    container.appendChild(childDiv);
    
    // Track event
    if (typeof trackEvent === 'function') {
        trackEvent('add_child', 'enrollment', 'child_' + childCount);
    }
}

/**
 * Remove a child from the form
 */
function removeChild(childNumber) {
    const childDiv = document.querySelector(`[data-child="${childNumber}"]`);
    if (childDiv) {
        childDiv.remove();
        
        // Track event
        if (typeof trackEvent === 'function') {
            trackEvent('remove_child', 'enrollment', 'child_' + childNumber);
        }
    }
}

/**
 * Show success message after form submission
 */
function showSuccessMessage() {
    document.getElementById('enrollmentForm').style.display = 'none';
    document.getElementById('success-message').style.display = 'block';
    
    // Track conversion
    if (typeof trackEvent === 'function') {
        trackEvent('conversion', 'enrollment', 'form_completed');
    }
    
    // Scroll to success message
    document.getElementById('success-message').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    if (form) {
        form.addEventListener('submit', function() {
            submitted = true;
            
            // Track form submission
            if (typeof trackEvent === 'function') {
                trackEvent('form_submit', 'enrollment', 'registration_form');
            }
        });
    }
});
