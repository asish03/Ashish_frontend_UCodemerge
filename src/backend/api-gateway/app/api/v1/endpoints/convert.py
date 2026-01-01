"""
Language conversion endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.core.database import get_db
from app.core.security import require_developer
from app.models.user import User
from app.schemas.job import ConversionRequest, JobResponse, JobStatus

router = APIRouter()


@router.post("/analyze")
async def analyze_conversion(
    request: ConversionRequest,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze code conversion complexity and feasibility
    
    Supported conversions:
    - JavaScript ↔ TypeScript
    - Python ↔ JavaScript
    - React ↔ Vue ↔ Angular
    - REST ↔ GraphQL
    - Legacy (COBOL, C++) → Modern (Java, Python)
    """
    # Mock analysis result
    job_id = str(uuid.uuid4())
    
    complexity_map = {
        ("JavaScript", "TypeScript"): "low",
        ("TypeScript", "JavaScript"): "low",
        ("Python", "JavaScript"): "medium",
        ("JavaScript", "Python"): "medium",
        ("COBOL", "Java"): "high",
        ("C++", "Python"): "high",
    }
    
    key = (request.source_language, request.target_language)
    complexity = complexity_map.get(key, "medium")
    
    estimated_time = {
        "low": "2-5 seconds",
        "medium": "30-60 seconds",
        "high": "5-10 minutes"
    }.get(complexity, "unknown")
    
    return {
        "job_id": job_id,
        "source_language": request.source_language,
        "target_language": request.target_language,
        "complexity": complexity,
        "estimated_time": estimated_time,
        "feasibility": 95.5,
        "warnings": [] if complexity != "high" else [
            "Legacy language conversion may require manual review",
            "Some constructs may not have direct equivalents"
        ],
        "recommendations": [
            "Review converted code for accuracy",
            "Run automated tests after conversion",
            "Use guided mode for complex conversions"
        ]
    }


@router.post("/execute", response_model=JobResponse)
async def execute_conversion(
    request: ConversionRequest,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Execute code conversion
    
    Converts code from source language to target language
    """
    job_id = str(uuid.uuid4())
    
    # Create job
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "conversion",
        "status": JobStatus.RUNNING.value,
        "progress_percentage": 0,
        "input_data": {
            "source_language": request.source_language,
            "target_language": request.target_language,
            "code": request.code[:100] + "..." if request.code and len(request.code) > 100 else request.code,
            "project_id": request.project_id
        },
        "output_data": None,
        "error_message": None,
        "started_at": "2024-12-14T10:00:00Z",
        "completed_at": None,
        "duration_ms": None,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/status/{job_id}", response_model=JobResponse)
async def get_conversion_status(
    job_id: str,
    current_user: User = Depends(require_developer),
    db: AsyncSession = Depends(get_db)
):
    """
    Get conversion job status
    """
    # Mock completed conversion
    job_data = {
        "id": job_id,
        "user_id": str(current_user.id),
        "type": "conversion",
        "status": JobStatus.COMPLETED.value,
        "progress_percentage": 100,
        "input_data": {
            "source_language": "JavaScript",
            "target_language": "TypeScript"
        },
        "output_data": {
            "converted_code": "function sum(a: number, b: number): number { return a + b; }",
            "confidence": 98.5,
            "stats": {
                "lines_converted": 142,
                "functions_mapped": 23,
                "type_annotations_added": 56,
                "warnings": 2
            }
        },
        "error_message": None,
        "started_at": "2024-12-14T10:00:00Z",
        "completed_at": "2024-12-14T10:00:05Z",
        "duration_ms": 5000,
        "created_at": "2024-12-14T10:00:00Z"
    }
    
    return JobResponse(**job_data)


@router.get("/languages")
async def get_supported_languages(
    current_user: User = Depends(require_developer)
):
    """
    Get list of supported languages and conversion pairs
    """
    return {
        "languages": [
            "JavaScript",
            "TypeScript",
            "Python",
            "Go",
            "Java",
            "C++",
            "C#",
            "Ruby",
            "PHP",
            "Swift",
            "Kotlin",
            "Rust",
            "COBOL"  # Legacy support
        ],
        "frameworks": [
            {"name": "React", "language": "JavaScript/TypeScript"},
            {"name": "Vue", "language": "JavaScript/TypeScript"},
            {"name": "Angular", "language": "TypeScript"},
            {"name": "FastAPI", "language": "Python"},
            {"name": "Django", "language": "Python"},
            {"name": "Express", "language": "JavaScript/TypeScript"},
            {"name": "Gin", "language": "Go"},
            {"name": "Spring Boot", "language": "Java"}
        ],
        "conversion_pairs": [
            {"from": "JavaScript", "to": "TypeScript", "complexity": "low"},
            {"from": "TypeScript", "to": "JavaScript", "complexity": "low"},
            {"from": "Python", "to": "JavaScript", "complexity": "medium"},
            {"from": "JavaScript", "to": "Python", "complexity": "medium"},
            {"from": "React", "to": "Vue", "complexity": "medium"},
            {"from": "React", "to": "Angular", "complexity": "high"},
            {"from": "REST", "to": "GraphQL", "complexity": "medium"},
            {"from": "COBOL", "to": "Java", "complexity": "high"},
            {"from": "C++", "to": "Python", "complexity": "high"}
        ]
    }


@router.post("/validate")
async def validate_conversion(
    source_language: str,
    target_language: str,
    current_user: User = Depends(require_developer)
):
    """
    Validate if conversion is supported
    """
    # Simple validation logic
    supported_pairs = [
        ("JavaScript", "TypeScript"),
        ("TypeScript", "JavaScript"),
        ("Python", "JavaScript"),
        ("JavaScript", "Python"),
        ("COBOL", "Java"),
        ("C++", "Python"),
        ("React", "Vue"),
        ("React", "Angular"),
        ("REST", "GraphQL")
    ]
    
    is_supported = (source_language, target_language) in supported_pairs
    
    return {
        "supported": is_supported,
        "source_language": source_language,
        "target_language": target_language,
        "message": "Conversion is supported" if is_supported else "Conversion not currently supported"
    }
