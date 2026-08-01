from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.agent_skill_profile import AgentSkillProfile


class AgentSkillProfileRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, profile: AgentSkillProfile) -> AgentSkillProfile:
        self.session.add(profile)
        await self.session.commit()
        await self.session.refresh(profile)
        return profile

    async def get_by_id(self, profile_id: uuid.UUID) -> Optional[AgentSkillProfile]:
        return await self.session.get(AgentSkillProfile, profile_id)

    async def list_by_agent(self, agent_id: uuid.UUID) -> list[AgentSkillProfile]:
        stmt = select(AgentSkillProfile).where(AgentSkillProfile.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, profile: AgentSkillProfile, **values: Any) -> AgentSkillProfile:
        for key, value in values.items():
            setattr(profile, key, value)
        self.session.add(profile)
        await self.session.commit()
        await self.session.refresh(profile)
        return profile

    async def delete(self, profile: AgentSkillProfile) -> None:
        await self.session.delete(profile)
        await self.session.commit()
