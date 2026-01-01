"""
User management endpoints (Owner only)
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
import uuid

from app.core.database import get_db
from app.core.security import require_owner, get_password_hash
from app.models.user import User
from app.schemas.auth import UserResponse

router = APIRouter()


@router.get("", response_model=List[UserResponse])
async def list_users(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    List all users (Owner only)
    """
    result = await db.execute(select(User).order_by(User.created_at.desc()))
    users = result.scalars().all()
    
    return [UserResponse(**user.to_dict()) for user in users]


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user by ID (Owner only)
    """
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(**user.to_dict())


@router.post("", response_model=UserResponse)
async def create_user(
    email: str,
    name: str,
    password: str,
    role: str = "developer",
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Create new user (Owner only)
    """
    # Check if email already exists
    result = await db.execute(select(User).where(User.email == email))
    existing_user = result.scalar_one_or_none()
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Validate role
    if role not in ["owner", "developer"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role. Must be 'owner' or 'developer'"
        )
    
    # Create user
    new_user = User(
        email=email,
        password_hash=get_password_hash(password),
        name=name,
        role=role,
        status="active"
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return UserResponse(**new_user.to_dict())


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    name: str = None,
    role: str = None,
    status: str = None,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Update user (Owner only)
    """
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent owner from changing their own role/status
    if str(user.id) == str(current_user.id):
        if role and role != user.role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change your own role"
            )
        if status and status != user.status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cannot change your own status"
            )
    
    # Update fields
    if name:
        user.name = name
    if role:
        if role not in ["owner", "developer"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid role"
            )
        user.role = role
    if status:
        if status not in ["active", "inactive", "suspended"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status"
            )
        user.status = status
    
    await db.commit()
    await db.refresh(user)
    
    return UserResponse(**user.to_dict())


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Delete user (Owner only)
    """
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Prevent owner from deleting themselves
    if str(user.id) == str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )
    
    # Delete user
    await db.delete(user)
    await db.commit()
    
    return {
        "message": f"User {user.email} deleted successfully"
    }


@router.get("/stats/overview")
async def get_user_stats(
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Get user statistics (Owner only)
    """
    # In production, query database for real stats
    return {
        "total_users": 5,
        "active_users": 4,
        "inactive_users": 1,
        "by_role": {
            "owner": 1,
            "developer": 4
        },
        "recent_signups_7d": 2,
        "recent_logins_24h": 3,
        "avg_operations_per_user": 569
    }


@router.post("/{user_id}/reset-password")
async def reset_user_password(
    user_id: str,
    new_password: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Reset user password (Owner only)
    """
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update password
    user.password_hash = get_password_hash(new_password)
    await db.commit()
    
    return {
        "message": f"Password reset successfully for {user.email}"
    }


@router.post("/{user_id}/send-invitation")
async def send_invitation(
    user_id: str,
    current_user: User = Depends(require_owner),
    db: AsyncSession = Depends(get_db)
):
    """
    Send invitation email to user (Owner only)
    """
    # Get user
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # In production, send actual email
    return {
        "message": f"Invitation sent to {user.email}",
        "email": user.email
    }
