# AsembleAI - Universal Code Integration Platform

A comprehensive platform for merging, converting, and integrating code from multiple AI coding tools and repositories.

---

## 🎯 New to AsembleAI?

**👉 Start here: [GETTING_STARTED.md](GETTING_STARTED.md)** - Choose your setup path!

**📚 Need to find something specific? [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Complete documentation map

---

## 📚 Documentation

**Choose your path:**

1. **🚀 [Getting Started Guide](GETTING_STARTED.md)** ⭐ **NEW USERS START HERE!**
   - Choose your setup path (Quick Demo vs Full Setup)
   - Step-by-step instructions for each path
   - Troubleshooting and pro tips

2. **📖 [Complete Integration Guide](COMPLETE_INTEGRATION_GUIDE.md)** 
   - Comprehensive step-by-step installation
   - Every dependency, library, and API key explained
   - Detailed troubleshooting section
   - Production deployment guide

3. **⚡ [Quick Start Guide](QUICK_START.md)**
   - Get running in 5 minutes
   - Frontend-only or full-stack setup
   - Essential steps only

4. **🔑 [Third-Party Services](THIRD_PARTY_SERVICES.md)**
   - All API keys and external services
   - Cost estimates and pricing
   - Setup instructions for each service

5. **📊 [Project Status](PROJECT_STATUS.md)**
   - What's implemented (100% complete!)
   - Feature breakdown by role
   - Technical implementation details

6. **🔧 [Backend Setup](BACKEND_SETUP.md)**
   - Backend architecture details
   - API reference
   - Worker configuration

### 🆕 API Server Documentation (NEW!)

7. **🚀 [API Quick Reference](API_QUICK_REFERENCE.md)** ⭐ **QUICK START!**
   - 4-minute setup guide
   - All endpoints listed
   - Common commands
   - Troubleshooting

8. **📋 [API Setup Summary](API_SETUP_SUMMARY.md)**
   - What was created
   - What you need to do
   - Complete overview
   - Next steps

9. **📝 [API Integration Changelog](API_INTEGRATION_CHANGELOG.md)**
   - All changes made
   - Files created
   - Features implemented
   - Migration guide

10. **💡 [Frontend Integration Examples](FRONTEND_INTEGRATION_EXAMPLE.md)**
    - Code examples
    - Integration patterns
    - Error handling
    - Authentication flow

### 🔗 End-to-End Integration (NEW!)

11. **🔗 [End-to-End Integration Guide](END_TO_END_INTEGRATION_GUIDE.md)** ⭐ **FULL STACK!**
    - Frontend → Node.js → Python connection
    - 3 integration modes (Mock/Proxy/Hybrid)
    - Complete setup walkthrough
    - Troubleshooting guide

12. **🏗️ [Complete Stack Architecture](COMPLETE_STACK_ARCHITECTURE.md)**
    - Every layer explained
    - Technology stack breakdown
    - Data flow diagrams
    - Port reference

---

## 🚀 Demo Credentials

### Owner Account
- **Email:** owner@asembleai.com
- **Password:** owner123
- **Access:** Full system access including user management and all analytics

### Developer Account
- **Email:** dev@asembleai.com
- **Password:** dev123
- **Access:** All developer features (merge, convert, integrate, import)

---

## 📋 Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Frontend Setup](#frontend-setup)
4. [Backend Setup](#backend-setup)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [RBAC Implementation](#rbac-implementation)
8. [Tech Stack](#tech-stack)
9. [Deployment](#deployment)

---

## ✨ Features

### For Developers

1. **Universal Code Merger**
   - Combine source code from Lovable, Replit, Cursor, V0, Bolt
   - Intelligent conflict detection and resolution
   - AST-level semantic diff analysis
   - Firecracker container isolation

2. **Intelligent Language Converter**
   - JavaScript ↔ TypeScript, Python ↔ JavaScript
   - React ↔ Vue ↔ Angular conversion
   - REST ↔ GraphQL transformation
   - Legacy system modernization (COBOL → Java, C++ → Python)

3. **AI-Assisted Integration**
   - Three merge modes: Quick Auto-Merge, Guided Merge, Manual Merge
   - AI-powered conflict resolution with confidence scores
   - Detailed explanations for each suggestion

4. **Guided Merge Workflow**
   - Step-by-step merge process
   - Human oversight with AI suggestions
   - Accept, reject, or modify each change

5. **Code Import & Repository Integration**
   - GitHub OAuth integration
   - Local file upload (ZIP/folders)
   - Direct URL import
   - Full commit history preservation

6. **Conversion Workflow Phases**
   - Phase 1: Modern language pairs (high frequency)
   - Phase 2: Legacy modernization (enterprise systems)
   - Deterministic rules + AI fallback logic

7. **Merge Process Risk Mitigation**
   - Pre-merge testing in isolated containers
   - Automatic backups before operations
   - Rollback capabilities
   - Quality score calculation

8. **Analytics Dashboard**
   - Real-time operation metrics
   - Performance data visualization
   - Job-level analytics

### For Owners

9. **User Management**
   - Add/remove team members
   - Role assignment (Owner/Developer)
   - Activity monitoring

10. **System Monitoring**
    - Platform-wide analytics
    - Resource utilization
    - Error tracking

---

## 🏗️ Architecture

### High-Level Overview

```
Client (Next.js Frontend)
        ↓
API Gateway (FastAPI + Nginx)
        ↓
Orchestrator (Temporal + Kafka)
        ↓
┌──────────────────────────────────────┐
│  Specialized Agents (Firecracker)   │
│  - Convert Agent                     │
│  - Merge Agent                       │
│  - Test Agent                        │
│  - Quality Agent                     │
└──────────────────────────────────────┘
        ↓
Data Layer (PostgreSQL + S3 + ClickHouse)
```

### Agent-Based System

Each agent handles specific tasks:

- **Convert Agent**: Language/framework conversions using tree-sitter, PyTorch, Triton
- **Merge Agent**: Code merging with GumTree AST diff and custom Go engine
- **Test Agent**: Automated testing in Firecracker containers
- **Quality Agent**: Code quality analysis using Semgrep and security scanning

---

## 💻 Frontend Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/asembleai.git
cd asembleai

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_GITHUB_CLIENT_ID=your_github_client_id
```

---

## 🔧 Backend Setup

### Prerequisites
- Python 3.11+
- Go 1.21+
- Docker
- Kubernetes cluster
- PostgreSQL 15+
- Redis 7+

### Backend Services

#### 1. API Gateway (FastAPI)

```bash
cd backend/api-gateway

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start server
uvicorn main:app --reload --port 8000
```

#### 2. Agent Services (Go + Python)

```bash
# Convert Agent (Python)
cd backend/agents/convert
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py

# Merge Agent (Go)
cd backend/agents/merge
go mod download
go run main.go

# Test Agent (Python)
cd backend/agents/test
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py

# Quality Agent (Python)
cd backend/agents/quality
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python agent.py
```

#### 3. Temporal Workflow

```bash
cd backend/workflows
temporal server start-dev  # Development mode

# In another terminal
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python worker.py
```

#### 4. Kafka Setup

```bash
# Using Docker Compose
docker-compose up -d kafka zookeeper
```

---

## 🗄️ Database Schema

### PostgreSQL Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'developer')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### Projects Table
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(100) NOT NULL,
    language VARCHAR(100),
    framework VARCHAR(100),
    size_bytes BIGINT,
    file_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
```

#### Jobs Table
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('merge', 'conversion', 'import', 'ai-integration')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
    input_data JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
```

#### Conflicts Table
```sql
CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    line_number INTEGER,
    conflict_type VARCHAR(100) NOT NULL,
    ai_suggestion TEXT,
    confidence_score DECIMAL(5,2),
    explanation TEXT,
    resolution VARCHAR(50) CHECK (resolution IN ('accepted', 'rejected', 'modified', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

CREATE INDEX idx_conflicts_job_id ON conflicts(job_id);
CREATE INDEX idx_conflicts_resolution ON conflicts(resolution);
```

#### Backups Table
```sql
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    s3_path VARCHAR(500) NOT NULL,
    size_bytes BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backups_project_id ON backups(project_id);
CREATE INDEX idx_backups_status ON backups(status);
```

#### Analytics Table (ClickHouse)
```sql
CREATE TABLE analytics (
    timestamp DateTime,
    user_id String,
    job_id String,
    job_type String,
    status String,
    duration_ms UInt32,
    file_count UInt16,
    code_size_bytes UInt32,
    error_message String
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, user_id);
```

### Database Migrations

```bash
# Create migration
alembic revision --autogenerate -m "Initial schema"

# Run migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

All API requests require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

#### POST /auth/login
```json
Request:
{
  "email": "dev@asembleai.com",
  "password": "dev123"
}

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "uuid",
    "email": "dev@asembleai.com",
    "name": "Sam Williams",
    "role": "developer"
  }
}
```

#### POST /auth/register
```json
Request:
{
  "email": "new@asembleai.com",
  "password": "password123",
  "name": "New User",
  "role": "developer"
}

Response:
{
  "id": "uuid",
  "email": "new@asembleai.com",
  "name": "New User",
  "role": "developer"
}
```

### Code Merger

#### POST /merge/upload
```json
Request (multipart/form-data):
{
  "files": [File, File],
  "source": "lovable",
  "merge_mode": "guided"
}

Response:
{
  "job_id": "uuid",
  "status": "pending",
  "projects": [
    {
      "id": "uuid",
      "name": "lovable-project",
      "files": 47,
      "size": "2.3 MB"
    }
  ]
}
```

#### POST /merge/start
```json
Request:
{
  "project_ids": ["uuid1", "uuid2"],
  "merge_mode": "guided"
}

Response:
{
  "job_id": "uuid",
  "status": "running",
  "estimated_time": "30s"
}
```

#### GET /merge/status/{job_id}
```json
Response:
{
  "job_id": "uuid",
  "status": "completed",
  "conflicts": [
    {
      "id": "uuid",
      "file": "src/components/Header.tsx",
      "line": 42,
      "type": "Function Signature Mismatch",
      "ai_suggestion": "Use TypeScript union type",
      "confidence": 94
    }
  ]
}
```

### Language Converter

#### POST /convert/analyze
```json
Request:
{
  "source_code": "function sum(a, b) { return a + b; }",
  "source_language": "JavaScript",
  "target_language": "TypeScript"
}

Response:
{
  "job_id": "uuid",
  "complexity": "low",
  "estimated_time": "2s"
}
```

#### POST /convert/execute
```json
Request:
{
  "job_id": "uuid"
}

Response:
{
  "converted_code": "function sum(a: number, b: number): number { return a + b; }",
  "confidence": 98,
  "stats": {
    "lines_converted": 142,
    "functions_mapped": 23,
    "type_annotations": 56
  }
}
```

### Repository Integration

#### POST /repository/github/oauth
```json
Request:
{
  "code": "github_oauth_code"
}

Response:
{
  "access_token": "github_token",
  "repositories": [...]
}
```

#### POST /repository/import
```json
Request:
{
  "source": "github",
  "url": "https://github.com/user/repo",
  "branch": "main"
}

Response:
{
  "job_id": "uuid",
  "status": "importing",
  "project_id": "uuid"
}
```

### AI Integration

#### GET /ai/conflicts/{job_id}
```json
Response:
{
  "conflicts": [
    {
      "id": "uuid",
      "file": "src/utils/api.ts",
      "line": 18,
      "type": "Import Statement Conflict",
      "ai_suggestion": "Merge imports and use named exports",
      "confidence": 98,
      "explanation": "..."
    }
  ]
}
```

#### POST /ai/resolve
```json
Request:
{
  "conflict_id": "uuid",
  "action": "accept" | "reject" | "modify",
  "custom_resolution": "..."
}

Response:
{
  "status": "resolved",
  "applied": true
}
```

### Analytics

#### GET /analytics/overview
```json
Response:
{
  "total_operations": 2847,
  "success_rate": 96.8,
  "avg_processing_time": "4.2s",
  "operations_by_type": {
    "merge": 1247,
    "conversion": 892,
    "import": 456,
    "ai_integration": 252
  }
}
```

#### GET /analytics/jobs
```json
Query Parameters:
?time_range=7d&type=merge&status=completed

Response:
{
  "jobs": [
    {
      "id": "uuid",
      "type": "merge",
      "status": "completed",
      "duration": "3.2s",
      "files": 47,
      "user": "Sarah Chen",
      "created_at": "2024-12-14T10:23:00Z"
    }
  ],
  "total": 147,
  "page": 1
}
```

### User Management (Owner Only)

#### GET /users
```json
Response:
{
  "users": [
    {
      "id": "uuid",
      "email": "dev@asembleai.com",
      "name": "Sam Williams",
      "role": "developer",
      "status": "active",
      "last_active": "2024-12-14T10:25:00Z"
    }
  ]
}
```

#### POST /users
```json
Request:
{
  "email": "new@asembleai.com",
  "name": "New Developer",
  "role": "developer"
}

Response:
{
  "id": "uuid",
  "email": "new@asembleai.com",
  "name": "New Developer",
  "role": "developer",
  "invitation_sent": true
}
```

#### PUT /users/{user_id}/role
```json
Request:
{
  "role": "owner"
}

Response:
{
  "id": "uuid",
  "role": "owner",
  "updated_at": "2024-12-14T10:30:00Z"
}
```

---

## 🔐 RBAC Implementation

### Role Permissions

#### Owner Role
- Full system access
- User management (add, remove, modify roles)
- View all analytics and reports
- System configuration
- Billing and subscription management
- Access to all developer features

#### Developer Role
- Code merging operations
- Language conversion
- Repository integration
- AI-assisted workflows
- View personal analytics
- No access to user management
- No access to system configuration

### Implementation

#### Backend Middleware (FastAPI)

```python
from functools import wraps
from fastapi import HTTPException, Depends
from typing import List

def require_role(allowed_roles: List[str]):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, current_user=Depends(get_current_user), **kwargs):
            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=403,
                    detail=f"Access denied. Required roles: {allowed_roles}"
                )
            return await func(*args, current_user=current_user, **kwargs)
        return wrapper
    return decorator

# Usage
@app.get("/users")
@require_role(["owner"])
async def get_users(current_user: User):
    return {"users": [...]}
```

#### Frontend Route Protection

```typescript
// Route guard in DashboardLayout
const filteredNavItems = navItems.filter(
  (item) => !item.allowedRoles || item.allowedRoles.includes(user.role)
);
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.0
- **Icons:** Lucide React
- **State Management:** React Hooks + LocalStorage

### Backend Services
- **API Gateway:** FastAPI (Python) + Nginx
- **Agents:** Python 3.11 + Go 1.21
- **Workflow Orchestration:** Temporal
- **Message Queue:** Apache Kafka
- **Container Runtime:** Kubernetes + Firecracker microVMs

### AI/ML Components
- **Parser:** tree-sitter, Babel, libclang, Roslyn, Spoon
- **Model:** PyTorch LLM
- **Inference:** NVIDIA Triton Inference Server
- **AST Diff:** GumTree

### Data Storage
- **Database:** PostgreSQL 15 (metadata)
- **Object Storage:** AWS S3 (artifacts, backups)
- **Analytics:** ClickHouse (time-series data)
- **Cache:** Redis 7

### Observability
- **Monitoring:** Prometheus
- **Visualization:** Grafana
- **Tracing:** Jaeger + OpenTelemetry
- **Logging:** Loki

### Testing & Quality
- **Testing:** pytest (Python), Jest (JavaScript), JUnit (Java)
- **Code Quality:** Semgrep
- **Security:** OWASP dependency check

---

## 🚀 Deployment

### Docker Compose (Development)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: asembleai
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  kafka:
    image: confluentinc/cp-kafka:latest
    environment:
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
    ports:
      - "9092:9092"

  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  api-gateway:
    build: ./backend/api-gateway
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/asembleai
      REDIS_URL: redis://redis:6379
      KAFKA_BROKER: kafka:9092
    depends_on:
      - postgres
      - redis
      - kafka
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-gateway
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-gateway
  template:
    metadata:
      labels:
        app: api-gateway
    spec:
      containers:
      - name: api-gateway
        image: asembleai/api-gateway:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
```

### Environment Variables

```bash
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/asembleai
REDIS_URL=redis://localhost:6379
KAFKA_BROKER=localhost:9092
S3_BUCKET=asembleai-artifacts
AWS_REGION=us-east-1
JWT_SECRET=your-secret-key
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI/ML
TRITON_URL=http://localhost:8001
MODEL_PATH=/models/code-conversion
GPU_ENABLED=true

# Observability
PROMETHEUS_URL=http://localhost:9090
JAEGER_AGENT_HOST=localhost
JAEGER_AGENT_PORT=6831
```

---

## 📝 Development Workflow

1. **Start Database:** `docker-compose up postgres redis`
2. **Run Migrations:** `alembic upgrade head`
3. **Start Backend:** `uvicorn main:app --reload`
4. **Start Temporal:** `temporal server start-dev`
5. **Start Frontend:** `npm run dev`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/ -v --cov=app
```

### Frontend Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

---

## 📊 Monitoring

Access monitoring dashboards:

- **Grafana:** http://localhost:3000
- **Prometheus:** http://localhost:9090
- **Jaeger UI:** http://localhost:16686

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🆘 Support

For support, email support@asembleai.com or open an issue on GitHub.

---

## 🔄 Future Roadmap

- [ ] Real-time collaboration features
- [ ] VS Code extension
- [ ] CLI tool
- [ ] Self-hosted deployment option
- [ ] Additional language pairs
- [ ] Advanced AI model fine-tuning
- [ ] Team workspaces
- [ ] Advanced analytics dashboard

---

**AsembleAI** - Unifying the code universe, one merge at a time.