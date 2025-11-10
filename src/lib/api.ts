import { Api } from './api-client/client'

// Get base API URL based on environment
export const getApiUrl = (): string => {
  // In production (when running as static export), use relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '';
  }

  // In development, use localhost backend
  return 'https://localhost:7122';
};

export const API_BASE_URL = getApiUrl();

// Create a singleton API instance
export const api = new Api({
  baseUrl: getApiUrl(),
  baseApiParams: {
    credentials: 'include', // Important for cookie-based authentication
    headers: {
      'Content-Type': 'application/json',
    },
  },
})

// Helper to handle API errors
export function getErrorMessage(error: any): string {
  if (error?.error?.message) return error.error.message
  if (error?.error) return error.error
  if (error?.message) return error.message
  return 'Der opstod en fejl'
}
