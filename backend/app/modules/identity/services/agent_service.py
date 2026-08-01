from __future__ import annotations

import uuid
from typing import Any, Optional

from app.modules.identity.models.agent import Agent
from app.modules.identity.repositories.agent_repository import AgentRepository


class AgentService:
    def __init__(self, repository: AgentRepository) -> None:
        self.repository = repository

    async def create_agent(self, agent: Agent) -> Agent:
        return await self.repository.create(agent)

    async def get_agent_by_id(self, agent_id: uuid.UUID) -> Optional[Agent]:
        return await self.repository.get_by_id(agent_id)

    async def list_agents(self) -> list[Agent]:
        return await self.repository.get_all()

    async def update_agent(self, agent: Agent, **values: Any) -> Agent:
        return await self.repository.update(agent, **values)

    async def delete_agent(self, agent: Agent) -> None:
        await self.repository.delete(agent)
