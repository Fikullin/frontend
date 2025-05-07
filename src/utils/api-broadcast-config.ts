// Broadcast API endpoints
import { API_BASE_URL } from './api-config';

const BROADCAST_API_ENDPOINTS = {
  LIST: `${API_BASE_URL}/api/broadcast`,
  DETAIL: (id: string) => `${API_BASE_URL}/api/broadcast/${id}`,
  CREATE: `${API_BASE_URL}/api/broadcast`,
  SEND: (id: string) => `${API_BASE_URL}/api/broadcast/${id}/send`,
};

export default BROADCAST_API_ENDPOINTS;
