// js/home.js
document.addEventListener('DOMContentLoaded', async () => {
    const eventListContainer = document.getElementById('event-list');
    
    console.log('🏠 Loading home page events...');
    

    showLoading(eventListContainer);
    
    try {

        const response = await fetchData('/events');
        console.log('API Response:', response);
        
        if (response && Array.isArray(response) && response.length > 0) {

            displayEvents(response, eventListContainer);
            console.log(`✅ Successfully loaded ${response.length} events`);
        } else if (response && response.success && response.data && response.data.length > 0) {

            displayEvents(response.data, eventListContainer);
            console.log(`✅ Successfully loaded ${response.data.length} events`);
        } else {
            eventListContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: #666;">
                    <h3>No Upcoming Events</h3>
                    <p>There are currently no upcoming charity events. Please check back later for new events!</p>
                    <p>You can also check our <a href="search.html" style="color: #2563eb;">search page</a> for all events.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading home page events:', error);
        showHomePageError(eventListContainer, error);
    }
});

function displayEvents(events, container) {
    console.log('Displaying events:', events);
    
    container.innerHTML = events.map(event => `
        <div class="event-card">
            <div class="event-header">
                <h3><a href="event-details.html?id=${event.id}">${event.name}</a></h3>
                <span class="event-category">${event.category_name || event.category || 'General'}</span>
            </div>
            
            <div class="event-info">
                <p><strong>📅 Date:</strong> ${formatDate(event.date)}</p>
                <p><strong>📍 Location:</strong> ${event.location}</p>
                <p><strong>💰 Ticket Price:</strong> ${formatCurrency(event.ticket_price)}</p>
            </div>
            
            <div class="event-purpose">
                <p><strong>🎯 Purpose:</strong> ${event.purpose || 'Supporting charitable causes'}</p>
            </div>
            
            <div class="event-description">
                <p>${event.description || 'No description available'}</p>
            </div>
            
            <div class="event-actions">
                <a href="event-details.html?id=${event.id}" class="btn">View Details & Register</a>
            </div>
        </div>
    `).join('');
}

function showHomePageError(container, error) {
    container.innerHTML = `
        <div class="error-message">
            <h3>Debug Information</h3>
            <p><strong>Error:</strong> ${error.message}</p>
            <p>API is working but there might be a display issue.</p>
            <div style="margin-top: 1rem;">
                <button onclick="location.reload()" class="btn">🔄 Retry Loading</button>
                <button onclick="debugAPI()" class="btn">🐛 Debug API Response</button>
            </div>
        </div>
    `;
}


async function debugAPI() {
    try {
        const response = await fetch('https://f3ce1f1f7e196724bc049b8111b70e55.serveo.net/api/events');
        const data = await response.json();
        console.log('📊 Full API Response:', data);
        console.log('🔍 First event details:', data[0]);
        alert('Check browser console for detailed API response');
    } catch (error) {
        console.error('Debug failed:', error);
    }
}