from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, List, Optional

from app.modules.identity.models.agent_skill_profile import AgentSkillProfile
from app.modules.identity.repositories.agent_skill_profile_repository import AgentSkillProfileRepository


class AgentSkillProfileService:
    def __init__(self, repository: AgentSkillProfileRepository) -> None:
        self.repository = repository

    async def add_skill(self, profile: AgentSkillProfile) -> AgentSkillProfile:
        profile.created_at = profile.created_at or datetime.utcnow()
        profile.updated_at = profile.updated_at or datetime.utcnow()
        return await self.repository.create(profile)

    async def update_skill(self, profile: AgentSkillProfile, **values: Any) -> AgentSkillProfile:
        profile.updated_at = datetime.utcnow()
        return await self.repository.update(profile, **values)

    async def list_skills(self, agent_id: uuid.UUID) -> List[AgentSkillProfile]:
        return await self.repository.list_by_agent(agent_id)

    async def remove_skill(self, profile_id: uuid.UUID) -> None:
        profile = await self.repository.get_by_id(profile_id)
        if not profile:
            raise ValueError("skill profile not found")
        await self.repository.delete(profile)
