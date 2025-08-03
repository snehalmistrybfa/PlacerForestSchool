// Enrollment form specific functionality
let childCount = 1;
let submitted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form functionality
    initializeForm();
    
    // Track form start
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_start', {
            event_category: 'enrollment',
            event_label: 'registration_form',
            value: 1
        });
    }
});

function initializeForm() {
    const form = document.getElementById('enrollmentForm');
    if (!form) return;
    
    // Add form submission handler
    form.addEventListener('submit', handleFormSubmission);
    
    // Add real-time validation
    addFieldValidation();
    
    // Track form interactions
    trackFormInteractions();
}

function addChild() {
    childCount++;
    const container = document.getElementById('children-container');
    
    const childGroup = document.createElement('div');
    childGroup.className = 'child-info-group';
    childGroup.setAttribute('data-child', childCount);
    
    childGroup.innerHTML = `
        <button type="button" class="remove-child-btn" onclick="removeChild(${childCount})" title="Remove this child">×</button>
        <h3>Child ${childCount}</h3>
        <div class="form-row">
            <div class="form-group">
                <label for="child${childCount}_name">Child's Full Name:</label>
                <input type="text" name="entry.child${childCount}_name" id="child${childCount}_name" required>
            </div>
            <div class="form-group">
                <label for="child${childCount}_dob">Date of Birth:</label>
                <input type="date" name="entry.child${childCount}_dob" id="child${childCount}_dob" required>
            </div>
        </div>
        <div class="form-group">
            <label for="child${childCount}_special_needs">Special Considerations (allergies, medical conditions, behavioral notes):</label>
            <textarea name="entry.child${childCount}_special_needs" id="child${childCount}_special_needs" rows="3" placeholder="Please describe any allergies, medical conditions, or other important information about your child..."></textarea>
        </div>
    `;
    
    container.appendChild(childGroup);
    
    // Add validation to new fields
    addFieldValidation();
    
    // Track event
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_child', {
            event_category: 'enrollment',
            event_label: 'form_interaction',
            value: childCount
        });
    }
    
    // Scroll to new child section
    childGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function removeChild(childNumber) {
    const childGroup = document.querySelector(`[data-child="${childNumber}"]`);
    if (childGroup && childCount > 1) {
        childGroup.remove();
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'remove_child', {
                event_category: 'enrollment',
                event_label: 'form_interaction',
                value: childNumber
            });
        }
        
        // Renumber remaining children
        renumberChildren();
    }
}

function renumberChildren() {
    const childGroups = document.querySelectorAll('.child-info-group');
    childCount = childGroups.length;
    
    childGroups.forEach((group, index) => {
        const childNum = index + 1;
        group.setAttribute('data-child', childNum);
        
        // Update heading
        const heading = group.querySelector('h3');
        if (heading) {
            heading.textContent = `Child ${childNum}`;
        }
        
        // Update remove button (don't show for first child)
        const removeBtn = group.querySelector('.remove-child-btn');
        if (removeBtn) {
            if (childNum === 1 && childCount === 1) {
                removeBtn.style.display = 'none';
            } else {
                removeBtn.style.display = 'flex';
                removeBtn.setAttribute('onclick', `removeChild(${childNum})`);
            }
        }
        
        // Update form field names and IDs
        const inputs = group.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            const fieldType = input.id.split('_').slice(1).join('_'); // Get everything after 'childX_'
            input.id = `child${childNum}_${fieldType}`;
            input.name = `entry.child${childNum}_${fieldType}`;
            
            // Update associated label
            const label = group.querySelector(`label[for*="${fieldType}"]`);
            if (label) {
                label.setAttribute('for', `child${childNum}_${fieldType}`);
            }
        });
    });
}

function addFieldValidation() {
    // Add validation to all form fields
    const formFields = document.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        // Remove existing listeners to avoid duplicates
        field.removeEventListener('blur', validateField);
        field.removeEventListener('input', clearFieldError);
        
        // Add new listeners
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

function validateField(event) {
    const field = event.target;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    else if (field.type === 'email' && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Phone validation
    else if (field.type === 'tel' && field.value.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = field.value.replace(/[\s\-\(\)\.]/g, '');
        if (!phoneRegex.test(cleanPhone) || cleanPhone.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }
    
    // Date validation (child must be between 3 and 18 years old)
    else if (field.type === 'date' && field.value && field.id.includes('dob')) {
        const birthDate = new Date(field.value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        if (age < 3) {
            isValid = false;
            errorMessage = 'Child must be at least 3 years old';
        } else if (age > 18) {
            isValid = false;
            errorMessage = 'Program is designed for children up to 18 years old';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.classList.remove('error');
        hideFieldError(field);
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function clearFieldError(event) {
    const field = event.target;
    field.classList.remove('error');
    hideFieldError(field);
}

function showFieldError(field, message) {
    hideFieldError(field); // Remove existing error first
    
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    
    // Insert after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function validateFullForm() {
    let isFormValid = true;
    const formFields = document.querySelectorAll('input[required], select[required], textarea[required]');
    
    formFields.forEach(field => {
        const fieldValid = validateField({ target: field });
        if (!fieldValid) {
            isFormValid = false;
        }
    });
    
    // Check that at least one waiver checkbox is checked
    const waiverCheckboxes = document.querySelectorAll('input[type="checkbox"][required]');
    waiverCheckboxes.forEach(checkbox => {
        if (!checkbox.checked) {
            isFormValid = false;
            checkbox.classList.add('error');
        } else {
            checkbox.classList.remove('error');
        }
    });
    
    // Check that photo permission radio is selected
    const photoRadios = document.querySelectorAll('input[name*="photo"]');
    const photoSelected = Array.from(photoRadios).some(radio => radio.checked);
    if (!photoSelected) {
        isFormValid = false;
        photoRadios.forEach(radio => radio.classList.add('error'));
    } else {
        photoRadios.forEach(radio => radio.classList.remove('error'));
    }
    
    return isFormValid;
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    // Validate form
    if (!validateFullForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Track validation failure
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_validation_error', {
                event_category: 'enrollment',
                event_label: 'registration_form',
                value: 1
            });
        }
        
        return false;
    }
    
    // Show loading state
    const formContainer = document.querySelector('.form-container');
    const submitBtn = document.querySelector('.submit-btn');
    
    formContainer.classList.add('loading');
    submitBtn.disabled = true;
    
    // Set submitted flag
    submitted = true;
    
    // Track successful submission
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit_success', {
            event_category: 'enrollment',
            event_label: 'registration_form',
            value: 1
        });
    }
    
    // Submit the form
    event.target.submit();
    
    // Set timeout fallback in case iframe doesn't load
    setTimeout(() => {
        if (submitted) {
            showSuccessMessage();
        }
    }, 3000);
}

function showSuccessMessage() {
    if (!submitted) return;
    
    const formContainer = document.querySelector('.form-container');
    const successMessage = document.getElementById('success-message');
    
    formContainer.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Track success message view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'registration_complete', {
            event_category: 'enrollment',
            event_label: 'success_message_shown',
            value: 1
        });
    }
    
    // Reset submitted flag
    submitted = false;
}

function trackFormInteractions() {
    // Track field focus events
    const formFields = document.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('focus', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_field_focus', {
                    event_category: 'enrollment',
                    event_label: field.id || field.name || 'unknown_field',
                    value: 1
                });
            }
        });
    });
    
    // Track checkbox and radio interactions
    const checkboxes = document.querySelectorAll('input[type="checkbox"], input[type="radio"]');
    checkboxes.forEach(input => {
        input.addEventListener('change', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_option_select', {
                    event_category: 'enrollment',
                    event_label: `${input.type}_${input.name}`,
                    value: input.checked ? 1 : 0
                });
            }
        });
    });
}

// Format phone numbers as user types
document.addEventListener('input', function(event) {
    if (event.target.type === 'tel') {
        const input = event.target;
        let value = input.value.replace(/\D/g, ''); // Remove non-digits
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
        }
        
        input.value = value;
    }
});

// Auto-save form data to localStorage (optional feature)
function saveFormData() {
    const formData = {};
    const form = document.getElementById('enrollmentForm');
    const formFields = form.querySelectorAll('input, select, textarea');
    
    formFields.forEach(field => {
        if (field.type === 'checkbox' || field.type === 'radio') {
            formData[field.name] = field.checked;
        } else {
            formData[field.name] = field.value;
        }
    });
    
    localStorage.setItem('forestSchoolFormData', JSON.stringify(formData));
}

function loadFormData() {
    const savedData = localStorage.getItem('forestSchoolFormData');
    if (!savedData) return;
    
    try {
        const formData = JSON.parse(savedData);
        const form = document.getElementById('enrollmentForm');
        
        Object.keys(formData).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                if (field.type === 'checkbox' || field.type === 'radio') {
                    field.checked = formData[fieldName];
                } else {
                    field.value = formData[fieldName];
                }
            }
        });
    } catch (e) {
        console.warn('Error loading saved form data:', e);
    }
}

// Auto-save form data every 30 seconds
setInterval(saveFormData, 30000);

// Clear saved data when form is successfully submitted
function clearSavedFormData() {
    localStorage.removeItem('forestSchoolFormData');
}

// Load saved data when page loads (optional - uncomment if desired)
// document.addEventListener('DOMContentLoaded', loadFormData);

// Handle page visibility change (save data when user switches tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        saveFormData();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn && !submitBtn.disabled) {
            submitBtn.click();
        }
    }
    
    // Ctrl/Cmd + S to save form data
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFormData();
        
        // Show brief save confirmation
        const saveConfirmation = document.createElement('div');
        saveConfirmation.textContent = 'Form data saved locally';
        saveConfirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--sage-green);
            color: white;
            padding: 1rem;
            border-radius: 5px;
            z-index: 9999;
            font-weight: 600;
        `;
        document.body.appendChild(saveConfirmation);
        
        setTimeout(() => {
            saveConfirmation.remove();
        }, 2000);
    }
});
