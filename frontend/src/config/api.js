// API Configuration
// Uses environment variables to determine the correct API URL
// In development: uses localhost
// In production: uses the hosted URL on Render

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";

export const API_CONFIG = {
  BASE: API_BASE_URL,
  BASE_URL: API_BASE_URL,
  SOCKET_URL: SOCKET_URL,
  AUTH: `${API_BASE_URL}/auth`,
  CALENDAR: `${API_BASE_URL}/calendar`,
  CALLS: `${API_BASE_URL}/calls`,
  ENV: `${API_BASE_URL}/env`,
  USER: `${API_BASE_URL}/user`,
  CHAT: `${API_BASE_URL}/api/messages`, // 👈 since messages live under /api/messages
};

export default API_CONFIG;
