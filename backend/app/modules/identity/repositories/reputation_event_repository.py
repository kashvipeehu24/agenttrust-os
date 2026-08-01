from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.reputation_event import ReputationEvent


class ReputationEventRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, event: ReputationEvent) -> ReputationEvent:
        self.session.add(event)
        await self.session.commit()
        await self.session.refresh(event)
        return event

    async def get_by_id(self, event_id: uuid.UUID) -> Optional[ReputationEvent]:
        return await self.session.get(ReputationEvent, event_id)

    async def list_by_agent(self, agent_id: uuid.UUID) -> list[ReputationEvent]:
        stmt = select(ReputationEvent).where(ReputationEvent.agent_id == agent_id).order_by(ReputationEvent.created_at)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def list_recent_by_agent(self, agent_id: uuid.UUID, limit: int = 10) -> list[ReputationEvent]:
        stmt = select(ReputationEvent).where(ReputationEvent.agent_id == agent_id).order_by(desc(ReputationEvent.created_at)).limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def delete(self, event: ReputationEvent) -> None:
        await self.session.delete(event)
        await self.session.commit()
