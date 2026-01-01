"""
Analytics and observability endpoints
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid

from app.core.database import get_db
from app.core.security import require_developer
from app.models.user import User

router = APIRouter()


@router.get("/overview")
async def get_analytics_overview(
    time_range: str = Query(default="7d", regex="^(24h|7d|30d|90d|1y)$"),
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get analytics overview
    
    Time ranges: 24h, 7d, 30d, 90d, 1y
    """
    return {
        "time_range": time_range,
        "metrics": {
            "total_operations": 2847,
            "success_rate": 96.8,
            "avg_processing_time_seconds": 4.2,
            "failed_operations": 92,
            "operations_change_percent": 18.5
        },
        "operations_by_type": {
            "merge": {
                "count": 1247,
                "percentage": 44,
                "avg_duration_ms": 4200,
                "success_rate": 98.2
            },
            "conversion": {
                "count": 892,
                "percentage": 31,
                "avg_duration_ms": 5800,
                "success_rate": 96.5
            },
            "import": {
                "count": 456,
                "percentage": 16,
                "avg_duration_ms": 3200,
                "success_rate": 99.1
            },
            "ai-integration": {
                "count": 252,
                "percentage": 9,
                "avg_duration_ms": 1200,
                "success_rate": 94.8
            }
        },
        "trends": {
            "daily_operations": [
                {"date": "2024-12-07", "count": 387},
                {"date": "2024-12-08", "count": 412},
                {"date": "2024-12-09", "count": 398},
                {"date": "2024-12-10", "count": 456},
                {"date": "2024-12-11", "count": 423},
                {"date": "2024-12-12", "count": 389},
                {"date": "2024-12-13", "count": 401},
                {"date": "2024-12-14", "count": 134}  # Partial day
            ],
            "hourly_distribution": [
                {"hour": 0, "count": 45},
                {"hour": 1, "count": 23},
                {"hour": 2, "count": 12},
                {"hour": 3, "count": 8},
                {"hour": 4, "count": 15},
                {"hour": 5, "count": 34},
                {"hour": 6, "count": 67},
                {"hour": 7, "count": 98},
                {"hour": 8, "count": 156},
                {"hour": 9, "count": 189},
                {"hour": 10, "count": 234},
                {"hour": 11, "count": 198},
                {"hour": 12, "count": 167},
                {"hour": 13, "count": 178},
                {"hour": 14, "count": 203},
                {"hour": 15, "count": 212},
                {"hour": 16, "count": 189},
                {"hour": 17, "count": 156},
                {"hour": 18, "count": 134},
                {"hour": 19, "count": 98},
                {"hour": 20, "count": 87},
                {"hour": 21, "count": 76},
                {"hour": 22, "count": 65},
                {"hour": 23, "count": 54}
            ]
        }
    }


@router.get("/jobs")
async def get_job_analytics(
    time_range: str = Query(default="7d"),
    job_type: Optional[str] = None,
    status: Optional[str] = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get detailed job analytics with filtering
    """
    # Mock job data
    jobs = []
    for i in range(min(page_size, 20)):
        jobs.append({
            "id": f"job-{str(uuid.uuid4())[:8]}",
            "type": job_type or ["merge", "conversion", "import", "ai-integration"][i % 4],
            "status": status or ["completed", "failed"][i % 10],
            "start_time": f"2024-12-14T{10 + i % 14:02d}:{i * 3 % 60:02d}:00Z",
            "duration_seconds": 3.2 + (i * 0.5),
            "files_processed": 47 + (i * 3),
            "user_email": current_user.email,
            "confidence_score": 94.5 + (i % 5) if (i % 10) != 9 else None
        })
    
    return {
        "jobs": jobs,
        "total": 147,
        "page": page,
        "page_size": page_size,
        "total_pages": 8,
        "filters": {
            "time_range": time_range,
            "type": job_type,
            "status": status
        }
    }


@router.get("/metrics")
async def get_performance_metrics(
    service: Optional[str] = None,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get system performance metrics
    """
    return {
        "timestamp": "2024-12-14T10:30:00Z",
        "services": [
            {
                "name": "api-gateway",
                "status": "healthy",
                "cpu_usage_percent": 23.5,
                "memory_usage_percent": 45.2,
                "requests_per_second": 124.8,
                "avg_response_time_ms": 87,
                "error_rate_percent": 0.3
            },
            {
                "name": "convert-agent",
                "status": "healthy",
                "cpu_usage_percent": 67.3,
                "memory_usage_percent": 72.1,
                "jobs_processing": 3,
                "avg_processing_time_ms": 5800,
                "success_rate_percent": 96.5
            },
            {
                "name": "merge-agent",
                "status": "healthy",
                "cpu_usage_percent": 54.2,
                "memory_usage_percent": 61.8,
                "jobs_processing": 2,
                "avg_processing_time_ms": 4200,
                "success_rate_percent": 98.2
            },
            {
                "name": "temporal-worker",
                "status": "healthy",
                "cpu_usage_percent": 12.8,
                "memory_usage_percent": 28.4,
                "active_workflows": 5,
                "completed_workflows": 2847,
                "failed_workflows": 92
            },
            {
                "name": "postgresql",
                "status": "healthy",
                "connections_active": 15,
                "connections_max": 100,
                "query_avg_time_ms": 12.3,
                "cache_hit_ratio": 98.7
            },
            {
                "name": "redis",
                "status": "healthy",
                "memory_used_mb": 234,
                "memory_max_mb": 2048,
                "ops_per_second": 1567,
                "cache_hit_rate": 94.5
            }
        ],
        "overall": {
            "status": "healthy",
            "uptime_hours": 720,
            "total_requests_24h": 45678,
            "error_rate_24h": 0.4,
            "avg_latency_ms": 95
        }
    }


@router.get("/users")
async def get_user_analytics(
    time_range: str = Query(default="7d"),
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user activity analytics
    """
    return {
        "time_range": time_range,
        "total_users": 125,
        "active_users": 87,
        "new_users": 12,
        "user_activity": [
            {
                "user_id": str(uuid.uuid4()),
                "email": "sarah.chen@asembleai.com",
                "name": "Sarah Chen",
                "role": "developer",
                "total_operations": 234,
                "last_active": "2024-12-14T10:25:00Z",
                "most_used_feature": "merge",
                "success_rate": 97.8
            },
            {
                "user_id": str(uuid.uuid4()),
                "email": "mike.johnson@asembleai.com",
                "name": "Mike Johnson",
                "role": "developer",
                "total_operations": 198,
                "last_active": "2024-12-14T09:45:00Z",
                "most_used_feature": "conversion",
                "success_rate": 96.2
            },
            {
                "user_id": str(uuid.uuid4()),
                "email": "emma.davis@asembleai.com",
                "name": "Emma Davis",
                "role": "developer",
                "total_operations": 156,
                "last_active": "2024-12-13T16:30:00Z",
                "most_used_feature": "import",
                "success_rate": 98.9
            }
        ],
        "engagement_metrics": {
            "daily_active_users": 45,
            "weekly_active_users": 87,
            "monthly_active_users": 125,
            "avg_operations_per_user": 22.8,
            "avg_session_duration_minutes": 34.5
        }
    }


@router.get("/errors")
async def get_error_analytics(
    time_range: str = Query(default="24h"),
    severity: Optional[str] = None,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get error analytics and logs
    """
    return {
        "time_range": time_range,
        "total_errors": 92,
        "by_severity": {
            "critical": 2,
            "high": 12,
            "medium": 34,
            "low": 44
        },
        "by_service": {
            "api-gateway": 23,
            "convert-agent": 34,
            "merge-agent": 18,
            "test-agent": 12,
            "temporal-worker": 5
        },
        "top_errors": [
            {
                "error_type": "ConversionError",
                "message": "Unsupported syntax in legacy code",
                "count": 23,
                "first_seen": "2024-12-13T08:00:00Z",
                "last_seen": "2024-12-14T09:30:00Z",
                "affected_users": 8
            },
            {
                "error_type": "MergeConflictError",
                "message": "Unable to automatically resolve conflict",
                "count": 18,
                "first_seen": "2024-12-13T12:00:00Z",
                "last_seen": "2024-12-14T10:00:00Z",
                "affected_users": 12
            }
        ],
        "recent_errors": [
            {
                "id": str(uuid.uuid4()),
                "timestamp": "2024-12-14T10:15:00Z",
                "severity": "medium",
                "service": "convert-agent",
                "error_type": "TimeoutError",
                "message": "Conversion timeout after 60 seconds",
                "user_id": str(uuid.uuid4()),
                "job_id": str(uuid.uuid4())
            }
        ]
    }


@router.get("/export")
async def export_analytics(
    time_range: str = Query(default="30d"),
    format: str = Query(default="json", regex="^(json|csv|xlsx)$"),
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Export analytics data
    
    Formats: json, csv, xlsx
    """
    # In production, generate file and return download URL
    return {
        "download_url": f"https://s3.amazonaws.com/asembleai-exports/analytics-{time_range}.{format}?signature=...",
        "expires_in": 3600,
        "file_size_bytes": 1245678,
        "format": format,
        "time_range": time_range
    }
