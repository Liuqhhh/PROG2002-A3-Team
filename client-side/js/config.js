// config.js
const API_CONFIG = {
    BASE_URL: 'https://f3ce1f1f7e196724bc049b8111b70e55.serveo.net/api',
    TIMEOUT: 10000
};


async function callAPI(endpoint, options = {}) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
        
        const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            signal: controller.signal,
            ...options
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
}