// 🌲 Placer Forest School - Enrollment Form Handler
// Simple, reliable form submission with validation

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enrollmentForm');
    
    if (!form) {
        console.error('Enrollment form not found');
        return;
    }
    
    console.log('🌲 Enrollment form handler initialized');
    
    // Form submission handler
    form.addEventListener('submit', function(event) {
        console.log('Form submission started...');
        
        // Clear any previous errors
        clearValidationErrors();
        
        // Run custom validation
        const validationResult = validateEnrollmentForm();
        
        if (!validationResult.isValid) {
            // Block submission if validation fails
            event.preventDefault();
            displayValidationErrors(validationResult.errors);
            
            // Track validation failure
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_validation_error', {
                    event_category: 'enrollment',
                    event_label: 'registration_form',
                    value: validationResult.errors.length
                });
            }
            
            return;
        }
        
        // Validation passed - prepare for submission
        console.log('Validation passed, preparing submission...');
        
        // Set global flag for iframe mechanism
        window.submitted = true;
        console.log('Set window.submitted to:', window.submitted);
        
        // Update UI to show submission in progress
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
        }
        
        // Add loading state to form container
        const formContainer = document.querySelector('.form-container');
        if (formContainer) {
            formContainer.classList.add('submitting');
        }
        
        // Track successful form submission
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit_success', {
                event_category: 'enrollment',
                event_label: 'registration_form',
                value: 1
            });
        }
        
        console.log('Form will now submit naturally to iframe...');
        // Form will submit naturally to the hidden iframe
    });
});

// Custom validation function
function validateEnrollmentForm() {
    const errors = [];
    
    // Validate child age (basic check)
    const dobInput = document.getElementById('child1_dob');
    if (dobInput && dobInput.value) {
        const birthDate = new Date(dobInput.value);
        const today = new Date();
        const age = (today - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
        
        if (age < 3) {
            errors.push({
                field: dobInput,
                message: 'Child must be at least 3 years old for our program'
            });
        } else if (age > 15) {
            errors.push({
                field: dobInput,
                message: 'Our program is designed for children up to 15 years old'
            });
        }
    }
    
    // Validate phone numbers are different
    const parentPhone = document.getElementById('parent_phone');
    const emergencyPhone = document.getElementById('emergency_phone');
    
    if (parentPhone && emergencyPhone && 
        parentPhone.value && emergencyPhone.value &&
        parentPhone.value.replace(/\D/g, '') === emergencyPhone.value.replace(/\D/g, '')) {
        errors.push({
            field: emergencyPhone,
            message: 'Emergency contact phone must be different from parent phone'
        });
    }
    
    // Validate phone format (basic US phone number)
    const phoneFields = [parentPhone, emergencyPhone];
    phoneFields.forEach(field => {
        if (field && field.value) {
            const phonePattern = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
            if (!phonePattern.test(field.value)) {
                errors.push({
                    field: field,
                    message: 'Please enter a valid phone number (e.g., 555-123-4567)'
                });
            }
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Clear validation errors
function clearValidationErrors() {
    // Remove error classes
    const errorFields = document.querySelectorAll('.field-error');
    errorFields.forEach(field => {
        field.classList.remove('field-error');
    });
    
    // Remove error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.remove();
    });
}

// Display validation errors
function displayValidationErrors(errors) {
    errors.forEach(error => {
        // Add error class to field
        error.field.classList.add('field-error');
        
        // Create and insert error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message;
        errorMessage.style.color = '#d32f2f';
        errorMessage.style.fontSize = '14px';
        errorMessage.style.marginTop = '5px';
        
        // Insert after the field
        error.field.parentNode.insertBefore(errorMessage, error.field.nextSibling);
    });
    
    // Scroll to first error
    if (errors.length > 0) {
        errors[0].field.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
        errors[0].field.focus();
    }
}

// Success message handler - called by iframe onload
function showSuccessMessage() {
    console.log('showSuccessMessage called, submitted flag:', window.submitted);
    
    if (!window.submitted) {
        console.log('No submitted flag, skipping success message');
        return;
    }
    
    console.log('Showing success message...');
    
    // Hide the form
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.display = 'none';
        console.log('Form container hidden');
    }
    
    // Show success message
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
        console.log('Success message displayed');
    }
    
    // Track success message display
    if (typeof gtag !== 'undefined') {
        gtag('event', 'registration_complete', {
            event_category: 'enrollment',
            event_label: 'success_message_shown',
            value: 1
        });
    }
    
    // Reset the submitted flag
    window.submitted = false;
    
    console.log('Success message displayed successfully');
}

// Make functions globally accessible
window.showSuccessMessage = showSuccessMessage;

// Add child functionality (simplified version)
function addChild() {
    // This would add additional child forms
    // For now, just show a message
    alert('Multiple child enrollment: Please contact us directly at (916) 258-5035 for registering multiple children.');
}

// Make addChild globally accessible for the button onclick
window.addChild = addChild;

// Add some basic CSS for error styling if not already present
const style = document.createElement('style');
style.textContent = `
    .field-error {
        border-color: #d32f2f !important;
        box-shadow: 0 0 0 1px #d32f2f !important;
    }
    
    .submitting {
        opacity: 0.8;
        pointer-events: none;
    }
    
    .error-message {
        animation: fadeIn 0.3s ease-in;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

console.log('🌲 Enrollment form handler loaded successfully');
