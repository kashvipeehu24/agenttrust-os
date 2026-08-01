from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent_passport import AgentPassport


class AgentPassportRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, passport: AgentPassport) -> AgentPassport:
        self.session.add(passport)
        await self.session.commit()
        await self.session.refresh(passport)
        return passport

    async def get_by_id(self, passport_id: uuid.UUID) -> Optional[AgentPassport]:
        return await self.session.get(AgentPassport, passport_id)

    async def get_by_agent_id(self, agent_id: uuid.UUID) -> Optional[AgentPassport]:
        stmt = select(AgentPassport).where(AgentPassport.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_by_passport_number(self, passport_number: str) -> Optional[AgentPassport]:
        stmt = select(AgentPassport).where(AgentPassport.passport_number == passport_number)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, passport: AgentPassport, **values: Any) -> AgentPassport:
        for key, value in values.items():
            setattr(passport, key, value)
        self.session.add(passport)
        await self.session.commit()
        await self.session.refresh(passport)
        return passport

    async def delete(self, passport: AgentPassport) -> None:
        await self.session.delete(passport)
        await self.session.commit()
