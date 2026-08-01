from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, HttpUrl, constr

from app.modules.identity.models.organization import VerificationStatus


class OrganizationCreateSchema(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=150) = Field(..., description="Organization name")
    description: Optional[constr(strip_whitespace=True, max_length=1000)] = Field(
        None, description="Optional organization description"
    )
    industry: Optional[constr(strip_whitespace=True, max_length=100)] = Field(
        None, description="Optional organization industry"
    )
    website: Optional[HttpUrl] = Field(None, description="Organization website URL")
    verification_status: VerificationStatus = Field(
        default=VerificationStatus.PENDING,
        description="Verification status for the organization",
    )
    owner_id: uuid.UUID = Field(..., description="UUID of the organization owner")


class OrganizationUpdateSchema(BaseModel):
    name: Optional[constr(strip_whitespace=True, min_length=1, max_length=150)] = Field(
        None, description="Updated organization name"
    )
    description: Optional[constr(strip_whitespace=True, max_length=1000)] = Field(
        None, description="Updated description"
    )
    industry: Optional[constr(strip_whitespace=True, max_length=100)] = Field(
        None, description="Updated industry"
    )
    website: Optional[HttpUrl] = Field(None, description="Updated website URL")
    verification_status: Optional[VerificationStatus] = Field(
        None, description="Updated verification status"
    )
    owner_id: Optional[uuid.UUID] = Field(None, description="Updated owner UUID")


class OrganizationResponseSchema(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    industry: Optional[str]
    website: Optional[HttpUrl]
    verification_status: VerificationStatus
    owner_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
