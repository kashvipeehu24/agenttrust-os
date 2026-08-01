from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.identity_health import IdentityHealth


class IdentityHealthRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, health: IdentityHealth) -> IdentityHealth:
        self.session.add(health)
        await self.session.commit()
        await self.session.refresh(health)
        return health

    async def get_by_id(self, health_id: uuid.UUID) -> Optional[IdentityHealth]:
        return await self.session.get(IdentityHealth, health_id)

    async def get_by_agent_id(self, agent_id: uuid.UUID) -> Optional[IdentityHealth]:
        stmt = select(IdentityHealth).where(IdentityHealth.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, health: IdentityHealth, **values: Any) -> IdentityHealth:
        for key, value in values.items():
            setattr(health, key, value)
        self.session.add(health)
        await self.session.commit()
        await self.session.refresh(health)
        return health

    async def delete(self, health: IdentityHealth) -> None:
        await self.session.delete(health)
        await self.session.commit()
