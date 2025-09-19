import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration - but NOT for login/signup routes
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only redirect on 401 for protected routes, not login/signup
        if (error.response?.status === 401) {
            const isAuthRoute = error.config?.url?.includes('/auth/login') ||
                error.config?.url?.includes('/auth/signup');

            if (!isAuthRoute) {
                // Only clear storage and redirect if it's not a login/signup attempt
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
