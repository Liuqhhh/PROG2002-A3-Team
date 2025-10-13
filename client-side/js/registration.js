// registration.js

// Get event ID from URL parameters (e.g., registration.html?eventId=1)
function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('eventId');
}

// Load event information (using mock data for now)
function loadEventInfo() {
    const eventId = getEventIdFromURL();
    
    if (!eventId) {
        document.getElementById('eventInfo').innerHTML = '<p>Error: No event specified</p>';
        return;
    }

    // Mock data - replace with actual API call later
    const mockEvent = {
        id: eventId,
        name: "Charity Gala Dinner",
        date: "October 20, 2025",
        location: "Sydney Opera House",
        description: "Annual charity fundraising event featuring dinner, auction, and performances. All proceeds will be donated to children's education foundation."
    };

    // Display event information
    document.querySelector('#eventInfo h2').textContent = mockEvent.name;
    document.getElementById('eventDate').textContent = mockEvent.date;
    document.getElementById('eventLocation').textContent = mockEvent.location;
    document.getElementById('eventDescription').textContent = mockEvent.description;
}

// Form submission handler
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const formData = {
        eventId: getEventIdFromURL(),
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        ticketCount: parseInt(document.getElementById('ticketCount').value),
        specialRequirements: document.getElementById('specialRequirements').value,
        registrationDate: new Date().toISOString()
    };

    // Submit registration (mock version for now)
    submitRegistration(formData);
});

// Form validation
function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const ticketCount = document.getElementById('ticketCount').value;

    if (!fullName) {
        alert('Please enter your full name');
        return false;
    }

    if (!email || !isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    if (!ticketCount) {
        alert('Please select number of tickets');
        return false;
    }

    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit registration (mock version)
function submitRegistration(formData) {
    console.log('Submitting registration data:', formData);
    
    // Mock API call - replace with real API when backend is ready
    setTimeout(() => {
        // Show success message
        document.getElementById('registrationForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
        // In real version, this would be:
        // fetch('/api/registrations', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formData)
        // })
    }, 1000);
}

// Go back to previous page
function goBack() {
    window.history.back();
}

// Go to homepage
function goToHome() {
    window.location.href = 'index.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEventInfo();
});