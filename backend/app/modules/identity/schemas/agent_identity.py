from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional, Annotated

from pydantic import BaseModel, ConfigDict, Field

from app.modules.identity.models.agent_identity import AgentIdentityType


class AgentIdentityCreateSchema(BaseModel):
    agent_id: uuid.UUID = Field(..., description="UUID of the associated agent")
    identity_type: AgentIdentityType = Field(..., description="Type of the agent identity")
    identifier: Annotated[
    str,
    Field(
        strip_whitespace=True,
        min_length=1,
        max_length=255,
        description="Identifier for the agent identity",
    ),
]


class AgentIdentityUpdateSchema(BaseModel):
    identity_type: Optional[AgentIdentityType] = Field(
        None, description="Updated identity type"
    )
    identifier: Optional[
    Annotated[
        str,
        Field(
            strip_whitespace=True,
            min_length=1,
            max_length=255,
            description="Updated identifier",
        ),
    ]
] = None


class AgentIdentityResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    identity_type: AgentIdentityType
    identifier: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
