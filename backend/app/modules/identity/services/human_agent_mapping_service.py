from __future__ import annotations

import uuid
from datetime import datetime
from typing import List, Optional

from app.modules.identity.models.human_agent_mapping import HumanAgentMapping, MappingStatus
from app.modules.identity.repositories.human_agent_mapping_repository import HumanAgentMappingRepository


class HumanAgentMappingService:
    def __init__(self, repository: HumanAgentMappingRepository) -> None:
        self.repository = repository

    async def link_agent(self, mapping: HumanAgentMapping) -> HumanAgentMapping:
        mapping.linked_at = mapping.linked_at or datetime.utcnow()
        mapping.status = MappingStatus.ACTIVE
        return await self.repository.create(mapping)

    async def unlink_agent(self, mapping_id: uuid.UUID) -> None:
        mapping = await self.repository.get_by_id(mapping_id)
        if not mapping:
            raise ValueError("mapping not found")
        await self.repository.delete(mapping)

    async def list_agents_for_user(self, human_user_id: uuid.UUID) -> List[HumanAgentMapping]:
        return await self.repository.list_by_user(human_user_id)

    async def list_users_for_agent(self, agent_id: uuid.UUID) -> List[HumanAgentMapping]:
        return await self.repository.list_by_agent(agent_id)

    async def update_permissions(self, mapping_id: uuid.UUID, permissions: dict) -> HumanAgentMapping:
        mapping = await self.repository.get_by_id(mapping_id)
        if not mapping:
            raise ValueError("mapping not found")
        mapping.permissions = permissions
        mapping.last_updated = datetime.utcnow()
        return await self.repository.update(mapping, permissions=permissions, last_updated=mapping.last_updated)
