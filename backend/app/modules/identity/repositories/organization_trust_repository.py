from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.organization_trust import OrganizationTrust


class OrganizationTrustRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, trust: OrganizationTrust) -> OrganizationTrust:
        self.session.add(trust)
        await self.session.commit()
        await self.session.refresh(trust)
        return trust

    async def get_by_id(self, trust_id: uuid.UUID) -> Optional[OrganizationTrust]:
        return await self.session.get(OrganizationTrust, trust_id)

    async def get_by_organization_id(self, organization_id: uuid.UUID) -> Optional[OrganizationTrust]:
        stmt = select(OrganizationTrust).where(OrganizationTrust.organization_id == organization_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, trust: OrganizationTrust, **values: Any) -> OrganizationTrust:
        for key, value in values.items():
            setattr(trust, key, value)
        self.session.add(trust)
        await self.session.commit()
        await self.session.refresh(trust)
        return trust

    async def delete(self, trust: OrganizationTrust) -> None:
        await self.session.delete(trust)
        await self.session.commit()
