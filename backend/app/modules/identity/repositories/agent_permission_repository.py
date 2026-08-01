from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent_permission import AgentPermission


class AgentPermissionRepository:
    """Repository for AgentPermission persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, permission: AgentPermission) -> AgentPermission:
        self.session.add(permission)
        await self.session.commit()
        await self.session.refresh(permission)
        return permission

    async def get_by_id(self, permission_id: uuid.UUID) -> Optional[AgentPermission]:
        return await self.session.get(AgentPermission, permission_id)

    async def get_all(self) -> list[AgentPermission]:
        result = await self.session.execute(select(AgentPermission))
        return result.scalars().all()

    async def update(self, permission: AgentPermission, **values: Any) -> AgentPermission:
        for key, value in values.items():
            setattr(permission, key, value)
        self.session.add(permission)
        await self.session.commit()
        await self.session.refresh(permission)
        return permission

    async def delete(self, permission: AgentPermission) -> None:
        await self.session.delete(permission)
        await self.session.commit()
