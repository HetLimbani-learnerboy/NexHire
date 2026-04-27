import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
    withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
});

// Response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid, redirect to login
            console.error('Authentication error: Redirecting to login...');
            
            // Avoid redirecting if already on login page
            if (window.location.pathname !== '/login') {
                localStorage.removeItem('demoUser'); // Optional: clear local UI state
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
