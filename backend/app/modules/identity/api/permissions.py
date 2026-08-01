from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.agent_permission_service import AgentPermissionService
from app.modules.identity.schemas.agent_permission import AgentPermissionCreateSchema
from app.modules.identity.models.agent_permission import AgentPermission


router = APIRouter(prefix="/permissions", tags=["identity-permissions"])


def get_agent_permission_service() -> AgentPermissionService:
    raise NotImplementedError("Provide AgentPermissionService dependency")


@router.put("/{permission_id}", response_model=AgentPermission)
async def update_permissions(
    permission_id: str,
    payload: AgentPermissionCreateSchema,
    service: AgentPermissionService = Depends(get_agent_permission_service),
) -> AgentPermission:
    permission = await service.get_permission_by_id(permission_id)
    if not permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    updated_permission = await service.update_permission(permission, **payload.model_dump())
    return updated_permission


@router.get("/{permission_id}", response_model=AgentPermission)
async def get_permissions(permission_id: str, service: AgentPermissionService = Depends(get_agent_permission_service)) -> AgentPermission:
    permission = await service.get_permission_by_id(permission_id)
    if not permission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Permission not found")
    return permission
