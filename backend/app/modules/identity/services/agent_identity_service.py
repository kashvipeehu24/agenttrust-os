from __future__ import annotations

import uuid
from typing import Any, Optional

from app.modules.identity.models.agent_identity import AgentIdentity
from app.modules.identity.repositories.agent_identity_repository import AgentIdentityRepository


class AgentIdentityService:
    def __init__(self, repository: AgentIdentityRepository) -> None:
        self.repository = repository

    async def create_identity(self, identity: AgentIdentity) -> AgentIdentity:
        return await self.repository.create(identity)

    async def get_identity_by_id(self, identity_id: uuid.UUID) -> Optional[AgentIdentity]:
        return await self.repository.get_by_id(identity_id)

    async def list_identities(self) -> list[AgentIdentity]:
        return await self.repository.get_all()

    async def update_identity(self, identity: AgentIdentity, **values: Any) -> AgentIdentity:
        return await self.repository.update(identity, **values)

    async def delete_identity(self, identity: AgentIdentity) -> None:
        await self.repository.delete(identity)
