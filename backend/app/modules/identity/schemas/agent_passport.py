from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, constr

from app.modules.identity.models.agent_passport import PassportStatus


class AgentPassportIssueSchema(BaseModel):
    agent_id: uuid.UUID = Field(..., description="UUID of the agent")
    passport_number: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(..., description="Passport number")
    issued_by: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(..., description="Issuer")
    issued_at: Optional[datetime] = Field(None, description="Issue datetime")
    expires_at: Optional[datetime] = Field(None, description="Expiry datetime")
    passport_metadata: Optional[dict] = Field(None, description="Arbitrary passport metadata")


class AgentPassportResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    passport_number: str
    issued_by: str
    issued_at: datetime
    expires_at: Optional[datetime]
    status: PassportStatus
    passport_metadata: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PassportActionSchema(BaseModel):
    passport_number: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(...)


class PassportRenewSchema(BaseModel):
    passport_number: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(...)
    expires_at: datetime = Field(...)
