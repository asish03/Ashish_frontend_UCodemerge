"""
Repository integration endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.core.security import require_developer
from app.models.user import User
from app.schemas.job import ImportRequest, JobResponse, JobStatus

router = APIRouter()


@router.post("/github/oauth")
async def github_oauth_callback(
    code: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Handle GitHub OAuth callback
    
    Exchange authorization code for access token
    """
    # In production, exchange code with GitHub
    # POST https://github.com/login/oauth/access_token
    
    return {
        "access_token": "gho_mock_github_token_" + code[:10],
        "token_type": "bearer",
        "scope": "repo,user",
        "message": "Successfully connected to GitHub"
    }


@router.get("/github/repositories")
async def list_github_repositories(
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    List user's GitHub repositories
    
    Requires GitHub OAuth connection
    """
    # Mock repositories
    repositories = [
        {
            "id": "repo-1",
            "name": "my-awesome-app",
            "full_name": "user/my-awesome-app",
            "description": "An awesome application",
            "language": "TypeScript",
            "stars": 123,
            "forks": 45,
            "is_private": False,
            "default_branch": "main",
            "url": "https://github.com/user/my-awesome-app"
        },
        {
            "id": "repo-2",
            "name": "backend-api",
            "full_name": "user/backend-api",
            "description": "RESTful API backend",
            "language": "Python",
            "stars": 67,
            "forks": 23,
            "is_private": False,
            "default_branch": "main",
            "url": "https://github.com/user/backend-api"
        },
        {
            "id": "repo-3",
            "name": "private-project",
            "full_name": "user/private-project",
            "description": "Private company project",
            "language": "Go",
            "stars": 0,
            "forks": 0,
            "is_private": True,
            "default_branch": "develop",
            "url": "https://github.com/user/private-project"
        }
    ]
    
    return {
        "repositories": repositories,
        "total": len(repositories)
    }


@router.post("/import", response_model=JobResponse)
async def import_repository(
    request: ImportRequest,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Import repository from GitHub, GitLab, or URL
    
    Supports:
    - GitHub: https://github.com/user/repo
    - GitLab: https://gitlab.com/user/repo
    - Direct URL: https://example.com/code.zip
    - Local upload: handled by /merge/upload endpoint
    """
    job_id = str(uuid.uuid4())
    
    # Validate URL if provided
    if request.source in ["github", "gitlab"] and not request.url:
        raise HTTPException(
            status_code=400,
            detail="URL is required for GitHub/GitLab imports"
        )
    
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "import",
        "status": JobStatus.RUNNING.value,
        "progress_percentage": 0,
        "input_data": {
            "source": request.source,
            "url": request.url,
            "branch": request.branch,
            "config": request.config
        },
        "output_data": None,
        "error_message": None,
        "started_at": "2024-12-14T10:00:00Z",
        "completed_at": None,
        "duration_ms": None,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/import/status/{job_id}", response_model=JobResponse)
async def get_import_status(
    job_id: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get repository import status
    """
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "import",
        "status": JobStatus.COMPLETED.value,
        "progress_percentage": 100,
        "input_data": {
            "source": "github",
            "url": "https://github.com/user/repo",
            "branch": "main"
        },
        "output_data": {
            "project_id": str(uuid.uuid4()),
            "files_imported": 123,
            "total_size_bytes": 8900000,
            "languages_detected": ["TypeScript", "JavaScript", "CSS"],
            "frameworks_detected": ["React", "Next.js"],
            "commit_history_preserved": True,
            "latest_commit": "abc123def456"
        },
        "error_message": None,
        "started_at": "2024-12-14T10:00:00Z",
        "completed_at": "2024-12-14T10:05:00Z",
        "duration_ms": 300000,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/sources")
async def get_supported_sources(
    current_user: User = Depends(require_developer)
):
    """
    Get list of supported import sources
    """
    return {
        "sources": [
            {
                "id": "github",
                "name": "GitHub",
                "description": "Import from GitHub repositories",
                "requires_auth": True,
                "supported": True
            },
            {
                "id": "gitlab",
                "name": "GitLab",
                "description": "Import from GitLab repositories",
                "requires_auth": True,
                "supported": True
            },
            {
                "id": "local",
                "name": "Local Upload",
                "description": "Upload ZIP or TAR files",
                "requires_auth": False,
                "supported": True
            },
            {
                "id": "url",
                "name": "Direct URL",
                "description": "Import from direct download URL",
                "requires_auth": False,
                "supported": True
            },
            {
                "id": "bitbucket",
                "name": "Bitbucket",
                "description": "Import from Bitbucket repositories",
                "requires_auth": True,
                "supported": False
            }
        ]
    }


@router.delete("/disconnect/github")
async def disconnect_github(
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Disconnect GitHub OAuth connection
    """
    # In production, revoke OAuth token
    return {
        "message": "Successfully disconnected from GitHub"
    }
