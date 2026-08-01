from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class ReputationEventCreateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    event_type: str = Field(..., max_length=100)
    event_title: str = Field(..., max_length=255)
    event_description: Optional[str] = Field(None)
    trust_delta: float = Field(...)
    previous_score: Optional[float] = Field(None)
    new_score: Optional[float] = Field(None)
    event_source: Optional[str] = Field(None)
    metadata: Optional[dict] = Field(None)


class ReputationEventResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    event_type: str
    event_title: str
    event_description: Optional[str]
    trust_delta: float
    previous_score: Optional[float]
    new_score: Optional[float]
    event_source: Optional[str]
    metadata: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
