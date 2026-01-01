/**
 * Proxy Middleware
 * Forwards requests to Python FastAPI backend
 */

import fetch from 'node-fetch';
import { backendConfig } from '../config/backend.js';

/**
 * Create proxy middleware for forwarding requests to Python backend
 */
export const createProxyMiddleware = (options = {}) => {
  const targetUrl = options.target || backendConfig.pythonBackendUrl;
  
  return async (req, res, next) => {
    try {
      // Build target URL
      const url = `${targetUrl}${req.originalUrl}`;
      
      // Forward headers (except host)
      const headers = { ...req.headers };
      delete headers.host;
      delete headers['content-length'];
      
      // Make request to Python backend
      const response = await fetch(url, {
        method: req.method,
        headers,
        body: ['POST', 'PUT', 'PATCH'].includes(req.method) 
          ? JSON.stringify(req.body) 
          : undefined,
        timeout: backendConfig.timeout,
      });
      
      // Get response data
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      // Forward response
      res.status(response.status);
      
      // Copy response headers
      response.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });
      
      // Send response
      if (typeof data === 'string') {
        res.send(data);
      } else {
        res.json(data);
      }
      
    } catch (error) {
      console.error('Proxy error:', error);
      
      // If Python backend is down, fallback to next middleware (mock data)
      if (backendConfig.mode === 'hybrid') {
        console.log('Python backend unavailable, using mock data');
        next();
      } else {
        res.status(502).json({
          error: 'Bad Gateway',
          message: 'Python backend unavailable',
          details: error.message
        });
      }
    }
  };
};

/**
 * Health check for Python backend
 */
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(
      `${backendConfig.pythonBackendUrl}/health`,
      { timeout: 5000 }
    );
    
    if (response.ok) {
      const data = await response.json();
      return {
        healthy: true,
        status: data.status,
        environment: data.environment,
        version: data.version
      };
    }
    
    return {
      healthy: false,
      error: `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
};
