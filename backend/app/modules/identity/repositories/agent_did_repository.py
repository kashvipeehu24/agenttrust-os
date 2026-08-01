from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent_did import AgentDID


class AgentDIDRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, did: AgentDID) -> AgentDID:
        self.session.add(did)
        await self.session.commit()
        await self.session.refresh(did)
        return did

    async def get_by_id(self, did_id: uuid.UUID) -> Optional[AgentDID]:
        return await self.session.get(AgentDID, did_id)

    async def get_by_agent_id(self, agent_id: uuid.UUID) -> Optional[AgentDID]:
        stmt = select(AgentDID).where(AgentDID.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_did(self, did_str: str) -> Optional[AgentDID]:
        stmt = select(AgentDID).where(AgentDID.did == did_str)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, did: AgentDID, **values: Any) -> AgentDID:
        for key, value in values.items():
            setattr(did, key, value)
        self.session.add(did)
        await self.session.commit()
        await self.session.refresh(did)
        return did

    async def delete(self, did: AgentDID) -> None:
        await self.session.delete(did)
        await self.session.commit()
