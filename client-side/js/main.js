// main.js
const API_BASE_URL = 'https://f3ce1f1f7e196724bc049b8111b70e55.serveo.net/api';


async function callAPI(endpoint, options = {}) {
    try {
        console.log(`🔄 Calling API: ${API_BASE_URL}${endpoint}`);
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        console.log(`Response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ API call successful: ${endpoint}`, data);
        return data;
    } catch (error) {
        console.error('❌ API call failed:', error);
        showError(`API调用失败: ${error.message}`);
        return null;
    }
}


async function testAPIConnection() {
    try {
        console.log('Testing API connection...');
        const response = await callAPI('/');
        return response !== null;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}


async function fetchData(endpoint) {
    return await callAPI(endpoint);
}

// Display error message
function showError(message) {
    // Remove existing error message
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <strong>Error:</strong> ${message}
        <br><small>Please check if the server is running and try again.</small>
    `;
    
    // Insert at the top of the page
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(errorDiv, main.firstChild);
    }
    
    // Automatically remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Display success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const main = document.querySelector('main');
    if (main) {
        main.insertBefore(successDiv, main.firstChild);
    }
    
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Format currency
function formatCurrency(amount) {
    if (amount === 0 || amount === null) return 'Free';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Show loading state
function showLoading(container) {
    if (container) {
        container.innerHTML = '<div class="loading">Loading events...</div>';
    }
}

// Check server connection
async function checkServerConnection() {
    try {
        const response = await fetch(`${API_BASE_URL}/`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

// Utility function to get URL parameters
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
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