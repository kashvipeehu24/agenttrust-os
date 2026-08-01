from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.agent_identity_service import AgentIdentityService
from app.modules.identity.models.agent_identity import AgentIdentity


router = APIRouter(prefix="/passport", tags=["identity-passport"])


def get_agent_identity_service() -> AgentIdentityService:
    raise NotImplementedError("Provide AgentIdentityService dependency")


@router.get("/{identity_id}", response_model=AgentIdentity)
async def get_passport(
    identity_id: str,
    service: AgentIdentityService = Depends(get_agent_identity_service),
) -> AgentIdentity:
    identity = await service.get_identity_by_id(identity_id)
    if not identity:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    return identity
