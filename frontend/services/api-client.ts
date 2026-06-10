import axios from 'axios';

// Full backend base URL — set per environment via NEXT_PUBLIC_API_URL:
//   Dev (.env.local):        http://localhost:8000
//   Prod (Vercel monorepo):  https://your-project.vercel.app/_/backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token automatically
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('bucms_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Centralized error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standard error details extract
    const message = error.response?.data?.detail || error.response?.data?.message || 'Something went wrong. Please try again.';
    
    // Auto logout on 401 Unauthorized (invalid/expired JWT token)
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('bucms_token');
      localStorage.removeItem('bucms_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    return Promise.reject(new Error(message));
  }
);
export default apiClient;
