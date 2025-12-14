import { Api } from './api-client/client'

// Get base API URL based on environment
export const getApiUrl = (): string => {
  // In production (when running as static export), use relative URLs
  if (process.env.NODE_ENV === 'production') {
    return '';
  }

  // In development, use localhost backend
  return 'http://localhost:5062';
};

export const API_BASE_URL = getApiUrl();

// Create a singleton API instance
export const api = new Api({
  baseUrl: getApiUrl(),
})

// Helper to handle API errors
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>
    if (err.error && typeof err.error === 'object') {
      const innerError = err.error as Record<string, unknown>
      if (innerError.message && typeof innerError.message === 'string') return innerError.message
    }
    if (err.error && typeof err.error === 'string') return err.error
    if (err.message && typeof err.message === 'string') return err.message
  }
  return 'Der opstod en fejl'
}
