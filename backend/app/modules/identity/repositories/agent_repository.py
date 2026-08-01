from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent import Agent


class AgentRepository:
    """Repository for Agent persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, agent: Agent) -> Agent:
        self.session.add(agent)
        await self.session.commit()
        await self.session.refresh(agent)
        return agent

    async def get_by_id(self, agent_id: uuid.UUID) -> Optional[Agent]:
        return await self.session.get(Agent, agent_id)

    async def get_all(self) -> list[Agent]:
        result = await self.session.execute(select(Agent))
        return result.scalars().all()

    async def update(self, agent: Agent, **values: Any) -> Agent:
        for key, value in values.items():
            setattr(agent, key, value)
        self.session.add(agent)
        await self.session.commit()
        await self.session.refresh(agent)
        return agent

    async def delete(self, agent: Agent) -> None:
        await self.session.delete(agent)
        await self.session.commit()
