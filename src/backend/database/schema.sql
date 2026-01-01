-- AsembleAI PostgreSQL Database Schema
-- Version: 1.0.0
-- Created: 2024-12-14

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if exist (for clean setup)
DROP TABLE IF EXISTS backups CASCADE;
DROP TABLE IF EXISTS conflicts CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'developer')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Sessions Table (for JWT token management)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Projects Table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    source VARCHAR(100) NOT NULL,
    language VARCHAR(100),
    framework VARCHAR(100),
    size_bytes BIGINT DEFAULT 0,
    file_count INTEGER DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    metadata JSONB DEFAULT '{}',
    s3_path VARCHAR(500),
    git_url VARCHAR(500),
    git_branch VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_source ON projects(source);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at);
CREATE INDEX idx_projects_metadata ON projects USING GIN (metadata);

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('merge', 'conversion', 'import', 'ai-integration', 'test', 'quality')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    priority INTEGER DEFAULT 0,
    input_data JSONB,
    output_data JSONB,
    config JSONB DEFAULT '{}',
    error_message TEXT,
    error_stack TEXT,
    progress_percentage INTEGER DEFAULT 0,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_ms INTEGER,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    temporal_workflow_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_jobs_user_id ON jobs(user_id);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_workflow_id ON jobs(temporal_workflow_id);
CREATE INDEX idx_jobs_input_data ON jobs USING GIN (input_data);
CREATE INDEX idx_jobs_output_data ON jobs USING GIN (output_data);

-- Conflicts Table
CREATE TABLE conflicts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    file_path VARCHAR(500) NOT NULL,
    line_number INTEGER,
    conflict_type VARCHAR(100) NOT NULL,
    severity VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    ai_suggestion TEXT,
    confidence_score DECIMAL(5,2),
    explanation TEXT,
    resolution VARCHAR(50) DEFAULT 'pending' CHECK (resolution IN ('accepted', 'rejected', 'modified', 'pending')),
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_conflicts_job_id ON conflicts(job_id);
CREATE INDEX idx_conflicts_resolution ON conflicts(resolution);
CREATE INDEX idx_conflicts_severity ON conflicts(severity);
CREATE INDEX idx_conflicts_file_path ON conflicts(file_path);

-- Backups Table
CREATE TABLE backups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    s3_path VARCHAR(500) NOT NULL,
    size_bytes BIGINT,
    checksum VARCHAR(64),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    metadata JSONB DEFAULT '{}',
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_backups_project_id ON backups(project_id);
CREATE INDEX idx_backups_job_id ON backups(job_id);
CREATE INDEX idx_backups_status ON backups(status);
CREATE INDEX idx_backups_created_at ON backups(created_at);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW active_jobs AS
SELECT 
    j.id,
    j.type,
    j.status,
    j.progress_percentage,
    j.created_at,
    j.started_at,
    j.duration_ms,
    u.email as user_email,
    u.name as user_name
FROM jobs j
JOIN users u ON j.user_id = u.id
WHERE j.status IN ('pending', 'running');

CREATE VIEW job_statistics AS
SELECT 
    user_id,
    type,
    status,
    COUNT(*) as count,
    AVG(duration_ms) as avg_duration_ms,
    MAX(duration_ms) as max_duration_ms,
    MIN(duration_ms) as min_duration_ms
FROM jobs
WHERE completed_at IS NOT NULL
GROUP BY user_id, type, status;

-- Grant permissions (for application user)
-- Uncomment and modify if you have a specific application user
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO asembleai_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO asembleai_app;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO asembleai_app;

-- Add comments for documentation
COMMENT ON TABLE users IS 'User accounts with RBAC roles';
COMMENT ON TABLE sessions IS 'Active user sessions for JWT token management';
COMMENT ON TABLE projects IS 'Imported code projects from various sources';
COMMENT ON TABLE jobs IS 'Async job tracking for all operations';
COMMENT ON TABLE conflicts IS 'Code merge conflicts detected and AI suggestions';
COMMENT ON TABLE backups IS 'Project backups stored in S3';

COMMENT ON COLUMN users.role IS 'User role: owner (full access) or developer (limited access)';
COMMENT ON COLUMN jobs.temporal_workflow_id IS 'Reference to Temporal workflow execution';
COMMENT ON COLUMN conflicts.confidence_score IS 'AI confidence score (0-100)';
COMMENT ON COLUMN backups.checksum IS 'SHA-256 checksum for integrity verification';
