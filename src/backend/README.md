# AsembleAI Backend

Complete backend implementation for the AsembleAI code integration platform.

## Architecture

```
backend/
├── api-gateway/          # FastAPI REST API
├── agents/               # Specialized worker agents
│   ├── convert/         # Language conversion agent
│   ├── merge/           # Code merging agent
│   ├── test/            # Testing agent
│   └── quality/         # Quality analysis agent
├── workflows/           # Temporal workflow orchestration
├── database/            # Database schemas and migrations
├── shared/              # Shared utilities and models
├── docker-compose.yml   # Local development setup
└── README.md           # This file
```

## Quick Start

### 1. Start Infrastructure Services

```bash
cd backend
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- Kafka + Zookeeper (port 9092)
- ClickHouse (port 8123)
- Temporal Server (port 7233)

### 2. Initialize Databases

```bash
# PostgreSQL
cd database
psql -U postgres -h localhost -f schema.sql

# ClickHouse
clickhouse-client --host localhost --query "$(cat clickhouse_schema.sql)"
```

### 3. Start API Gateway

```bash
cd api-gateway
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Access API documentation: http://localhost:8000/docs

### 4. Start Agent Services

```bash
# Terminal 1 - Convert Agent
cd agents/convert
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py

# Terminal 2 - Merge Agent
cd agents/merge
go mod download
go run main.go

# Terminal 3 - Test Agent
cd agents/test
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py

# Terminal 4 - Quality Agent
cd agents/quality
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py
```

### 5. Start Temporal Workers

```bash
cd workflows
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python worker.py
```

## Environment Variables

Copy `.env.example` to `.env` and update:

```bash
cp api-gateway/.env.example api-gateway/.env
```

## API Endpoints

### Authentication
- POST `/api/v1/auth/login` - User login
- POST `/api/v1/auth/register` - User registration
- POST `/api/v1/auth/refresh` - Refresh token

### Code Merger
- POST `/api/v1/merge/upload` - Upload projects
- POST `/api/v1/merge/start` - Start merge operation
- GET `/api/v1/merge/status/{job_id}` - Get merge status

### Language Converter
- POST `/api/v1/convert/analyze` - Analyze conversion
- POST `/api/v1/convert/execute` - Execute conversion
- GET `/api/v1/convert/status/{job_id}` - Get conversion status

### Repository Integration
- POST `/api/v1/repository/github/oauth` - GitHub OAuth
- POST `/api/v1/repository/import` - Import repository
- GET `/api/v1/repository/list` - List repositories

### AI Integration
- GET `/api/v1/ai/conflicts/{job_id}` - Get conflicts
- POST `/api/v1/ai/resolve` - Resolve conflict
- GET `/api/v1/ai/suggestions/{job_id}` - Get AI suggestions

### Analytics
- GET `/api/v1/analytics/overview` - System overview
- GET `/api/v1/analytics/jobs` - Job analytics
- GET `/api/v1/analytics/metrics` - Performance metrics

### User Management (Owner only)
- GET `/api/v1/users` - List users
- POST `/api/v1/users` - Create user
- PUT `/api/v1/users/{user_id}` - Update user
- DELETE `/api/v1/users/{user_id}` - Delete user

## Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v
```

## Production Deployment

See `DEPLOYMENT.md` for production deployment instructions.

## Troubleshooting

See `TROUBLESHOOTING.md` for common issues and solutions.
