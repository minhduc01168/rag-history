// Safely resolve API base URL across Vite and Jest/Node environments
const getApiBaseUrl = (): string => {
  try {
    // Vite runtime
    // @ts-ignore
    if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
      // @ts-ignore
      return import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api/v1';
    }
  } catch {
    // Ignore error in environments where import.meta is not available
  }
  // Node / Jest fallback
  if (typeof process !== 'undefined' && process.env) {
    return process.env.VITE_API_URL || process.env.VITE_API_BASE_URL || '/api/v1';
  }
  return '/api/v1';
};

export const API_BASE_URL = getApiBaseUrl();

