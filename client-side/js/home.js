// js/home.js
document.addEventListener('DOMContentLoaded', async () => {
    const eventListContainer = document.getElementById('event-list');
    
    console.log('🏠 Loading home page events...');
    
    // Show loading state
    showLoading(eventListContainer);
    
    try {
        const response = await fetchData('/events/home');
        
        if (response && response.success) {
            const events = response.data;
            
            if (events.length > 0) {
                displayEvents(events, eventListContainer);
                console.log(`✅ Successfully loaded ${events.length} events`);
            } else {
                eventListContainer.innerHTML = `
                    <div style="text-align: center; padding: 3rem; color: #666;">
                        <h3>No Upcoming Events</h3>
                        <p>There are currently no upcoming charity events. Please check back later for new events!</p>
                        <p>You can also check our <a href="search.html" style="color: #2563eb;">search page</a> for all events.</p>
                    </div>
                `;
            }
        } else {
            showHomePageError(eventListContainer);
        }
    } catch (error) {
        console.error('Error loading home page events:', error);
        showHomePageError(eventListContainer);
    }
});

function displayEvents(events, container) {
    container.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-header">
                <h3><a href="event-details.html?eventId=${event.id}">${event.name}</a></h3>
                <span class="event-category">${event.category_name}</span>
            </div>
            
            <div class="event-info">
                <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
                <p><strong>📍 Location:</strong> ${event.location}</p>
                <p><strong>💰 Ticket Price:</strong> ${formatCurrency(event.ticket_price)}</p>
            </div>
            
            <div class="event-purpose">
                <p><strong>🎯 Purpose:</strong> ${event.purpose}</p>
            </div>
            
            <div class="event-description">
                <p>${event.description}</p>
            </div>
            
            <div class="event-actions">
                <a href="event-details.html?eventId=${event.id}" class="btn">View Details & Register</a>
            </div>
        </div>
    `).join('');
}

function showHomePageError(container) {
    container.innerHTML = `
        <div class="error-message">
            <h3>Failed to Load Events</h3>
            <p>We're having trouble loading the events right now. This could be because:</p>
            <ul style="text-align: left; margin: 1rem 0;">
                <li>The server is not running</li>
                <li>There's a network connection issue</li>
                <li>The database needs to be initialized</li>
            </ul>
            <p>Please try the following:</p>
            <div style="margin-top: 1rem;">
                <button onclick="location.reload()" class="btn">🔄 Retry Loading</button>
                <a href="search.html" class="btn btn-secondary">🔍 Try Search Page</a>
            </div>
            <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
                If the problem persists, please make sure the server is running on http://localhost:3000
            </p>
        </div>
    `;
}

// Add some CSS for the new event card structure
const style = document.createElement('style');
style.textContent = `
    .event-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }
    
    .event-category {
        background: #dbeafe;
        color: #1e40af;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .event-info {
        margin-bottom: 1rem;
    }
    
    .event-purpose {
        margin-bottom: 1rem;
        padding: 0.75rem;
        background: #f0f9ff;
        border-radius: 8px;
        border-left: 3px solid #0ea5e9;
    }
    
    .event-description {
        margin-bottom: 1.5rem;
        color: #6b7280;
        line-height: 1.5;
    }
    
    .event-actions {
        text-align: center;
    }
`;
document.head.appendChild(style);