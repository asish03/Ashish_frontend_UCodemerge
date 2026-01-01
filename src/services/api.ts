/**
 * AsembleAI API Client
 * 
 * This service provides methods to interact with the AsembleAI API backend.
 * It handles authentication, request/response formatting, and error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'developer';
  status: string;
  createdAt: string;
  lastActive?: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  user: User;
}

export interface Job {
  id: string;
  userId: string;
  type: string;
  status: string;
  inputData?: any;
  outputData?: any;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
  timestamp?: string;
}

/**
 * Get stored auth token
 */
function getToken(): string | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    return userData.token || null;
  } catch {
    return null;
  }
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      error: 'Unknown Error',
      message: `HTTP ${response.status}: ${response.statusText}`
    }));
    
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

/**
 * Authentication API
 */
export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(email: string, password: string, name: string, role?: string): Promise<LoginResponse> {
    return apiRequest<LoginResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
  },

  async getMe(): Promise<User> {
    return apiRequest<User>('/auth/me');
  },

  async refreshToken(): Promise<{ access_token: string }> {
    return apiRequest<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
    });
  },
};

/**
 * Merge API
 */
export const mergeApi = {
  async upload(data: { source: string; mergeMode: string; files?: any }): Promise<any> {
    return apiRequest('/merge/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async start(projectIds: string[], mergeMode: string): Promise<any> {
    return apiRequest('/merge/start', {
      method: 'POST',
      body: JSON.stringify({ projectIds, mergeMode }),
    });
  },

  async getJobs(params?: { status?: string; limit?: number; offset?: number }): Promise<{ jobs: Job[]; total: number }> {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/merge/jobs${query ? `?${query}` : ''}`);
  },

  async getJob(jobId: string): Promise<Job> {
    return apiRequest(`/merge/jobs/${jobId}`);
  },

  async cancelJob(jobId: string): Promise<{ success: boolean }> {
    return apiRequest(`/merge/jobs/${jobId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Conversion API
 */
export const convertApi = {
  async analyze(sourceCode: string, sourceLanguage: string, targetLanguage: string): Promise<any> {
    return apiRequest('/convert/analyze', {
      method: 'POST',
      body: JSON.stringify({ sourceCode, sourceLanguage, targetLanguage }),
    });
  },

  async execute(jobId: string): Promise<any> {
    return apiRequest('/convert/execute', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
    });
  },

  async getJobs(): Promise<{ jobs: Job[] }> {
    return apiRequest('/convert/jobs');
  },
};

/**
 * AI Integration API
 */
export const aiApi = {
  async getConflicts(jobId: string): Promise<any> {
    return apiRequest(`/ai/conflicts/${jobId}`);
  },

  async resolveConflict(conflictId: string, action: string, customResolution?: string): Promise<any> {
    return apiRequest('/ai/resolve', {
      method: 'POST',
      body: JSON.stringify({ conflictId, action, customResolution }),
    });
  },

  async getSuggestion(code: string, conflictType: string): Promise<any> {
    return apiRequest('/ai/suggest', {
      method: 'POST',
      body: JSON.stringify({ code, conflictType }),
    });
  },
};

/**
 * Analytics API
 */
export const analyticsApi = {
  async getOverview(): Promise<any> {
    return apiRequest('/analytics/overview');
  },

  async getJobs(params?: { timeRange?: string; type?: string; status?: string; limit?: number }): Promise<any> {
    const query = new URLSearchParams(params as any).toString();
    return apiRequest(`/analytics/jobs${query ? `?${query}` : ''}`);
  },

  async getTimeSeries(days?: number): Promise<any> {
    const query = days ? `?days=${days}` : '';
    return apiRequest(`/analytics/timeseries${query}`);
  },

  async getPerformance(): Promise<any> {
    return apiRequest('/analytics/performance');
  },

  async getUserActivity(): Promise<any> {
    return apiRequest('/analytics/users');
  },
};

/**
 * Repository API
 */
export const repositoryApi = {
  async list(): Promise<any> {
    return apiRequest('/repository');
  },

  async connect(url: string, source?: string, branch?: string): Promise<any> {
    return apiRequest('/repository/connect', {
      method: 'POST',
      body: JSON.stringify({ url, source, branch }),
    });
  },

  async import(repositoryId: string, branch?: string): Promise<any> {
    return apiRequest('/repository/import', {
      method: 'POST',
      body: JSON.stringify({ repositoryId, branch }),
    });
  },

  async disconnect(repositoryId: string): Promise<any> {
    return apiRequest(`/repository/${repositoryId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Projects API
 */
export const projectsApi = {
  async list(): Promise<any> {
    return apiRequest('/projects');
  },

  async get(projectId: string): Promise<any> {
    return apiRequest(`/projects/${projectId}`);
  },

  async delete(projectId: string): Promise<any> {
    return apiRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Users API (Owner only)
 */
export const usersApi = {
  async list(): Promise<{ users: User[] }> {
    return apiRequest('/users');
  },

  async create(email: string, name: string, role: string): Promise<User> {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify({ email, name, role }),
    });
  },

  async updateRole(userId: string, role: string): Promise<User> {
    return apiRequest(`/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  async delete(userId: string): Promise<{ success: boolean }> {
    return apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Health check
 */
export async function healthCheck(): Promise<any> {
  const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
  return response.json();
}

export default {
  auth: authApi,
  merge: mergeApi,
  convert: convertApi,
  ai: aiApi,
  analytics: analyticsApi,
  repository: repositoryApi,
  projects: projectsApi,
  users: usersApi,
  healthCheck,
};
