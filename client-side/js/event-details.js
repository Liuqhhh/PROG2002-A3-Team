// js/event-details.js
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
        const response = await fetch(`/api/events/${eventId}`);
        
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


function displayEventDetails(event) {
    const container = document.getElementById('event-details');
    
    console.log('Displaying event:', event);
    

    const progressPercentage = event.goal_amount > 0 
        ? Math.min(100, (event.progress_amount / event.goal_amount) * 100) 
        : 0;
    

    const isUpcoming = new Date(event.date) >= new Date();
    const statusText = isUpcoming ? 'Upcoming' : 'Past Event';
    const statusClass = isUpcoming ? 'upcoming' : 'past';
    
    container.innerHTML = `
        <div class="event-details-container">
            <div class="event-header">
                <h2>${event.name || 'Event Name'}</h2>
                <div class="event-meta">
                    <span class="event-category">${event.category_name || 'General'}</span>
                    <span class="event-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            
            <div class="event-content">
                <div class="event-info">
                    <div class="info-section">
                        <h3>📅 Event Details</h3>
                        <div class="info-grid">
                            <div class="info-item">
                                <strong>Date & Time:</strong>
                                <span>${formatDateTime(event.date)}</span>
                            </div>
                            <div class="info-item">
                                <strong>📍 Location:</strong>
                                <span>${event.location || 'Location not specified'}</span>
                            </div>
                            <div class="info-item">
                                <strong>🎯 Category:</strong>
                                <span>${event.category_name || 'General'}</span>
                            </div>
                        </div>
                    </div>
                    
                    ${event.purpose ? `
                    <div class="info-section">
                        <h3>🎯 Purpose</h3>
                        <p>${event.purpose}</p>
                    </div>
                    ` : ''}
                    
                    <div class="info-section">
                        <h3>📖 Description</h3>
                        <p>${event.full_description || event.description || 'No detailed description available.'}</p>
                    </div>
                </div>
                
                <div class="event-sidebar">
                    <div class="ticket-info">
                        <h3>🎟️ Ticket Information</h3>
                        <div class="ticket-price">
                            <strong>Price:</strong>
                            <span class="price">$${event.ticket_price || 0}</span>
                            ${(event.ticket_price === 0 || !event.ticket_price) ? '<span class="free-badge">FREE</span>' : ''}
                        </div>
                        <p class="ticket-note">All proceeds go directly to support the charitable cause</p>
                    </div>
                    
                    ${event.goal_amount ? `
                    <div class="fundraising-info">
                        <h3>💰 Fundraising Progress</h3>
                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                            </div>
                            <div class="progress-stats">
                                <span>Raised: $${event.progress_amount || 0}</span>
                                <span>Goal: $${event.goal_amount}</span>
                            </div>
                            <div class="progress-percentage">${progressPercentage.toFixed(1)}%</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
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


function setupRegisterButton() {
    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        registerButton.addEventListener('click', function() {
            
            alert('🎟️ Registration Feature\n\nThis feature is currently under construction and will be available in the next version of our website.\n\nThank you for your interest in supporting our charity events!');
        });
    }
}


function showLoading() {
    const container = document.getElementById('event-details');
    container.innerHTML = `
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading event details...</p>
        </div>
    `;
}


function showError(message) {
    const container = document.getElementById('event-details');
    container.innerHTML = `
        <div class="error-state">
            <h3>⚠️ Error Loading Event</h3>
            <p>${message}</p>
            <div class="error-actions">
                <a href="index.html" class="btn">← Back to Home</a>
                <a href="search.html" class="btn btn-secondary">🔍 Search Events</a>
            </div>
        </div>
    `;
}