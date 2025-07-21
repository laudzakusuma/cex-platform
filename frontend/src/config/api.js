// API Configuration
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3001',
    wsURL: 'ws://localhost:3001'
  },
  production: {
    baseURL: '', // Same domain in production
    wsURL: `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`
  }
};

const environment = import.meta.env.MODE || 'development';
const config = API_CONFIG[environment];

export const API_BASE_URL = config.baseURL;
export const WS_URL = config.wsURL;

// API endpoints
export const ENDPOINTS = {
  NEWS: '/api/berita',
  COINS: '/api/market/coins',
  CHART: (coinId) => `/api/market/chart/${coinId}`,
  HEALTH: '/api/health'
};

// Helper function to create full URL
export const createApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};

export default {
  API_BASE_URL,
  WS_URL,
  ENDPOINTS,
  createApiUrl
};