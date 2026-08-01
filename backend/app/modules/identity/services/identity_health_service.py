from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.identity_health import IdentityHealth, IdentityHealthStatus
from app.modules.identity.repositories.identity_health_repository import IdentityHealthRepository


class IdentityHealthService:
    def __init__(self, repository: IdentityHealthRepository) -> None:
        self.repository = repository

    async def calculate_health(self, agent_id: uuid.UUID, inputs: Optional[dict] = None) -> IdentityHealth:
        # placeholder calculation logic
        identity_completeness = 85.0
        verification_status_score = 90.0
        security_score = 80.0
        activity_score = 70.0
        overall = (identity_completeness + verification_status_score + security_score + activity_score) / 4.0
        now = datetime.utcnow()
        status = IdentityHealthStatus.HEALTHY
        if overall < 50:
            status = IdentityHealthStatus.CRITICAL
        elif overall < 75:
            status = IdentityHealthStatus.WARNING

        health = IdentityHealth(
            agent_id=agent_id,
            health_score=overall,
            identity_completeness=identity_completeness,
            verification_status_score=verification_status_score,
            security_score=security_score,
            activity_score=activity_score,
            last_checked_at=now,
            status=status,
            recommendations={"notes": "placeholder recommendations" if status != IdentityHealthStatus.HEALTHY else {}},
        )
        return await self.repository.create(health)

    async def get_health_by_agent(self, agent_id: uuid.UUID) -> Optional[IdentityHealth]:
        return await self.repository.get_by_agent_id(agent_id)

    async def refresh_health(self, agent_id: uuid.UUID, inputs: Optional[dict] = None) -> IdentityHealth:
        existing = await self.repository.get_by_agent_id(agent_id)
        new_health = await self.calculate_health(agent_id, inputs=inputs)
        if existing:
            return await self.repository.update(
                existing,
                health_score=new_health.health_score,
                identity_completeness=new_health.identity_completeness,
                verification_status_score=new_health.verification_status_score,
                security_score=new_health.security_score,
                activity_score=new_health.activity_score,
                last_checked_at=new_health.last_checked_at,
                status=new_health.status,
                recommendations=new_health.recommendations,
            )
        return new_health
