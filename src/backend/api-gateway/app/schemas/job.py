"""
Job schemas
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum


class JobType(str, Enum):
    """Job types"""
    MERGE = "merge"
    CONVERSION = "conversion"
    IMPORT = "import"
    AI_INTEGRATION = "ai-integration"
    TEST = "test"
    QUALITY = "quality"


class JobStatus(str, Enum):
    """Job status"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class JobCreate(BaseModel):
    """Create job request"""
    type: JobType
    input_data: Dict[str, Any]
    config: Optional[Dict[str, Any]] = {}
    priority: int = Field(default=0, ge=0, le=10)


class JobResponse(BaseModel):
    """Job response"""
    id: str
    user_id: str
    type: str
    status: str
    progress_percentage: int
    input_data: Optional[Dict[str, Any]] = None
    output_data: Optional[Dict[str, Any]] = None
    error_message: Optional[str] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    duration_ms: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class MergeRequest(BaseModel):
    """Merge job request"""
    project_ids: List[str]
    merge_mode: str = Field(default="guided", pattern="^(auto|guided|manual)$")
    config: Optional[Dict[str, Any]] = {}


class ConversionRequest(BaseModel):
    """Conversion job request"""
    source_language: str
    target_language: str
    code: Optional[str] = None
    project_id: Optional[str] = None
    config: Optional[Dict[str, Any]] = {}


class ImportRequest(BaseModel):
    """Import job request"""
    source: str = Field(..., pattern="^(github|gitlab|local|url)$")
    url: Optional[str] = None
    branch: Optional[str] = "main"
    config: Optional[Dict[str, Any]] = {}


class JobListResponse(BaseModel):
    """Job list response"""
    jobs: List[JobResponse]
    total: int
    page: int
    page_size: int
