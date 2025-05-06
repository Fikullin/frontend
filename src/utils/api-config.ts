// Base URL API
export const API_BASE_URL = 'http://localhost:5000';

// Endpoint API
const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    PROFILE: `${API_BASE_URL}/api/auth/profile`,
  },
  ADMIN: {
    RECIPIENTS: {
      LIST: `${API_BASE_URL}/api/recipient`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/recipient/${id}`,
      CREATE: `${API_BASE_URL}/api/recipient`,
      UPDATE: (id: string) => `${API_BASE_URL}/api/recipient/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/api/recipient/${id}`,
      EXPORT: `${API_BASE_URL}/api/recipient/export`,
    },
  },
};

export default API_ENDPOINTS;