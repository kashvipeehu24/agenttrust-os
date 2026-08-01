from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.human_agent_mapping import HumanAgentMapping


class HumanAgentMappingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, mapping: HumanAgentMapping) -> HumanAgentMapping:
        self.session.add(mapping)
        await self.session.commit()
        await self.session.refresh(mapping)
        return mapping

    async def get_by_id(self, mapping_id: uuid.UUID) -> Optional[HumanAgentMapping]:
        return await self.session.get(HumanAgentMapping, mapping_id)

    async def list_by_user(self, human_user_id: uuid.UUID) -> list[HumanAgentMapping]:
        stmt = select(HumanAgentMapping).where(HumanAgentMapping.human_user_id == human_user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def list_by_agent(self, agent_id: uuid.UUID) -> list[HumanAgentMapping]:
        stmt = select(HumanAgentMapping).where(HumanAgentMapping.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, mapping: HumanAgentMapping, **values: Any) -> HumanAgentMapping:
        for key, value in values.items():
            setattr(mapping, key, value)
        self.session.add(mapping)
        await self.session.commit()
        await self.session.refresh(mapping)
        return mapping

    async def delete(self, mapping: HumanAgentMapping) -> None:
        await self.session.delete(mapping)
        await self.session.commit()
