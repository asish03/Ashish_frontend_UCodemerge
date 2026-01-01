"""
Application configuration
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True
    ENVIRONMENT: str = "development"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/asembleai"
    DATABASE_POOL_SIZE: int = 20
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_ECHO: bool = False
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    REDIS_MAX_CONNECTIONS: int = 50
    CACHE_TTL: int = 3600
    
    # ClickHouse
    CLICKHOUSE_HOST: str = "localhost"
    CLICKHOUSE_PORT: int = 8123
    CLICKHOUSE_DB: str = "asembleai_analytics"
    CLICKHOUSE_USER: str = "default"
    CLICKHOUSE_PASSWORD: str = ""
    
    # Kafka
    KAFKA_BOOTSTRAP_SERVERS: str = "localhost:9092"
    KAFKA_TOPIC_JOBS: str = "asembleai-jobs"
    KAFKA_TOPIC_EVENTS: str = "asembleai-events"
    KAFKA_CONSUMER_GROUP: str = "asembleai-workers"
    
    # AWS
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "us-east-1"
    S3_BUCKET_ARTIFACTS: str = "asembleai-artifacts"
    S3_BUCKET_BACKUPS: str = "asembleai-backups"
    S3_PRESIGNED_URL_EXPIRATION: int = 3600
    
    # Authentication
    JWT_SECRET_KEY: str = "your-super-secret-jwt-key-change-in-production-min-32-chars"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    BCRYPT_ROUNDS: int = 12
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_REDIRECT_URI: str = "http://localhost:5173/auth/github/callback"
    
    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4-turbo-preview"
    OPENAI_MAX_TOKENS: int = 4096
    OPENAI_TEMPERATURE: float = 0.3
    
    # Temporal
    TEMPORAL_HOST: str = "localhost:7233"
    TEMPORAL_NAMESPACE: str = "default"
    TEMPORAL_TASK_QUEUE: str = "asembleai-tasks"
    TEMPORAL_WORKFLOW_TIMEOUT: int = 3600
    
    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    CORS_ALLOW_CREDENTIALS: bool = True
    CORS_ALLOW_METHODS: List[str] = ["*"]
    CORS_ALLOW_HEADERS: List[str] = ["*"]
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 100
    RATE_LIMIT_BURST: int = 20
    
    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 500
    ALLOWED_FILE_EXTENSIONS: str = ".zip,.tar,.gz,.tar.gz,.js,.ts,.tsx,.jsx,.py,.go,.java"
    
    # Monitoring
    SENTRY_DSN: str = ""
    SENTRY_ENVIRONMENT: str = "development"
    SENTRY_TRACES_SAMPLE_RATE: float = 0.1
    PROMETHEUS_PORT: int = 9090
    METRICS_ENABLED: bool = True
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    LOG_FILE: str = "logs/api-gateway.log"
    
    # Service URLs
    CONVERT_AGENT_URL: str = "http://localhost:8001"
    MERGE_AGENT_URL: str = "http://localhost:8002"
    TEST_AGENT_URL: str = "http://localhost:8003"
    QUALITY_AGENT_URL: str = "http://localhost:8004"
    
    # Feature Flags
    ENABLE_AI_FEATURES: bool = True
    ENABLE_GITHUB_INTEGRATION: bool = True
    ENABLE_OPENAI_INTEGRATION: bool = False
    ENABLE_ANALYTICS: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()


# Validate critical settings
def validate_settings():
    """Validate critical settings"""
    errors = []
    
    if len(settings.JWT_SECRET_KEY) < 32:
        errors.append("JWT_SECRET_KEY must be at least 32 characters")
    
    if settings.ENVIRONMENT == "production":
        if "change-in-production" in settings.JWT_SECRET_KEY:
            errors.append("JWT_SECRET_KEY must be changed for production")
        
        if not settings.DATABASE_URL.startswith("postgresql://"):
            errors.append("DATABASE_URL must use PostgreSQL in production")
    
    if errors:
        raise ValueError(f"Configuration errors: {', '.join(errors)}")


# Validate on import
if os.getenv("SKIP_VALIDATION") != "true":
    validate_settings()
