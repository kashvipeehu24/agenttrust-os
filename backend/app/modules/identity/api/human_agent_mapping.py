from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.modules.identity.models.human_agent_mapping import HumanAgentMapping
from app.modules.identity.schemas.human_agent_mapping import (
    HumanAgentMappingCreateSchema,
    HumanAgentMappingResponseSchema,
    HumanAgentMappingPermissionsUpdateSchema,
)
from app.modules.identity.services.human_agent_mapping_service import HumanAgentMappingService


router = APIRouter(prefix="/human-agent", tags=["identity-human-agent"])


def get_human_agent_service() -> HumanAgentMappingService:
    raise NotImplementedError("Provide HumanAgentMappingService dependency")


@router.post("/link", response_model=HumanAgentMappingResponseSchema)
async def link_agent(payload: HumanAgentMappingCreateSchema, service: HumanAgentMappingService = Depends(get_human_agent_service)) -> HumanAgentMapping:
    mapping = HumanAgentMapping(
        human_user_id=payload.human_user_id,
        agent_id=payload.agent_id,
        relationship_type=payload.relationship_type,
        permissions=payload.permissions,
        ownership_percentage=payload.ownership_percentage,
    )
    created = await service.link_agent(mapping)
    return created


@router.delete("/unlink", status_code=status.HTTP_204_NO_CONTENT)
async def unlink_agent(mapping_id: str = Path(...), service: HumanAgentMappingService = Depends(get_human_agent_service)) -> None:
    try:
        await service.unlink_agent(mapping_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))


@router.get("/user/{user_id}", response_model=list[HumanAgentMappingResponseSchema])
async def list_agents_for_user(user_id: str, service: HumanAgentMappingService = Depends(get_human_agent_service)) -> list[HumanAgentMapping]:
    return await service.list_agents_for_user(user_id)


@router.get("/agent/{agent_id}", response_model=list[HumanAgentMappingResponseSchema])
async def list_users_for_agent(agent_id: str, service: HumanAgentMappingService = Depends(get_human_agent_service)) -> list[HumanAgentMapping]:
    return await service.list_users_for_agent(agent_id)


@router.patch("/permissions", response_model=HumanAgentMappingResponseSchema)
async def update_permissions(payload: HumanAgentMappingPermissionsUpdateSchema, service: HumanAgentMappingService = Depends(get_human_agent_service)) -> HumanAgentMapping:
    try:
        updated = await service.update_permissions(payload.mapping_id, payload.permissions)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated
