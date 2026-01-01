"""
Code merger endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid
import json

from app.core.database import get_db
from app.core.security import get_current_user, require_developer
from app.models.user import User
from app.schemas.job import MergeRequest, JobResponse, JobStatus

router = APIRouter()


@router.post("/upload")
async def upload_projects(
    files: List[UploadFile] = File(...),
    source: str = Form(...),
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload project files for merging
    
    Accepts ZIP files or individual code files
    """
    uploaded_projects = []
    
    for file in files:
        # In production, save to S3 and create project record
        project_id = str(uuid.uuid4())
        
        # Mock project data
        project = {
            "id": project_id,
            "name": file.filename.replace(".zip", ""),
            "source": source,
            "size": f"{file.size / 1024 / 1024:.1f} MB" if file.size else "0 MB",
            "files": 47,  # Mock
            "language": "TypeScript"  # Mock - would be detected
        }
        
        uploaded_projects.append(project)
    
    return {
        "message": f"Successfully uploaded {len(files)} project(s)",
        "projects": uploaded_projects
    }


@router.post("/start", response_model=JobResponse)
async def start_merge(
    request: MergeRequest,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Start code merge operation
    
    Merge modes:
    - auto: Fully automated merge
    - guided: AI-assisted with human review
    - manual: Manual conflict resolution
    """
    # Create job record
    job_id = str(uuid.uuid4())
    
    # In production, this would:
    # 1. Create job in database
    # 2. Send message to Kafka
    # 3. Start Temporal workflow
    # 4. Return job ID for status polling
    
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "merge",
        "status": JobStatus.RUNNING.value,
        "progress_percentage": 0,
        "input_data": {
            "project_ids": request.project_ids,
            "merge_mode": request.merge_mode,
            "config": request.config
        },
        "output_data": None,
        "error_message": None,
        "started_at": None,
        "completed_at": None,
        "duration_ms": None,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/status/{job_id}", response_model=JobResponse)
async def get_merge_status(
    job_id: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get merge job status
    
    Returns current status, progress, and conflicts if any
    """
    # In production, fetch from database
    # Mock response
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "merge",
        "status": JobStatus.COMPLETED.value,
        "progress_percentage": 100,
        "input_data": {
            "project_ids": ["proj-1", "proj-2"],
            "merge_mode": "guided"
        },
        "output_data": {
            "conflicts_resolved": 12,
            "files_merged": 136,
            "output_path": "s3://asembleai-artifacts/merged/merge-001.zip"
        },
        "error_message": None,
        "started_at": "2024-12-14T10:00:00Z",
        "completed_at": "2024-12-14T10:03:00Z",
        "duration_ms": 180000,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/conflicts/{job_id}")
async def get_merge_conflicts(
    job_id: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get conflicts for a merge job
    """
    # In production, fetch from conflicts table
    conflicts = [
        {
            "id": str(uuid.uuid4()),
            "job_id": job_id,
            "file_path": "src/components/Header.tsx",
            "line_number": 42,
            "conflict_type": "Function Signature Mismatch",
            "severity": "medium",
            "ai_suggestion": "Use TypeScript union type: (props: HeaderProps | LegacyProps) => JSX.Element",
            "confidence_score": 94.5,
            "explanation": "Both projects define Header component with different prop types. Merging into a union type maintains backward compatibility.",
            "resolution": "pending"
        },
        {
            "id": str(uuid.uuid4()),
            "job_id": job_id,
            "file_path": "src/utils/api.ts",
            "line_number": 18,
            "conflict_type": "Import Statement Conflict",
            "severity": "low",
            "ai_suggestion": "Merge imports and use named exports",
            "confidence_score": 98.2,
            "explanation": "Both files import different HTTP clients. Recommend consolidating to a single utility module.",
            "resolution": "pending"
        }
    ]
    
    return {"conflicts": conflicts, "total": len(conflicts)}


@router.post("/download/{job_id}")
async def download_merged_project(
    job_id: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get download URL for merged project
    
    Returns a pre-signed S3 URL
    """
    # In production, generate S3 presigned URL
    return {
        "download_url": f"https://s3.amazonaws.com/asembleai-artifacts/merged/{job_id}.zip?signature=...",
        "expires_in": 3600,
        "size_bytes": 7800000,
        "filename": f"merged-project-{job_id}.zip"
    }
