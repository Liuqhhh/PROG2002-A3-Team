// js/search.js
document.addEventListener('DOMContentLoaded', async () => {
    const categorySelect = document.getElementById('category');
    const resultsContainer = document.getElementById('search-results');
    const searchForm = document.getElementById('search-form');
    const clearButton = document.getElementById('clear-filters');
    
    console.log('🔍 Initializing search page...');
    
    // Show loading state for categories
    categorySelect.innerHTML = '<option value="">Loading categories...</option>';
    
    try {
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        
        if (categoriesData && categoriesData.success) {
            const categories = categoriesData.data;
            categorySelect.innerHTML = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
            
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #666;">
                    <h3>Ready to Search</h3>
                    <p>Use the search form above to find charity events that match your interests.</p>
                    <p>You can filter by category, location, or specific date.</p>
                </div>
            `;
        } else {
            throw new Error('Failed to load categories');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categorySelect.innerHTML = '<option value="">Failed to load categories</option>';
        resultsContainer.innerHTML = '<div class="error-message">Failed to load event categories. Please refresh the page.</div>';
    }

    // Search form submission
    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await performSearch();
    });

    // Clear button
    clearButton.addEventListener('click', () => {
        searchForm.reset();
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>Filters Cleared</h3>
                <p>Use the search form above to find charity events.</p>
            </div>
        `;
    });
});

async function performSearch() {
    const formData = new FormData(document.getElementById('search-form'));
    const params = new URLSearchParams();
    const resultsContainer = document.getElementById('search-results');
    
    // Collect form data
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    
    // Build query parameters
    if (category) params.append('category', category);
    if (location) params.append('location', location);
    if (date) params.append('date', date);

    const queryString = params.toString();
    console.log('🔍 Search parameters:', { category, location, date });
    
    // Show loading state
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <h3>Searching Events...</h3>
            <p>Please wait while we find events matching your criteria.</p>
        </div>
    `;
    
    try {

        const response = await fetch(`/api/events/search?${queryString}`);
        const responseData = await response.json();
        
        if (responseData && responseData.success) {
            const events = responseData.data;
            displaySearchResults(events, resultsContainer, { category, location, date });
        } else {
            throw new Error('Search request failed');
        }
    } catch (error) {
        console.error('Search error:', error);
        resultsContainer.innerHTML = `
            <div class="error-message">
                <h3>Search Failed</h3>
                <p>We encountered an error while searching for events. Please try again.</p>
                <button onclick="performSearch()" class="btn" style="margin-top: 0.5rem;">🔄 Retry Search</button>
            </div>
        `;
    }
}

function displaySearchResults(events, container, filters) {
    if (events.length > 0) {
        // Show search summary
        const filterSummary = getFilterSummary(filters);
        
        container.innerHTML = `
            <div class="search-summary">
                <h4>Found ${events.length} event(s) ${filterSummary}</h4>
            </div>
            <div class="events-grid">
                ${events.map(event => createEventCard(event)).join('')}
            </div>
        `;
    } else {
        const filterSummary = getFilterSummary(filters);
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #666;">
                <h3>No Events Found</h3>
                <p>No events match your search criteria ${filterSummary}.</p>
                <p>Try adjusting your filters or browse all available events.</p>
                <div style="margin-top: 1.5rem;">
                    <button onclick="document.getElementById('clear-filters').click()" class="btn">🗑️ Clear Filters</button>
                    <a href="index.html" class="btn btn-secondary">🏠 View All Events</a>
                </div>
            </div>
        `;
    }
}

function createEventCard(event) {
    return `
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
            
            <div class="fundraising-progress">
                <p><strong>💰 Fundraising:</strong> ${formatCurrency(event.progress_amount || 0)} of ${formatCurrency(event.goal_amount || 0)}</p>
            </div>
            
            <div class="event-actions">
                <a href="event-details.html?eventId=${event.id}" class="btn">View Details & Register</a>
            </div>
        </div>
    `;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function getFilterSummary(filters) {
    const activeFilters = [];
    if (filters.category) activeFilters.push(`in "${filters.category}"`);
    if (filters.location) activeFilters.push(`near "${filters.location}"`);
    if (filters.date) activeFilters.push(`on ${new Date(filters.date).toLocaleDateString()}`);
    
    return activeFilters.length > 0 ? `(${activeFilters.join(', ')})` : '';
}

// Add search-specific CSS
const searchStyle = document.createElement('style');
searchStyle.textContent = `
    .search-summary {
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 8px;
        border-left: 4px solid #2563eb;
    }
    
    .search-summary h4 {
        color: #374151;
        margin: 0;
    }
    
    .fundraising-progress {
        margin: 1rem 0;
        padding: 0.75rem;
        background: #f0fdf4;
        border-radius: 6px;
        border-left: 3px solid #10b981;
    }
`;
document.head.appendChild(searchStyle);