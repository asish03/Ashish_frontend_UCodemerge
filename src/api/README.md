# AsembleAI API Server

Lightweight Node.js/Express API server for AsembleAI frontend.

## Quick Start

### 1. Install Dependencies
```bash
cd api
npm install
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your settings (or use defaults)
nano .env
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login with email/password
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token

### Merge Operations
- `POST /api/v1/merge/upload` - Upload projects
- `POST /api/v1/merge/start` - Start merge
- `GET /api/v1/merge/jobs` - List jobs
- `GET /api/v1/merge/jobs/:jobId` - Get job details
- `DELETE /api/v1/merge/jobs/:jobId` - Cancel job

### Code Conversion
- `POST /api/v1/convert/analyze` - Analyze code
- `POST /api/v1/convert/execute` - Execute conversion
- `GET /api/v1/convert/jobs` - List conversion jobs

### AI Integration
- `GET /api/v1/ai/conflicts/:jobId` - Get conflicts
- `POST /api/v1/ai/resolve` - Resolve conflict
- `POST /api/v1/ai/suggest` - Get AI suggestion

### Analytics
- `GET /api/v1/analytics/overview` - Overview stats
- `GET /api/v1/analytics/jobs` - Job analytics
- `GET /api/v1/analytics/timeseries` - Time-series data
- `GET /api/v1/analytics/performance` - Performance metrics
- `GET /api/v1/analytics/users` - User activity (Owner only)

### Repository Integration
- `GET /api/v1/repository` - List repositories
- `POST /api/v1/repository/connect` - Connect repository
- `POST /api/v1/repository/import` - Import repository
- `DELETE /api/v1/repository/:id` - Disconnect

### Projects
- `GET /api/v1/projects` - List projects
- `GET /api/v1/projects/:id` - Get project
- `DELETE /api/v1/projects/:id` - Delete project

### User Management (Owner only)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id/role` - Update role
- `DELETE /api/v1/users/:id` - Delete user

## Demo Credentials

**Owner Account:**
- Email: owner@asembleai.com
- Password: owner123

**Developer Account:**
- Email: dev@asembleai.com
- Password: dev123

## Logs

Logs are written to `/api/logs/`:
- `access.log` - HTTP access logs
- `requests.log` - Request tracking
- `errors.log` - Error logs

## Features

- ✅ JWT Authentication
- ✅ Role-based access control (Owner/Developer)
- ✅ Request logging
- ✅ Error handling
- ✅ CORS enabled
- ✅ Mock data for testing
- ✅ RESTful API design

## Environment Variables

See `.env.example` for all available options.

## Production Deployment

For production:
1. Change `JWT_SECRET` to a strong secret
2. Set `NODE_ENV=production`
3. Configure proper CORS origins
4. Use a process manager (PM2, systemd)
5. Set up reverse proxy (nginx)
6. Enable HTTPS

## License

MIT
