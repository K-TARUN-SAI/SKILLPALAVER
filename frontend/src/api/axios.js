import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // console.log("DEBUG: Attaching token to request:", config.url); 
        } else {
            console.warn("DEBUG: No token found in localStorage for request:", config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
