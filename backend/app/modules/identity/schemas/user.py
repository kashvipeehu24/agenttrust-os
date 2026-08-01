from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, constr

from app.modules.identity.models.user import UserRole


class UserCreateSchema(BaseModel):
    full_name: constr(strip_whitespace=True, min_length=1, max_length=150) = Field(
        ..., description="User full name"
    )
    email: EmailStr = Field(..., description="User email address")
    password: constr(min_length=8, max_length=128) = Field(
        ..., description="Plain text password for account creation"
    )
    role: UserRole = Field(default=UserRole.USER, description="Assigned user role")
    is_active: bool = Field(default=True, description="Whether the user is active")


class UserUpdateSchema(BaseModel):
    full_name: Optional[constr(strip_whitespace=True, min_length=1, max_length=150)] = Field(
        None, description="Updated full name"
    )
    email: Optional[EmailStr] = Field(None, description="Updated email address")
    password: Optional[constr(min_length=8, max_length=128)] = Field(
        None, description="Optional new password"
    )
    role: Optional[UserRole] = Field(None, description="Updated user role")
    is_active: Optional[bool] = Field(None, description="Updated active status")


class UserResponseSchema(BaseModel):
    id: uuid.UUID
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
