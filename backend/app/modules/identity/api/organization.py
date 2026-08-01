from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.organization_service import OrganizationService
from app.modules.identity.schemas.organization import OrganizationCreateSchema
from app.modules.identity.models.organization import Organization


router = APIRouter(prefix="/organizations", tags=["identity-organizations"])


def get_organization_service() -> OrganizationService:
    raise NotImplementedError("Provide OrganizationService dependency")


@router.post("/", response_model=None)
async def create_organization(
    payload: OrganizationCreateSchema,
    service: OrganizationService = Depends(get_organization_service),
) -> dict[str, str]:
    organization = Organization(
        name=payload.name,
        description=payload.description,
        industry=payload.industry,
        website=payload.website,
        verification_status=payload.verification_status,
        owner_id=payload.owner_id,
    )
    await service.create_organization(organization)
    return {"message": "organization created"}


@router.get("/{organization_id}", response_model=None)
async def get_organization(
    organization_id: str,
    service: OrganizationService = Depends(get_organization_service),
) -> Organization:
    organization = await service.get_organization_by_id(organization_id)
    if not organization:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found")
    return organization
