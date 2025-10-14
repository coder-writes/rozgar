// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Profile endpoints
  PROFILE: `${API_BASE_URL}/api/profile`,
  PROFILE_BY_EMAIL: (email: string) => `${API_BASE_URL}/api/profile/${email}`,
  PROFILE_RESUME: (email: string) => `${API_BASE_URL}/api/profile/resume/${email}`,
};

export default API_BASE_URL;
