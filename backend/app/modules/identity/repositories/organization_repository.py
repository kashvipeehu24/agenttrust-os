from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.organization import Organization


class OrganizationRepository:
    """Repository for Organization persistence operations."""

    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, organization: Organization) -> Organization:
        self.session.add(organization)
        await self.session.commit()
        await self.session.refresh(organization)
        return organization

    async def get_by_id(self, organization_id: uuid.UUID) -> Optional[Organization]:
        return await self.session.get(Organization, organization_id)

    async def get_all(self) -> list[Organization]:
        result = await self.session.execute(select(Organization))
        return result.scalars().all()

    async def update(self, organization: Organization, **values: Any) -> Organization:
        for key, value in values.items():
            setattr(organization, key, value)
        self.session.add(organization)
        await self.session.commit()
        await self.session.refresh(organization)
        return organization

    async def delete(self, organization: Organization) -> None:
        await self.session.delete(organization)
        await self.session.commit()
