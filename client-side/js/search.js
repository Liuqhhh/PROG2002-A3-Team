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
        const categoriesData = await callAPI('/categories');
        
        if (categoriesData && Array.isArray(categoriesData) && categoriesData.length > 0) {
            const categories = categoriesData;
            categorySelect.innerHTML = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        } else if (categoriesData && categoriesData.success && categoriesData.data) {
            const categories = categoriesData.data;
            categorySelect.innerHTML = '<option value="">All Categories</option>' +
                categories.map(cat => `<option value="${cat.name}">${cat.name}</option>`).join('');
        } else {
            throw new Error('Failed to load categories');
        }
        
        // 初始加载时显示所有事件
        await performSearch();
        
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
        performSearch(); // 清空后显示所有事件
    });
});

async function performSearch() {
    const formData = new FormData(document.getElementById('search-form'));
    const resultsContainer = document.getElementById('search-results');
    
    // Collect form data
    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    const date = document.getElementById('date').value;
    
    console.log('🔍 Search parameters:', { category, location, date });
    
    // Show loading state
    resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #666;">
            <h3>Searching Events...</h3>
            <p>Please wait while we find events matching your criteria.</p>
        </div>
    `;
    
    try {
        const responseData = await callAPI('/events');
        
        if (responseData && Array.isArray(responseData)) {
            let events = responseData;
            
            // 客户端过滤
            if (category) {
                events = events.filter(event => 
                    event.category_name === category || 
                    event.category === category
                );
            }
            
            if (location) {
                events = events.filter(event => 
                    event.location.toLowerCase().includes(location.toLowerCase())
                );
            }
            
            if (date) {
                const filterDate = new Date(date).toDateString();
                events = events.filter(event => 
                    new Date(event.date).toDateString() === filterDate
                );
            }
            
            displaySearchResults(events, resultsContainer, { category, location, date });
        } else {
            throw new Error('Invalid response format');
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
    if (amount === 0 || amount === null) return 'Free';
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