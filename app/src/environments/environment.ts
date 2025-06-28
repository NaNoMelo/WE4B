// Environment configuration for API usage
export const environment = {
  production: false,
  useMockData: true, // Always use mock data - no backend server required
  apiUrl: 'http://localhost:3000/api', // Future backend URL (not currently used)
  mockApiUrl: 'https://virtserver.swaggerhub.com/we4b/WE4B/1.0.0' // Not used when useMockData is true
};
