from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, constr

from app.modules.identity.models.agent_permission import AgentPermissionType


class AgentPermissionCreateSchema(BaseModel):
    agent_id: uuid.UUID = Field(..., description="UUID of the associated agent")
    granted_by_id: uuid.UUID = Field(..., description="UUID of the user granting permission")
    permission: AgentPermissionType = Field(..., description="Permission type assigned to the agent")
    resource: constr(strip_whitespace=True, min_length=1, max_length=150) = Field(
        ..., description="Resource for which permission is granted"
    )


class AgentPermissionUpdateSchema(BaseModel):
    permission: Optional[AgentPermissionType] = Field(None, description="Updated permission type")
    resource: Optional[constr(strip_whitespace=True, min_length=1, max_length=150)] = Field(
        None, description="Updated resource"
    )


class AgentPermissionResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    granted_by_id: uuid.UUID
    permission: AgentPermissionType
    resource: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
