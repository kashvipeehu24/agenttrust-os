from __future__ import annotations

import uuid
from typing import Any, Optional

from app.modules.identity.models.organization import Organization
from app.modules.identity.repositories.organization_repository import OrganizationRepository


class OrganizationService:
    def __init__(self, repository: OrganizationRepository) -> None:
        self.repository = repository

    async def create_organization(self, organization: Organization) -> Organization:
        return await self.repository.create(organization)

    async def get_organization_by_id(self, organization_id: uuid.UUID) -> Optional[Organization]:
        return await self.repository.get_by_id(organization_id)

    async def list_organizations(self) -> list[Organization]:
        return await self.repository.get_all()

    async def update_organization(self, organization: Organization, **values: Any) -> Organization:
        return await self.repository.update(organization, **values)

    async def delete_organization(self, organization: Organization) -> None:
        await self.repository.delete(organization)
