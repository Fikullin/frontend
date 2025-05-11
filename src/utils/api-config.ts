// Base URL API
export const API_BASE_URL = 'http://localhost:5000';

// Endpoint API
// Tambahkan ini ke file api-config.ts yang sudah ada
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
      EXPORT: `${API_BASE_URL}/api/recipient/export-excel`,
    },
    FINANCE: {
      LIST: `${API_BASE_URL}/api/finance`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/finance/${id}`,
      CREATE: `${API_BASE_URL}/api/finance`,
      UPDATE: (id: string) => `${API_BASE_URL}/api/finance/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/api/finance/${id}`,
      SUMMARY: `${API_BASE_URL}/api/finance/summary`
    },   
    ADMIN: {
      LIST: `${API_BASE_URL}/api/admin/users`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
      CREATE: `${API_BASE_URL}/api/auth/signup`,
      UPDATE: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
      EXPORT: `${API_BASE_URL}/api/admin/export/admin`
    },
    ADMIN_DETAILS: {
      LIST: `${API_BASE_URL}/api/admin-details`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/admin-details/${id}`,
      UPDATE: (id: string) => `${API_BASE_URL}/api/admin-details/${id}`
    },
    REPORTS: {
      PRINT: `${API_BASE_URL}/api/admin/report/print`
    },
    INFO_BEASISWA: {
      LIST: `${API_BASE_URL}/api/info-beasiswa`,
      DETAIL: (id: string) => `${API_BASE_URL}/api/info-beasiswa/${id}`,
      CREATE: `${API_BASE_URL}/api/info-beasiswa`,
      UPDATE: (id: string) => `${API_BASE_URL}/api/info-beasiswa/${id}`,
      DELETE: (id: string) => `${API_BASE_URL}/api/info-beasiswa/${id}`,
    },
    HOME_EDIT_HEADER: {
      GET_TEXTS: `${API_BASE_URL}/api/admin/home-header-texts`,
      UPDATE_TEXTS: `${API_BASE_URL}/api/admin/home-header-texts`,
    },
    HOME_EDIT_SECTION1: {
      GET_SECTION: `${API_BASE_URL}/api/admin/home-edit-section1`,
      UPDATE_SECTION: `${API_BASE_URL}/api/admin/home-edit-section1`,
    },
    HOME_EDIT_SECTIONTEXT: {
      GET_SECTION: `${API_BASE_URL}/api/admin/home-edit-sectiontext`,
      UPDATE_SECTION: `${API_BASE_URL}/api/admin/home-edit-sectiontext`,
    }
  }
};

export default API_ENDPOINTS;