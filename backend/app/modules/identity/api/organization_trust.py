from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.schemas.organization_trust import (
    OrganizationTrustCalculateSchema,
    OrganizationTrustRecalculateSchema,
    OrganizationTrustResponseSchema,
)
from app.modules.identity.services.organization_trust_service import OrganizationTrustService
from app.modules.identity.models.organization_trust import OrganizationTrust


router = APIRouter(prefix="/organization-trust", tags=["identity-organization-trust"])


def get_organization_trust_service() -> OrganizationTrustService:
    raise NotImplementedError("Provide OrganizationTrustService dependency")


@router.post("/calculate", response_model=OrganizationTrustResponseSchema)
async def calculate_trust(
    payload: OrganizationTrustCalculateSchema,
    service: OrganizationTrustService = Depends(get_organization_trust_service),
) -> OrganizationTrust:
    trust = await service.calculate_trust(
        payload.organization_id,
        payload.base_trust_score,
        payload.inheritance_weight,
    )
    return trust


@router.patch("/recalculate", response_model=OrganizationTrustResponseSchema)
async def recalculate_trust(
    payload: OrganizationTrustRecalculateSchema,
    service: OrganizationTrustService = Depends(get_organization_trust_service),
) -> OrganizationTrust:
    try:
        trust = await service.recalculate_trust(payload.organization_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return trust


@router.get("/{organization_id}", response_model=OrganizationTrustResponseSchema)
async def get_trust(
    organization_id: uuid.UUID,
    service: OrganizationTrustService = Depends(get_organization_trust_service),
) -> OrganizationTrust:
    trust = await service.get_trust(organization_id)
    if not trust:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization trust not found")
    return trust
