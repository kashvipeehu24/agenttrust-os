from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, constr

from app.modules.identity.models.agent_did import AgentDIDStatus


class AgentDIDCreateSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    method: Optional[str] = Field("example", description="DID method")
    public_key: Optional[str] = Field(None)
    document_url: Optional[str] = Field(None)
    verification_method: Optional[str] = Field("key-1")
    controller: Optional[str] = Field(None)


class AgentDIDResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    did: str
    method: str
    public_key: str
    document_url: Optional[str]
    verification_method: str
    controller: str
    status: AgentDIDStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AgentDIDRotateSchema(BaseModel):
    did: constr(strip_whitespace=True, min_length=1)
    new_public_key: constr(strip_whitespace=True, min_length=1)


class AgentDIDActionSchema(BaseModel):
    did: constr(strip_whitespace=True, min_length=1)
