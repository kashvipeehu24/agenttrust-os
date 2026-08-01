from __future__ import annotations

import uuid
from typing import Optional

from app.modules.identity.models.reputation_event import ReputationEvent
from app.modules.identity.repositories.reputation_event_repository import ReputationEventRepository


class ReputationEventService:
    def __init__(self, repository: ReputationEventRepository) -> None:
        self.repository = repository

    async def create_event(self, event: ReputationEvent) -> ReputationEvent:
        return await self.repository.create(event)

    async def list_timeline(self, agent_id: uuid.UUID) -> list[ReputationEvent]:
        return await self.repository.list_by_agent(agent_id)

    async def recent_events(self, agent_id: uuid.UUID, limit: int = 10) -> list[ReputationEvent]:
        return await self.repository.list_recent_by_agent(agent_id, limit=limit)

    async def delete_event(self, event: ReputationEvent) -> None:
        await self.repository.delete(event)
