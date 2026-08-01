from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.identity.models.identity_health import IdentityHealthStatus


class IdentityHealthCalculateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    inputs: Optional[dict] = Field(None)


class IdentityHealthResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    health_score: float
    identity_completeness: float
    verification_status_score: float
    security_score: float
    activity_score: float
    last_checked_at: Optional[datetime]
    status: IdentityHealthStatus
    recommendations: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class IdentityHealthRefreshSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
