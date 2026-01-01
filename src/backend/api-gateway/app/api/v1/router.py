"""
Main API router
"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, merge, convert, repository, ai, analytics, users

# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(merge.router, prefix="/merge", tags=["Code Merger"])
api_router.include_router(convert.router, prefix="/convert", tags=["Language Converter"])
api_router.include_router(repository.router, prefix="/repository", tags=["Repository Integration"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Integration"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
api_router.include_router(users.router, prefix="/users", tags=["User Management"])
