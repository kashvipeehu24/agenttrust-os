from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OrganizationTrustCalculateSchema(BaseModel):
    organization_id: uuid.UUID = Field(..., description="Organization UUID")
    base_trust_score: float = Field(..., ge=0.0, le=100.0)
    inheritance_weight: Optional[float] = Field(1.0, ge=0.0)


class OrganizationTrustRecalculateSchema(BaseModel):
    organization_id: uuid.UUID = Field(..., description="Organization UUID")


class OrganizationTrustResponseSchema(BaseModel):
    id: uuid.UUID
    organization_id: uuid.UUID
    base_trust_score: float
    inherited_trust_score: float
    inheritance_weight: float
    child_agent_count: int
    verified_agent_count: int
    last_calculated_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
