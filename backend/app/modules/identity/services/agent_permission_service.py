from __future__ import annotations

import uuid
from typing import Any, Optional

from app.modules.identity.models.agent_permission import AgentPermission
from app.modules.identity.repositories.agent_permission_repository import AgentPermissionRepository


class AgentPermissionService:
    def __init__(self, repository: AgentPermissionRepository) -> None:
        self.repository = repository

    async def create_permission(self, permission: AgentPermission) -> AgentPermission:
        return await self.repository.create(permission)

    async def get_permission_by_id(self, permission_id: uuid.UUID) -> Optional[AgentPermission]:
        return await self.repository.get_by_id(permission_id)

    async def list_permissions(self) -> list[AgentPermission]:
        return await self.repository.get_all()

    async def update_permission(self, permission: AgentPermission, **values: Any) -> AgentPermission:
        return await self.repository.update(permission, **values)

    async def delete_permission(self, permission: AgentPermission) -> None:
        await self.repository.delete(permission)
