from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.modules.identity.models.human_agent_mapping import RelationshipType, MappingStatus


class HumanAgentMappingCreateSchema(BaseModel):
    human_user_id: uuid.UUID = Field(...)
    agent_id: uuid.UUID = Field(...)
    relationship_type: RelationshipType = Field(...)
    permissions: Optional[dict] = Field(None)
    ownership_percentage: Optional[float] = Field(None)


class HumanAgentMappingResponseSchema(BaseModel):
    id: uuid.UUID
    human_user_id: uuid.UUID
    agent_id: uuid.UUID
    relationship_type: RelationshipType
    status: MappingStatus
    permissions: Optional[dict]
    ownership_percentage: Optional[float]
    linked_at: datetime
    last_updated: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class HumanAgentMappingPermissionsUpdateSchema(BaseModel):
    mapping_id: uuid.UUID = Field(...)
    permissions: dict = Field(...)
