from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.schemas.agent_did import (
    AgentDIDCreateSchema,
    AgentDIDResponseSchema,
    AgentDIDRotateSchema,
    AgentDIDActionSchema,
)
from app.modules.identity.services.agent_did_service import AgentDIDService
from app.modules.identity.models.agent_did import AgentDID


router = APIRouter(prefix="/did", tags=["identity-did"])


def get_agent_did_service() -> AgentDIDService:
    raise NotImplementedError("Provide AgentDIDService dependency")


@router.post("/create", response_model=AgentDIDResponseSchema)
async def create_did(payload: AgentDIDCreateSchema, service: AgentDIDService = Depends(get_agent_did_service)) -> AgentDID:
    created = await service.create_did(
        payload.agent_id,
        method=payload.method,
        public_key=payload.public_key,
        document_url=payload.document_url,
        verification_method=payload.verification_method,
        controller=payload.controller,
    )
    return created


@router.get("/{agent_id}", response_model=AgentDIDResponseSchema)
async def get_did(agent_id: str, service: AgentDIDService = Depends(get_agent_did_service)) -> AgentDID:
    did = await service.get_did_by_agent(agent_id)
    if not did:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="DID not found")
    return did


@router.patch("/rotate", response_model=AgentDIDResponseSchema)
async def rotate_did(payload: AgentDIDRotateSchema, service: AgentDIDService = Depends(get_agent_did_service)) -> AgentDID:
    try:
        updated = await service.rotate_key(payload.did, payload.new_public_key)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated


@router.patch("/revoke", response_model=AgentDIDResponseSchema)
async def revoke_did(payload: AgentDIDActionSchema, service: AgentDIDService = Depends(get_agent_did_service)) -> AgentDID:
    try:
        updated = await service.revoke_did(payload.did)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated


@router.patch("/suspend", response_model=AgentDIDResponseSchema)
async def suspend_did(payload: AgentDIDActionSchema, service: AgentDIDService = Depends(get_agent_did_service)) -> AgentDID:
    try:
        updated = await service.suspend_did(payload.did)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated
