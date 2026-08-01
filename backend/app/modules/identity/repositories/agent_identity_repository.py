from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent_identity import AgentIdentity


class AgentIdentityRepository:
    """Repository for AgentIdentity persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, identity: AgentIdentity) -> AgentIdentity:
        self.session.add(identity)
        await self.session.commit()
        await self.session.refresh(identity)
        return identity

    async def get_by_id(self, identity_id: uuid.UUID) -> Optional[AgentIdentity]:
        return await self.session.get(AgentIdentity, identity_id)

    async def get_all(self) -> list[AgentIdentity]:
        result = await self.session.execute(select(AgentIdentity))
        return result.scalars().all()

    async def update(self, identity: AgentIdentity, **values: Any) -> AgentIdentity:
        for key, value in values.items():
            setattr(identity, key, value)
        self.session.add(identity)
        await self.session.commit()
        await self.session.refresh(identity)
        return identity

    async def delete(self, identity: AgentIdentity) -> None:
        await self.session.delete(identity)
        await self.session.commit()
