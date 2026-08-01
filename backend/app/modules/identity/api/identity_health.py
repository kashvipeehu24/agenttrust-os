from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.schemas.identity_health import (
    IdentityHealthCalculateSchema,
    IdentityHealthResponseSchema,
    IdentityHealthRefreshSchema,
)
from app.modules.identity.services.identity_health_service import IdentityHealthService
from app.modules.identity.models.identity_health import IdentityHealth


router = APIRouter(prefix="/identity-health", tags=["identity-health"])


def get_identity_health_service() -> IdentityHealthService:
    raise NotImplementedError("Provide IdentityHealthService dependency")


@router.post("/calculate", response_model=IdentityHealthResponseSchema)
async def calculate_identity_health(
    payload: IdentityHealthCalculateSchema, service: IdentityHealthService = Depends(get_identity_health_service)
) -> IdentityHealth:
    health = await service.calculate_health(payload.agent_id, inputs=payload.inputs)
    return health


@router.get("/{agent_id}", response_model=IdentityHealthResponseSchema)
async def get_identity_health(agent_id: str, service: IdentityHealthService = Depends(get_identity_health_service)) -> IdentityHealth:
    health = await service.get_health_by_agent(agent_id)
    if not health:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Identity health not found")
    return health


@router.patch("/refresh", response_model=IdentityHealthResponseSchema)
async def refresh_identity_health(
    payload: IdentityHealthRefreshSchema, service: IdentityHealthService = Depends(get_identity_health_service)
) -> IdentityHealth:
    health = await service.refresh_health(payload.agent_id)
    return health
