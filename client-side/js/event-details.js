
const API_BASE_URL = 'https://f3ce1f1f7e196724bc049b8111b70e55.serveo.net/api';

document.addEventListener('DOMContentLoaded', function() {
    console.log('Event details page loaded');
    
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    
    console.log('Event ID from URL:', eventId);
    
    if (!eventId) {
        showError('No event ID provided. Please select an event from the home or search page.');
        return;
    }
    
    loadEventDetails(eventId);
    setupRegisterButton();
});

async function loadEventDetails(eventId) {
    try {
        showLoading();
        
        console.log('Fetching event details for ID:', eventId);
        const response = await fetch(`${API_BASE_URL}/events/${eventId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API response:', result);
        
        if (result.success && result.data) {
            displayEventDetails(result.data);
        } else {
            showError(result.error || 'Event not found');
        }
    } catch (error) {
        console.error('Error loading event details:', error);
        showError('Error loading event details. Please try again later.');
    }
}

function setupRegisterButton() {
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            const urlParams = new URLSearchParams(window.location.search);
            const eventId = urlParams.get('id');
            
            if (eventId) {
                window.location.href = `registration.html?eventId=${eventId}`;
            } else {
                window.location.href = 'registration.html';
            }
        });
    }
}

function showLoading() {
    const eventDetails = document.getElementById('event-details');
    if (eventDetails) {
        eventDetails.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading event details...</p>
            </div>
        `;
    }
}

function showError(message) {
    const eventDetails = document.getElementById('event-details');
    if (eventDetails) {
        eventDetails.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Event</h3>
                <p>${message}</p>
                <div style="margin-top: 1rem;">
                    <a href="index.html" class="btn">← Back to Home</a>
                    <a href="search.html" class="btn btn-secondary">🔍 Find Other Events</a>
                </div>
            </div>
        `;
    }
}

function displayEventDetails(event) {
    const eventDetails = document.getElementById('event-details');
    
    if (!eventDetails) return;
    
    eventDetails.innerHTML = `
        <div class="event-details-container">
            <div class="event-header">
                <h1>${event.name}</h1>
                <div class="event-meta">
                    <span class="event-category">${event.category_name || event.category || 'General'}</span>
                    <span class="event-status upcoming">Upcoming</span>
                </div>
            </div>
            
            <div class="event-content">
                <div class="info-section">
                    <h3>Event Information</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <strong>Date & Time:</strong>
                            <span>${formatDate(event.date)}</span>
                        </div>
                        <div class="info-item">
                            <strong>Location:</strong>
                            <span>${event.location}</span>
                        </div>
                        <div class="info-item">
                            <strong>Organizer:</strong>
                            <span>${event.organizer || 'Charity Events Organization'}</span>
                        </div>
                        <div class="info-item">
                            <strong>Contact Email:</strong>
                            <span>${event.contact_email || 'contact@charityevents.org'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="event-sidebar">
                    <div class="ticket-info">
                        <h3>Ticket Information</h3>
                        <div class="ticket-price">
                            <span class="price">${formatCurrency(event.ticket_price)}</span>
                            ${event.ticket_price === 0 || event.ticket_price === null ? '<span class="free-badge">FREE</span>' : ''}
                        </div>
                        <p class="ticket-note">All proceeds go to charitable causes</p>
                    </div>
                    
                    ${event.goal_amount ? `
                    <div class="fundraising-info">
                        <h3>Fundraising Progress</h3>
                        <div class="goal-progress">
                            <div class="progress-stats">
                                <span>Raised: ${formatCurrency(event.progress_amount || 0)}</span>
                                <span>Goal: ${formatCurrency(event.goal_amount)}</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${Math.min(100, ((event.progress_amount || 0) / event.goal_amount) * 100)}%"></div>
                            </div>
                            <div class="progress-percentage">
                                ${Math.round(((event.progress_amount || 0) / event.goal_amount) * 100)}% Funded
                            </div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            ${event.purpose ? `
            <div class="info-section">
                <h3>Event Purpose</h3>
                <p>${event.purpose}</p>
            </div>
            ` : ''}
            
            ${event.description ? `
            <div class="info-section">
                <h3>Description</h3>
                <p>${event.description}</p>
            </div>
            ` : ''}
        </div>
    `;
}