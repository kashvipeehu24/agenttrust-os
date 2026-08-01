from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, constr

from app.modules.identity.models.agent import AgentStatus


class AgentCreateSchema(BaseModel):
    name: constr(strip_whitespace=True, min_length=1, max_length=150) = Field(..., description="Agent display name")
    organization_id: uuid.UUID = Field(..., description="UUID of the owning organization")
    owner_id: uuid.UUID = Field(..., description="UUID of the owning user")
    status: AgentStatus = Field(default=AgentStatus.ACTIVE, description="Initial agent status")
    is_active: bool = Field(default=True, description="Whether the agent is active")


class AgentUpdateSchema(BaseModel):
    name: Optional[constr(strip_whitespace=True, min_length=1, max_length=150)] = Field(
        None, description="Updated agent name"
    )
    organization_id: Optional[uuid.UUID] = Field(None, description="Updated organization UUID")
    owner_id: Optional[uuid.UUID] = Field(None, description="Updated owner UUID")
    status: Optional[AgentStatus] = Field(None, description="Updated agent status")
    is_active: Optional[bool] = Field(None, description="Updated active status")


class AgentResponseSchema(BaseModel):
    id: uuid.UUID
    name: str
    organization_id: uuid.UUID
    owner_id: uuid.UUID
    status: AgentStatus
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
