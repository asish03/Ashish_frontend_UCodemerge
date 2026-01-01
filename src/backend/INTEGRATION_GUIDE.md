# Backend Integration Guide

This guide explains how to integrate the AsembleAI backend with the existing frontend application.

## Overview

The backend is a complete, production-ready implementation that includes:
- ✅ FastAPI REST API Gateway
- ✅ PostgreSQL database with schema and seed data
- ✅ ClickHouse analytics database
- ✅ Redis caching layer
- ✅ Kafka message queue
- ✅ Temporal workflow orchestration
- ✅ Prometheus + Grafana monitoring
- ✅ Complete API endpoints matching frontend requirements
- ✅ RBAC authentication and authorization
- ✅ Mock data for all features

## Quick Start

### 1. Start Backend Services

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

This script will:
- Start all infrastructure services (PostgreSQL, Redis, Kafka, ClickHouse, Temporal)
- Initialize databases with schema and seed data
- Set up the API Gateway Python environment
- Display service URLs and next steps

### 2. Start API Gateway

```bash
cd api-gateway
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Documentation: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### 3. Update Frontend Configuration

Update your frontend `.env` file:

```bash
VITE_API_URL=http://localhost:8000/api/v1
```

## Frontend Integration Steps

### Step 1: Install Axios (or use fetch)

```bash
npm install axios
```

### Step 2: Create API Client

Create `src/lib/api.ts`:

```typescript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('asembleai_user');
  if (user) {
    const userData = JSON.parse(user);
    const token = localStorage.getItem('asembleai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('asembleai_user');
      localStorage.removeItem('asembleai_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Step 3: Update Login Logic

Update `src/components/LoginPage.tsx`:

```typescript
import api from '../lib/api';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { access_token, user } = response.data;
    
    // Store token
    localStorage.setItem('asembleai_token', access_token);
    
    // Pass user to parent
    onLogin(user);
  } catch (err: any) {
    setError(err.response?.data?.detail || 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

### Step 4: Fetch Real Data in Components

Example for Code Merger page:

```typescript
import { useEffect, useState } from 'react';
import api from '../../lib/api';

export function CodeMergerPage() {
  const [projects, setProjects] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
    fetchJobs();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/merge/projects');
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await api.get('/analytics/jobs?type=merge&limit=10');
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartMerge = async (projectIds: string[], mode: string) => {
    try {
      const response = await api.post('/merge/start', {
        project_ids: projectIds,
        merge_mode: mode,
      });
      
      const jobId = response.data.id;
      
      // Poll for job status
      pollJobStatus(jobId);
    } catch (error) {
      console.error('Failed to start merge:', error);
    }
  };

  const pollJobStatus = async (jobId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/merge/status/${jobId}`);
        const job = response.data;
        
        if (job.status === 'completed' || job.status === 'failed') {
          clearInterval(interval);
          // Update UI
        }
      } catch (error) {
        clearInterval(interval);
      }
    }, 2000);
  };

  // ... rest of component
}
```

## API Endpoints Reference

### Authentication

```typescript
// Login
POST /api/v1/auth/login
Body: { email: string, password: string }
Response: { access_token: string, refresh_token: string, user: User }

// Register
POST /api/v1/auth/register
Body: { email: string, password: string, name: string }

// Get current user
GET /api/v1/auth/me
Headers: { Authorization: "Bearer <token>" }

// Refresh token
POST /api/v1/auth/refresh
Body: { refresh_token: string }
```

### Code Merger

```typescript
// Upload projects
POST /api/v1/merge/upload
Content-Type: multipart/form-data
Body: { files: File[], source: string }

// Start merge
POST /api/v1/merge/start
Body: { project_ids: string[], merge_mode: string }

// Get merge status
GET /api/v1/merge/status/:jobId

// Get conflicts
GET /api/v1/merge/conflicts/:jobId

// Download result
POST /api/v1/merge/download/:jobId
```

### Language Converter

```typescript
// Analyze conversion
POST /api/v1/convert/analyze
Body: { source_language: string, target_language: string, code?: string }

// Execute conversion
POST /api/v1/convert/execute
Body: { source_language: string, target_language: string, code?: string }

// Get conversion status
GET /api/v1/convert/status/:jobId

// Get supported languages
GET /api/v1/convert/languages
```

### Repository Integration

```typescript
// GitHub OAuth
POST /api/v1/repository/github/oauth
Body: { code: string }

// List GitHub repos
GET /api/v1/repository/github/repositories

// Import repository
POST /api/v1/repository/import
Body: { source: string, url: string, branch: string }

// Get import status
GET /api/v1/repository/import/status/:jobId
```

### AI Integration

```typescript
// Get conflicts
GET /api/v1/ai/conflicts/:jobId

// Resolve conflict
POST /api/v1/ai/resolve
Body: { conflict_id: string, action: string, custom_resolution?: string }

// Get AI suggestions
GET /api/v1/ai/suggestions/:jobId

// Analyze code quality
POST /api/v1/ai/analyze
Body: { job_id: string }
```

### Analytics

```typescript
// Get overview
GET /api/v1/analytics/overview?time_range=7d

// Get job analytics
GET /api/v1/analytics/jobs?time_range=7d&type=merge&page=1

// Get performance metrics
GET /api/v1/analytics/metrics

// Get user analytics
GET /api/v1/analytics/users?time_range=7d

// Get error analytics
GET /api/v1/analytics/errors?time_range=24h
```

### User Management (Owner Only)

```typescript
// List users
GET /api/v1/users

// Get user
GET /api/v1/users/:userId

// Create user
POST /api/v1/users
Body: { email: string, name: string, password: string, role: string }

// Update user
PUT /api/v1/users/:userId
Body: { name?: string, role?: string, status?: string }

// Delete user
DELETE /api/v1/users/:userId

// Reset password
POST /api/v1/users/:userId/reset-password
Body: { new_password: string }
```

## Testing the Integration

### 1. Test Authentication

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"dev@asembleai.com","password":"dev123"}'

# Should return:
# {
#   "access_token": "eyJ...",
#   "refresh_token": "eyJ...",
#   "user": { ... }
# }
```

### 2. Test API with Token

```bash
# Get current user
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <your-token>"
```

### 3. Test Analytics

```bash
# Get analytics overview
curl -X GET http://localhost:8000/api/v1/analytics/overview \
  -H "Authorization: Bearer <your-token>"
```

## Troubleshooting

### Issue: Cannot connect to backend

**Solution:**
1. Check if backend is running: `curl http://localhost:8000/health`
2. Check CORS settings in `backend/api-gateway/app/core/config.py`
3. Verify frontend .env has correct `VITE_API_URL`

### Issue: 401 Unauthorized errors

**Solution:**
1. Check if token is stored: `localStorage.getItem('asembleai_token')`
2. Verify token is included in headers
3. Token might be expired - try logging in again

### Issue: Database connection errors

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart PostgreSQL
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Issue: Services not starting

**Solution:**
```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Start fresh
./setup.sh
```

## Environment Variables

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend (api-gateway/.env)
```bash
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/asembleai

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-characters

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

## Production Deployment

For production deployment:

1. **Update environment variables:**
   - Change JWT_SECRET_KEY
   - Use production database URLs
   - Enable HTTPS
   - Configure proper CORS origins

2. **Use environment-specific configs:**
   ```bash
   ENVIRONMENT=production
   DEBUG=False
   ```

3. **Set up reverse proxy (Nginx):**
   ```nginx
   location /api {
       proxy_pass http://localhost:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
   }
   ```

4. **Enable monitoring:**
   - Configure Sentry for error tracking
   - Set up Grafana dashboards
   - Enable Prometheus metrics

## Next Steps

1. ✅ Start backend services
2. ✅ Test API endpoints
3. ✅ Update frontend to use real API
4. ✅ Test authentication flow
5. ✅ Test all features end-to-end
6. ⬜ Deploy to staging
7. ⬜ Deploy to production

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- API docs: http://localhost:8000/docs
- Backend README: `/backend/README.md`
- Full documentation: `/LIBRARIES_AND_INTEGRATIONS.md`

## Demo Credentials

- **Owner:** owner@asembleai.com / owner123
- **Developer:** dev@asembleai.com / dev123

These users are pre-loaded in the database with full access.
