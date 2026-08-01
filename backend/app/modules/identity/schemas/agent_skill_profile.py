from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, constr


class AgentSkillProfileCreateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    skill_name: constr(strip_whitespace=True, min_length=1, max_length=150) = Field(...)
    category: constr(strip_whitespace=True, min_length=1, max_length=100) = Field(...)
    proficiency_level: constr(strip_whitespace=True, min_length=1, max_length=100) = Field(...)
    confidence_score: float = Field(...)
    certified: bool = Field(default=False)
    last_assessed_at: Optional[datetime] = Field(None)
    metadata: Optional[dict] = Field(None)


class AgentSkillProfileUpdateSchema(BaseModel):
    id: uuid.UUID = Field(...)
    skill_name: Optional[constr(strip_whitespace=True, min_length=1, max_length=150)] = Field(None)
    category: Optional[constr(strip_whitespace=True, min_length=1, max_length=100)] = Field(None)
    proficiency_level: Optional[constr(strip_whitespace=True, min_length=1, max_length=100)] = Field(None)
    confidence_score: Optional[float] = Field(None)
    certified: Optional[bool] = Field(None)
    last_assessed_at: Optional[datetime] = Field(None)
    metadata: Optional[dict] = Field(None)


class AgentSkillProfileResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    skill_name: str
    category: str
    proficiency_level: str
    confidence_score: float
    certified: bool
    last_assessed_at: Optional[datetime]
    metadata: Optional[dict]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
