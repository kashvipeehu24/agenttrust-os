from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.user_service import UserService
from app.modules.identity.schemas.user import UserCreateSchema
from app.modules.identity.models.user import User


router = APIRouter(prefix="/auth", tags=["identity-auth"])


def get_user_service() -> UserService:
    raise NotImplementedError("Provide UserService dependency")


@router.post("/signup", response_model=None)
async def signup(payload: UserCreateSchema, service: UserService = Depends(get_user_service)) -> dict[str, str]:
    user = User(
        full_name=payload.full_name,
        email=payload.email,
        password_hash=payload.password,
        role=payload.role,
        is_active=payload.is_active,
    )
    await service.create_user(user)
    return {"message": "signup successful"}


@router.post("/login", response_model=dict[str, str])
async def login(payload: UserCreateSchema, service: UserService = Depends(get_user_service)) -> dict[str, str]:
    # Authentication logic should be implemented in a separate auth service layer.
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Login is not yet implemented")


@router.post("/logout", response_model=dict[str, str])
async def logout(service: UserService = Depends(get_user_service)) -> dict[str, str]:
    # Logout behavior is application-specific and should be implemented outside repository access.
    return {"message": "logout successful"}