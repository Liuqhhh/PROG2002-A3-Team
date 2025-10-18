
const API_BASE_URL = 'https://f3ce1f1f7e196724bc049b8111b70e55.serveo.net/api';
let currentEvent = null;
let ticketPrice = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎟️ Registration page initialized');
    
    loadEventInfo();
    setupFormValidation();
    setupRealTimeValidation();
    setupEventListeners();
});

function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eventId');
}

async function loadEventInfo() {
    const eventId = getEventIdFromURL();
    console.log('Loading event info for ID:', eventId);
    
    if (!eventId) {
        showDefaultEvent();
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        const result = await response.json();
        
        if (result.success && result.data) {
            currentEvent = result.data;
            updateEventUI(currentEvent);
        } else {
            showDefaultEvent();
        }
    } catch (error) {
        console.error('Error loading event:', error);
        showDefaultEvent();
    }
}

function showDefaultEvent() {
    const defaultEvent = {
        id: 'default',
        name: "Charity Gala Dinner",
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        location: "City Center International Convention Center",
        description: "Annual charity fundraising dinner featuring auctions and performances to support children's education. All proceeds will be donated to the Children's Education Foundation to provide learning resources and scholarships for underprivileged students.",
        ticket_price: 150,
        category_name: "Fundraising Gala",
        purpose: "Supporting children's education through fundraising"
    };
    
    currentEvent = defaultEvent;
    ticketPrice = defaultEvent.ticket_price;
    updateEventUI(defaultEvent);
    updateTicketOptions();
}

function updateEventUI(event) {
    document.getElementById('event-name').textContent = event.name;
    document.getElementById('event-date').textContent = formatDateTime(event.date);
    document.getElementById('event-location').textContent = event.location;
    document.getElementById('event-price').textContent = `$${event.ticket_price || 0}`;
    document.getElementById('event-description').textContent = event.description;
    
    ticketPrice = event.ticket_price || 0;
    updateTicketOptions();
}

function updateTicketOptions() {
    const ticketSelect = document.getElementById('ticketCount');
    if (!ticketSelect) return;
    
    const options = [
        { value: '1', text: `1 Ticket - $${ticketPrice}.00` },
        { value: '2', text: `2 Tickets - $${(ticketPrice * 2).toFixed(2)}` },
        { value: '3', text: `3 Tickets - $${(ticketPrice * 3).toFixed(2)}` },
        { value: '4', text: `4 Tickets - $${(ticketPrice * 4).toFixed(2)}` },
        { value: '5', text: `5 Tickets - $${(ticketPrice * 5).toFixed(2)}` }
    ];
    
    const firstOption = ticketSelect.options[0];
    ticketSelect.innerHTML = '';
    ticketSelect.appendChild(firstOption);
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        ticketSelect.appendChild(optionElement);
    });
    
    updateTotalAmount();
}

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

function setupRealTimeValidation() {
    const inputs = document.querySelectorAll('#registrationForm input, #registrationForm select, #registrationForm textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
        
        if (input.tagName === 'SELECT') {
            input.addEventListener('change', function() {
                validateField(this);
                updateTotalAmount();
            });
        }
    });
}

function setupEventListeners() {
    const ticketSelect = document.getElementById('ticketCount');
    if (ticketSelect) {
        ticketSelect.addEventListener('change', function() {
            updateTotalAmount();
        });
    }
}

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
        return true;
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
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.classList.add('error');
    
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
    
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

function showFormError(message) {
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
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }
}

function updateTotalAmount() {
    const ticketCount = parseInt(document.getElementById('ticketCount').value) || 0;
    const total = ticketCount * ticketPrice;
    document.getElementById('total-amount').textContent = total.toFixed(2);
}

function submitRegistration() {
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Processing...';
    submitBtn.disabled = true;
    
    const formData = {
        eventId: getEventIdFromURL() || 'default',
        eventName: document.getElementById('event-name').textContent,
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        ticketCount: parseInt(document.getElementById('ticketCount').value),
        specialRequirements: document.getElementById('specialRequirements').value.trim(),
        registrationDate: new Date().toISOString(),
        totalAmount: calculateTotalAmount()
    };
    
    console.log('📧 Submitting registration data:', formData);
    
    simulateAPICall(formData)
        .then(result => {
            showSuccessMessage(result, formData);
        })
        .catch(error => {
            console.error('Registration failed:', error);
            showFormError('Registration failed. Please try again.');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

function simulateAPICall(formData) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                registrationId: 'REG-' + Date.now(),
                message: 'Registration completed successfully',
                data: formData
            });
        }, 2000);
    });
}

function showSuccessMessage(result, formData) {
    const registrationContainer = document.querySelector('.registration-container');
    if (registrationContainer) {
        registrationContainer.style.display = 'none';
    }
    
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        successMessage.style.display = 'block';
        
        document.getElementById('registration-details').innerHTML = `
            <div style="background: #f0f9ff; padding: 1rem; border-radius: 8px; margin: 1.5rem 0; border-left: 4px solid #0ea5e9;">
                <p><strong>Registration Details:</strong></p>
                <p><strong>Event:</strong> ${formData.eventName}</p>
                <p><strong>Date & Time:</strong> ${document.getElementById('event-date').textContent}</p>
                <p><strong>Location:</strong> ${document.getElementById('event-location').textContent}</p>
                <p><strong>Tickets:</strong> ${formData.ticketCount}</p>
                <p><strong>Total Amount:</strong> $${formData.totalAmount.toFixed(2)}</p>
                <p><strong>Confirmation ID:</strong> ${result.registrationId}</p>
            </div>
            <p><em>Please bring your confirmation ID and a valid ID to the event.</em></p>
        `;
    }
    
    console.log('✅ Registration successful:', result);
}

function calculateTotalAmount() {
    const ticketCount = parseInt(document.getElementById('ticketCount').value) || 0;
    return ticketCount * ticketPrice;
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
        return 'Date not specified';
    }
}

function goBackToEvent() {
    const eventId = getEventIdFromURL();
    if (eventId) {
        window.location.href = `event-details.html?id=${eventId}`;
    } else {
        goToHome();
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

function goToSearch() {
    window.location.href = 'search.html';
}