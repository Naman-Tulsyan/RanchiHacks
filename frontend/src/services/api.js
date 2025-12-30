/**
 * API Service - Axios instance with JWT interceptor
 */
import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (username, password, role) => {
        const response = await api.post('/auth/login', { username, password, role });
        return response.data;
    },
};

// Evidence API
export const evidenceAPI = {
    // Upload new evidence
    upload: async (file, metadata) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('case_id', metadata.case_id);
        formData.append('description', metadata.description);
        formData.append('evidence_type', metadata.evidence_type);
        if (metadata.notes) {
            formData.append('notes', metadata.notes);
        }

        const response = await api.post('/evidence/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // Get all evidence
    list: async () => {
        const response = await api.get('/evidence/');
        return response.data;
    },

    // Get evidence by ID
    get: async (evidenceId) => {
        const response = await api.get(`/evidence/${evidenceId}`);
        return response.data;
    },

    // Log access event
    logAccess: async (evidenceId) => {
        const response = await api.post(`/evidence/${evidenceId}/access`);
        return response.data;
    },

    // Transfer custody
    transfer: async (evidenceId, transferData) => {
        const response = await api.post(`/evidence/${evidenceId}/transfer`, transferData);
        return response.data;
    },

    // Verify integrity
    verify: async (evidenceId) => {
        const response = await api.post(`/evidence/${evidenceId}/verify`);
        return response.data;
    },

    // Get custody history
    getHistory: async (evidenceId) => {
        const response = await api.get(`/evidence/${evidenceId}/history`);
        return response.data;
    },
};

export default api;
