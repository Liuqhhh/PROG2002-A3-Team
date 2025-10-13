// registration.js - Enhanced version with complete navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎟️ Registration page initialized');
    
    // Initialize the page
    loadEventInfo();
    setupFormValidation();
    setupRealTimeValidation();
    setupEventListeners();
});

// Get event ID from URL parameters
function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eventId') || 'test';
}

// Load event information
function loadEventInfo() {
    const eventId = getEventIdFromURL();
    console.log('Loading event info for ID:', eventId);
    

    const testEvent = {
        id: eventId,
        name: "慈善活动示例",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30天后
        location: "活动地点待定",
        description: "这是一个测试活动，用于演示报名页面功能。实际活动信息将在后端完成后显示。",
        ticketPrice: 100,
        category: "测试活动",
        purpose: "演示慈善活动报名流程"
    };

    updateEventUI(testEvent);
}

// Update event information in the UI
function updateEventUI(event) {
    // Update event details
    const eventNameElement = document.querySelector('.event-details .info-item:nth-child(1) span');
    const eventDateElement = document.querySelector('.event-details .info-item:nth-child(2) span');
    const eventLocationElement = document.querySelector('.event-details .info-item:nth-child(3) span');
    const eventPriceElement = document.querySelector('.event-details .ticket-price');
    const eventDescriptionElement = document.querySelector('.event-details .event-description p');
    
    if (eventNameElement) eventNameElement.textContent = event.name;
    if (eventDateElement) eventDateElement.textContent = formatDateTime(event.date);
    if (eventLocationElement) eventLocationElement.textContent = event.location;
    if (eventPriceElement) eventPriceElement.textContent = `$${event.ticketPrice}.00`;
    if (eventDescriptionElement) eventDescriptionElement.textContent = event.description;
    
    // Update ticket options with prices
    updateTicketOptions(event.ticketPrice);
    
    // Update page title
    document.title = `${event.name} - Registration | Charity Events`;
}

// Update ticket dropdown with calculated prices
function updateTicketOptions(ticketPrice) {
    const ticketSelect = document.getElementById('ticketCount');
    if (!ticketSelect) return;
    
    const options = [
        { value: '1', text: `1 Ticket - $${ticketPrice}.00` },
        { value: '2', text: `2 Tickets - $${(ticketPrice * 2).toFixed(2)}` },
        { value: '3', text: `3 Tickets - $${(ticketPrice * 3).toFixed(2)}` },
        { value: '4', text: `4 Tickets - $${(ticketPrice * 4).toFixed(2)}` },
        { value: '5', text: `5 Tickets - $${(ticketPrice * 5).toFixed(2)}` }
    ];
    
    // Clear existing options except the first one
    const firstOption = ticketSelect.options[0];
    ticketSelect.innerHTML = '';
    ticketSelect.appendChild(firstOption);
    
    // Add new options with prices
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        ticketSelect.appendChild(optionElement);
    });
}

// Setup form validation
function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submission started');
        
        if (validateForm()) {
            submitRegistration();
        } else {
            showFormError('Please fix the errors before submitting.');
        }
    });
}

// Setup real-time validation
function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
    
    inputs.forEach(input => {
        // Validate on blur
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Clear errors on input
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
        
        // Special handling for select elements
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                validateField(this);
            });
        }
    });
}

// Setup additional event listeners
function setupEventListeners() {
    // Update total amount when ticket count changes
    const ticketSelect = document.getElementById('ticketCount');
    if (ticketSelect) {
        ticketSelect.addEventListener('change', function() {
            updateTotalAmount();
        });
    }
}

// Validate entire form
function validateForm() {
    let isValid = true;
    const fields = [
        { id: 'fullName', validator: validateRequired },
        { id: 'email', validator: validateEmail },
        { id: 'ticketCount', validator: validateRequired }
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element && !field.validator(element)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const validators = {
        fullName: validateRequired,
        email: validateEmail,
        phone: validatePhone,
        ticketCount: validateRequired,
        specialRequirements: validateSpecialRequirements
    };
    
    if (validators[field.id]) {
        return validators[field.id](field);
    }
    
    return true;
}

// Field validators
function validateRequired(field) {
    const value = field.value.trim();
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    clearFieldError(field);
    return true;
}

function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
        showFieldError(field, 'Email address is required');
        return false;
    }
    
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function validatePhone(field) {
    const value = field.value.trim();
    if (!value) {
        clearFieldError(field);
        return true; // Phone is optional
    }
    
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function validateSpecialRequirements(field) {
    const value = field.value.trim();
    // Special requirements are optional, no validation needed
    clearFieldError(field);
    return true;
}

// Error handling functions
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    field.style.borderColor = '#ef4444';
    field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: block;
    `;
    
    field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
    field.classList.remove('error');
    field.style.borderColor = '';
    field.style.boxShadow = '';
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showFormError(message) {
    // Remove existing error messages
    const existingErrors = document.querySelectorAll('.form-error-message');
    existingErrors.forEach(error => error.remove());
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message form-error-message';
    errorDiv.style.cssText = `
        background: #fee2e2;
        color: #dc2626;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border-left: 4px solid #dc2626;
    `;
    errorDiv.innerHTML = `
        <strong>Error:</strong> ${message}
    `;
    
    const form = document.getElementById('registrationForm');
    if (form) {
        form.insertBefore(errorDiv, form.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

// Submit registration
function submitRegistration() {
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Processing...';
    submitBtn.disabled = true;
    
    // Collect form data
    const formData = {
        eventId: getEventIdFromURL(),
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        ticketCount: parseInt(document.getElementById('ticketCount').value),
        specialRequirements: document.getElementById('specialRequirements').value.trim(),
        registrationDate: new Date().toISOString(),
        totalAmount: calculateTotalAmount()
    };
    
    console.log('📧 Submitting registration data:', formData);
    
    // Simulate API call
    simulateAPICall(formData)
        .then(result => {
            showSuccessMessage(result);
        })
        .catch(error => {
            console.error('Registration failed:', error);
            showFormError('Registration failed. Please try again.');
        })
        .finally(() => {
            // Restore button state
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

// Simulate API call
function simulateAPICall(formData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure for demo
            const isSuccess = Math.random() > 0.2; // 80% success rate
            
            if (isSuccess) {
                resolve({
                    success: true,
                    registrationId: 'REG-' + Date.now(),
                    message: 'Registration completed successfully',
                    data: formData
                });
            } else {
                reject(new Error('Server temporarily unavailable'));
            }
        }, 2000);
    });
}

// Show success message
function showSuccessMessage(result) {
    // Hide the registration container
    const registrationContainer = document.querySelector('.registration-container');
    if (registrationContainer) {
        registrationContainer.style.display = 'none';
    }
    
    // Show success message
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        // Update success message with registration details
        const eventName = document.querySelector('.event-details .info-item:nth-child(1) span').textContent;
        const eventDate = document.querySelector('.event-details .info-item:nth-child(2) span').textContent;
        const eventLocation = document.querySelector('.event-details .info-item:nth-child(3) span').textContent;
        
        successMessage.innerHTML = `
            <h3>🎉 Registration Successful!</h3>
            <p>Thank you for registering for <strong>${eventName}</strong>.</p>
            <p>We've sent a confirmation email to <strong>${document.getElementById('email').value}</strong>.</p>
            <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #0ea5e9;">
                <p><strong>Registration Details:</strong></p>
                <p><strong>Event:</strong> ${eventName}</p>
                <p><strong>Date & Time:</strong> ${eventDate}</p>
                <p><strong>Location:</strong> ${eventLocation}</p>
                <p><strong>Tickets:</strong> ${document.getElementById('ticketCount').value}</p>
                <p><strong>Total Amount:</strong> ${formatCurrency(calculateTotalAmount())}</p>
                <p><strong>Confirmation ID:</strong> ${result.registrationId}</p>
            </div>
            <p><em>Please bring your confirmation ID and a valid ID to the event.</em></p>
            
            <div class="form-buttons">
                <button onclick="goToHome()" class="btn">🏠 Return to Homepage</button>
                <button onclick="browseAllEvents()" class="btn btn-secondary">🔍 Browse All Events</button>
                <button onclick="goBackToEvent()" class="btn btn-secondary">📅 Back to Event Details</button>
                <button onclick="shareEvent()" class="btn btn-secondary">📤 Share this Event</button>
                <button onclick="contactSupport()" class="btn btn-secondary">📞 Contact Support</button>
            </div>
        `;
    }
    
    // Log success
    console.log('✅ Registration successful:', result);
}

// Enhanced Navigation Functions
function goBack() {
    window.history.back();
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToSearch() {
    window.location.href = 'search.html';
}

// New Navigation Functions
function goBackToEvent() {
    const eventId = getEventIdFromURL();
    if (eventId && eventId !== 'test') {
        window.location.href = `event-details.html?eventId=${eventId}`;
    } else {

        goToHome();
    }
}

function browseAllEvents() {
    window.location.href = 'search.html';
}

function contactSupport() {
    alert('请联系支持团队: support@charityevents.org\n电话: (555) 123-4567');
}

function shareEvent() {
    const eventName = document.querySelector('.event-details .info-item:nth-child(1) span')?.textContent || '慈善活动';
    const eventDate = document.querySelector('.event-details .info-item:nth-child(2) span')?.textContent || '';
    
    const shareText = `我正在参加 "${eventName}" ${eventDate}。一起来支持这个有意义的慈善活动吧！`;
    
    if (navigator.share) {

        navigator.share({
            title: eventName,
            text: shareText,
            url: window.location.href
        });
    } else {

        prompt('复制以下链接分享给朋友:', window.location.href);
    }
}

function printConfirmation() {
    window.print();
}

// Utility functions
function calculateTotalAmount() {
    const ticketCount = parseInt(document.getElementById('ticketCount').value) || 0;
    const basePrice = 100; 
    return ticketCount * basePrice;
}

function updateTotalAmount() {
    const totalAmount = calculateTotalAmount();
    return totalAmount;
}

function formatDateTime(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (error) {
        console.error('Date formatting error:', error);
        return 'Date not specified';
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Add CSS for error states if not already in style.css
function injectErrorStyles() {
    if (!document.querySelector('#registration-error-styles')) {
        const style = document.createElement('style');
        style.id = 'registration-error-styles';
        style.textContent = `
            .form-group.error input,
            .form-group.error select,
            .form-group.error textarea {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
            }
            
            .error-message {
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.25rem;
                display: block;
            }
            
            .form-error-message {
                background: #fee2e2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                margin: 1rem 0;
                border-left: 4px solid #dc2626;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize error styles
injectErrorStyles();