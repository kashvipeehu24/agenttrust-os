from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.organization_trust import OrganizationTrust
from app.modules.identity.repositories.organization_trust_repository import OrganizationTrustRepository


class OrganizationTrustService:
    def __init__(self, repository: OrganizationTrustRepository) -> None:
        self.repository = repository

    async def calculate_trust(
        self,
        organization_id: uuid.UUID,
        base_trust_score: float,
        inheritance_weight: float = 1.0,
        child_agent_count: int = 0,
        verified_agent_count: int = 0,
    ) -> OrganizationTrust:
        inherited_trust_score = base_trust_score * inheritance_weight
        now = datetime.utcnow()

        trust = OrganizationTrust(
            organization_id=organization_id,
            base_trust_score=base_trust_score,
            inherited_trust_score=inherited_trust_score,
            inheritance_weight=inheritance_weight,
            child_agent_count=child_agent_count,
            verified_agent_count=verified_agent_count,
            last_calculated_at=now,
        )
        return await self.repository.create(trust)

    async def recalculate_trust(self, organization_id: uuid.UUID) -> OrganizationTrust:
        existing = await self.repository.get_by_organization_id(organization_id)
        if not existing:
            raise ValueError("Organization trust not found")

        inherited_trust_score = existing.base_trust_score * existing.inheritance_weight
        existing.last_calculated_at = datetime.utcnow()
        return await self.repository.update(
            existing,
            inherited_trust_score=inherited_trust_score,
            last_calculated_at=existing.last_calculated_at,
        )

    async def get_trust(self, organization_id: uuid.UUID) -> Optional[OrganizationTrust]:
        return await self.repository.get_by_organization_id(organization_id)
