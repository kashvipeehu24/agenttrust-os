from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.identity.models.trust_explanation import RiskLevel


class TrustExplanationGenerateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    trust_score_id: Optional[uuid.UUID] = Field(None)
    # Accept trust score payload as a mapping of components
    trust_score: dict = Field(...)


class TrustExplanationResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    trust_score_id: Optional[uuid.UUID]
    overall_score: float
    confidence_score: float
    risk_level: RiskLevel
    explanation_summary: Optional[str]
    positive_factors: Optional[dict]
    negative_factors: Optional[dict]
    recommendations: Optional[dict]
    generated_at: datetime
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TrustExplanationListSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
