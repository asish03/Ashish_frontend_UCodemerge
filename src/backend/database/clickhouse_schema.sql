-- AsembleAI ClickHouse Analytics Database Schema
-- Version: 1.0.0
-- Created: 2024-12-14

-- Create database
CREATE DATABASE IF NOT EXISTS asembleai_analytics;

USE asembleai_analytics;

-- Analytics Events Table
-- Stores all system events for real-time analytics
CREATE TABLE IF NOT EXISTS analytics_events (
    timestamp DateTime,
    event_id String,
    user_id String,
    user_email String,
    event_type String,
    event_category String,
    metadata String,
    ip_address String,
    user_agent String,
    session_id String,
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, user_id, event_type)
TTL timestamp + INTERVAL 365 DAY;

-- Job Analytics Table
-- Detailed metrics for all job executions
CREATE TABLE IF NOT EXISTS job_analytics (
    timestamp DateTime,
    job_id String,
    user_id String,
    job_type String,
    status String,
    duration_ms UInt32,
    file_count UInt16,
    code_size_bytes UInt32,
    conflicts_count UInt16,
    conflicts_resolved UInt16,
    confidence_score Float32,
    error_message String,
    started_at DateTime,
    completed_at DateTime,
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, user_id, job_type, status)
TTL timestamp + INTERVAL 365 DAY;

-- Performance Metrics Table
-- System performance and resource utilization
CREATE TABLE IF NOT EXISTS performance_metrics (
    timestamp DateTime,
    metric_name String,
    metric_value Float64,
    metric_unit String,
    service_name String,
    host_name String,
    tags Map(String, String),
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, metric_name, service_name)
TTL timestamp + INTERVAL 90 DAY;

-- User Activity Table
-- Track user interactions and feature usage
CREATE TABLE IF NOT EXISTS user_activity (
    timestamp DateTime,
    user_id String,
    action String,
    feature String,
    duration_ms UInt32,
    success UInt8,
    metadata String,
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, user_id, feature)
TTL timestamp + INTERVAL 180 DAY;

-- Error Logs Table
-- Centralized error tracking
CREATE TABLE IF NOT EXISTS error_logs (
    timestamp DateTime,
    error_id String,
    error_type String,
    error_message String,
    error_stack String,
    service_name String,
    user_id String,
    job_id String,
    severity String,
    context String,
    date Date DEFAULT toDate(timestamp)
) ENGINE = MergeTree()
PARTITION BY toYYYYMM(timestamp)
ORDER BY (timestamp, severity, service_name)
TTL timestamp + INTERVAL 90 DAY;

-- Materialized Views for Pre-aggregated Analytics

-- Daily Job Statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS daily_job_stats
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, job_type, status)
AS SELECT
    toDate(timestamp) as date,
    job_type,
    status,
    count() as job_count,
    sum(duration_ms) as total_duration_ms,
    avg(duration_ms) as avg_duration_ms,
    max(duration_ms) as max_duration_ms,
    min(duration_ms) as min_duration_ms,
    sum(file_count) as total_files,
    sum(conflicts_count) as total_conflicts,
    sum(conflicts_resolved) as total_resolved
FROM job_analytics
GROUP BY date, job_type, status;

-- Hourly Performance Summary
CREATE MATERIALIZED VIEW IF NOT EXISTS hourly_performance
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(hour)
ORDER BY (hour, service_name, metric_name)
AS SELECT
    toStartOfHour(timestamp) as hour,
    service_name,
    metric_name,
    avgState(metric_value) as avg_value,
    maxState(metric_value) as max_value,
    minState(metric_value) as min_value,
    countState() as count
FROM performance_metrics
GROUP BY hour, service_name, metric_name;

-- User Engagement Metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS user_engagement
ENGINE = SummingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, user_id)
AS SELECT
    toDate(timestamp) as date,
    user_id,
    feature,
    count() as action_count,
    sum(duration_ms) as total_duration_ms,
    sum(success) as success_count
FROM user_activity
GROUP BY date, user_id, feature;

-- Success Rate by Job Type
CREATE MATERIALIZED VIEW IF NOT EXISTS job_success_rate
ENGINE = AggregatingMergeTree()
PARTITION BY toYYYYMM(date)
ORDER BY (date, job_type)
AS SELECT
    toDate(timestamp) as date,
    job_type,
    countIf(status = 'completed') as completed_count,
    countIf(status = 'failed') as failed_count,
    count() as total_count,
    avgIf(duration_ms, status = 'completed') as avg_success_duration_ms,
    avgIf(confidence_score, status = 'completed') as avg_confidence
FROM job_analytics
GROUP BY date, job_type;

-- Insert sample analytics data
INSERT INTO analytics_events (timestamp, event_id, user_id, user_email, event_type, event_category, metadata, ip_address)
VALUES
    (now() - INTERVAL 1 HOUR, 'evt-001', '22222222-2222-2222-2222-222222222222', 'dev@asembleai.com', 'login', 'auth', '{"device": "desktop"}', '192.168.1.100'),
    (now() - INTERVAL 45 MINUTE, 'evt-002', '22222222-2222-2222-2222-222222222222', 'dev@asembleai.com', 'project_upload', 'project', '{"source": "lovable"}', '192.168.1.100'),
    (now() - INTERVAL 30 MINUTE, 'evt-003', '22222222-2222-2222-2222-222222222222', 'dev@asembleai.com', 'merge_start', 'operation', '{"mode": "guided"}', '192.168.1.100'),
    (now() - INTERVAL 15 MINUTE, 'evt-004', '33333333-3333-3333-3333-333333333333', 'sarah.chen@asembleai.com', 'login', 'auth', '{"device": "mobile"}', '192.168.1.101'),
    (now() - INTERVAL 10 MINUTE, 'evt-005', '33333333-3333-3333-3333-333333333333', 'sarah.chen@asembleai.com', 'conversion_start', 'operation', '{"from": "JS", "to": "TS"}', '192.168.1.101');

INSERT INTO job_analytics (timestamp, job_id, user_id, job_type, status, duration_ms, file_count, code_size_bytes, conflicts_count, conflicts_resolved, confidence_score, started_at, completed_at)
VALUES
    (now() - INTERVAL 2 HOUR, 'job-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'merge', 'completed', 180000, 136, 7800000, 12, 12, 94.5, now() - INTERVAL 2 HOUR, now() - INTERVAL 1 HOUR 57 MINUTE),
    (now() - INTERVAL 5 HOUR, 'job-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'conversion', 'completed', 300000, 56, 3100000, 0, 0, 98.5, now() - INTERVAL 5 HOUR, now() - INTERVAL 4 HOUR 55 MINUTE),
    (now() - INTERVAL 1 DAY, 'job-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', 'import', 'completed', 300000, 123, 8900000, 0, 0, 99.2, now() - INTERVAL 1 DAY, now() - INTERVAL 23 HOUR 55 MINUTE),
    (now() - INTERVAL 3 HOUR, 'job-6666-6666-6666-666666666666', '44444444-4444-4444-4444-444444444444', 'conversion', 'failed', 600000, 0, 0, 5, 0, 45.0, now() - INTERVAL 3 HOUR, now() - INTERVAL 2 HOUR 50 MINUTE);

INSERT INTO performance_metrics (timestamp, metric_name, metric_value, metric_unit, service_name, host_name)
SELECT
    now() - INTERVAL number MINUTE as timestamp,
    arrayElement(['cpu_usage', 'memory_usage', 'disk_io', 'network_throughput'], (number % 4) + 1) as metric_name,
    rand() % 100 as metric_value,
    arrayElement(['percent', 'percent', 'mbps', 'mbps'], (number % 4) + 1) as metric_unit,
    arrayElement(['api-gateway', 'convert-agent', 'merge-agent', 'temporal-worker'], (number % 4) + 1) as service_name,
    'host-01' as host_name
FROM numbers(1000);

INSERT INTO user_activity (timestamp, user_id, action, feature, duration_ms, success)
VALUES
    (now() - INTERVAL 30 MINUTE, '22222222-2222-2222-2222-222222222222', 'view', 'code_merger', 45000, 1),
    (now() - INTERVAL 25 MINUTE, '22222222-2222-2222-2222-222222222222', 'upload', 'code_merger', 12000, 1),
    (now() - INTERVAL 20 MINUTE, '22222222-2222-2222-2222-222222222222', 'merge', 'code_merger', 180000, 1),
    (now() - INTERVAL 15 MINUTE, '33333333-3333-3333-3333-333333333333', 'view', 'language_converter', 30000, 1),
    (now() - INTERVAL 10 MINUTE, '33333333-3333-3333-3333-333333333333', 'convert', 'language_converter', 300000, 1);

-- Create useful queries as functions

-- Get success rate for last N days
CREATE FUNCTION get_success_rate AS (days) -> (
    SELECT
        job_type,
        round(completed_count * 100.0 / total_count, 2) as success_rate_percent,
        total_count
    FROM job_success_rate
    WHERE date >= today() - INTERVAL days DAY
    GROUP BY job_type, completed_count, total_count
    ORDER BY job_type
);

-- Get top active users
CREATE FUNCTION get_top_users AS (days, limit_count) -> (
    SELECT
        user_id,
        count() as action_count,
        uniq(feature) as features_used
    FROM user_activity
    WHERE date >= today() - INTERVAL days DAY
    GROUP BY user_id
    ORDER BY action_count DESC
    LIMIT limit_count
);

-- Get average processing time by job type
CREATE FUNCTION get_avg_processing_time AS (days) -> (
    SELECT
        job_type,
        round(avg(duration_ms) / 1000, 2) as avg_duration_seconds,
        count() as job_count
    FROM job_analytics
    WHERE date >= today() - INTERVAL days DAY
      AND status = 'completed'
    GROUP BY job_type
    ORDER BY avg_duration_seconds DESC
);

-- Verify schema creation
SELECT 'Analytics database created successfully' as status;
SHOW TABLES;
