from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class TrustScoreCalculateSchema(BaseModel):
    agent_id: uuid.UUID = Field(..., description="UUID of the agent to calculate score for")
    inputs: Optional[dict] = Field(None, description="Optional inputs to influence calculation")


class TrustScoreResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    overall_score: float
    identity_score: float
    activity_score: float
    reputation_score: float
    security_score: float
    last_calculated_at: Optional[datetime]
    explanation: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrustScoreRecalculateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
