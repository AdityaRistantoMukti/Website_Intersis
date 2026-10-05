import axios from 'axios';

function resolveApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  // If explicitly configured for production (not localhost)
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl;
  }
  // If running on local network (e.g. smartphone connecting via Wi-Fi IP)
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `http://${window.location.hostname}:3000/api`;
  }
  return envUrl || 'http://localhost:3000/api';
}

export const API_BASE_URL = resolveApiBaseUrl();
export const UPLOAD_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token for admin routes and adjust FormData header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('isa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // When sending FormData, let the browser calculate Content-Type and boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if error is 401 and we are currently on an /admin page that is not /admin/login
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('isa_token');
      localStorage.removeItem('isa_user');
      window.location.href = '/admin/login?session_expired=1';
    }
    return Promise.reject(error);
  }
);

/**
 * Format image URL from backend uploads or external links
 * @param {string} path - Image path from database (e.g. '/uploads/company/about_isa.jpg')
 * @returns {string} Fully resolved image URL
 */
export function getImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  return `${UPLOAD_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}

/**
 * Format human-readable error message from Axios response
 * @param {any} error
 * @returns {string}
 */
export function extractErrorMessage(error) {
  if (!error) return 'Terjadi kesalahan tidak dikenal.';
  if (typeof error === 'string') return error;

  const data = error.response?.data;
  if (data?.message) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return `${data.message}: ${data.errors.map((e) => e.message || e.msg || e).join(', ')}`;
    }
    return data.message;
  }

  if (error.message) return error.message;
  return 'Gagal memproses permintaan ke server.';
}

export default api;
