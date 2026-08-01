from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.agent_passport import AgentPassport, PassportStatus
from app.modules.identity.repositories.agent_passport_repository import AgentPassportRepository


class AgentPassportService:
    def __init__(self, repository: AgentPassportRepository) -> None:
        self.repository = repository

    async def issue_passport(self, passport: AgentPassport) -> AgentPassport:
        existing = await self.repository.get_by_passport_number(passport.passport_number)
        if existing:
            raise ValueError("passport_number already exists")
        # ensure issued_at exists
        if not passport.issued_at:
            passport.issued_at = datetime.utcnow()
        passport.status = PassportStatus.ACTIVE
        return await self.repository.create(passport)

    async def get_passport_by_agent(self, agent_id: uuid.UUID) -> Optional[AgentPassport]:
        return await self.repository.get_by_agent_id(agent_id)

    async def get_passport_by_number(self, passport_number: str) -> Optional[AgentPassport]:
        return await self.repository.get_by_passport_number(passport_number)

    async def suspend_passport(self, passport: AgentPassport) -> AgentPassport:
        passport.status = PassportStatus.SUSPENDED
        return await self.repository.update(passport, status=passport.status)

    async def revoke_passport(self, passport: AgentPassport) -> AgentPassport:
        passport.status = PassportStatus.REVOKED
        return await self.repository.update(passport, status=passport.status)

    async def renew_passport(self, passport: AgentPassport, expires_at: datetime) -> AgentPassport:
        passport.expires_at = expires_at
        passport.status = PassportStatus.ACTIVE
        return await self.repository.update(passport, expires_at=expires_at, status=passport.status)
