/**
 * Backend Integration Configuration
 * 
 * This file configures how the Node.js API integrates with the Python FastAPI backend.
 * 
 * MODES:
 * - 'mock': Use mock data (default for development)
 * - 'proxy': Proxy requests to Python backend
 * - 'hybrid': Use mock for some, proxy for others
 */

export const backendConfig = {
  // Integration mode
  mode: process.env.BACKEND_MODE || 'mock', // 'mock' | 'proxy' | 'hybrid'
  
  // Python FastAPI backend URL
  pythonBackendUrl: process.env.PYTHON_BACKEND_URL || 'http://localhost:8000',
  
  // Which endpoints to proxy (when mode is 'hybrid')
  proxyEndpoints: [
    // Uncomment to proxy specific endpoints to Python backend
    // '/api/v1/merge/*',
    // '/api/v1/convert/*',
    // '/api/v1/ai/*',
  ],
  
  // Timeout for backend requests (ms)
  timeout: parseInt(process.env.BACKEND_TIMEOUT) || 30000,
  
  // Retry configuration
  retry: {
    enabled: process.env.BACKEND_RETRY_ENABLED === 'true',
    maxRetries: parseInt(process.env.BACKEND_MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.BACKEND_RETRY_DELAY) || 1000,
  },
  
  // Health check
  healthCheck: {
    enabled: true,
    interval: 60000, // 1 minute
    endpoint: '/health'
  }
};

/**
 * Check if endpoint should be proxied
 */
export function shouldProxy(path) {
  if (backendConfig.mode === 'mock') return false;
  if (backendConfig.mode === 'proxy') return true;
  
  // Hybrid mode - check if path matches proxy patterns
  return backendConfig.proxyEndpoints.some(pattern => {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return regex.test(path);
  });
}

export default backendConfig;
