from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.models.agent_passport import AgentPassport
from app.modules.identity.services.agent_passport_service import AgentPassportService
from app.modules.identity.schemas.agent_passport import (
    AgentPassportIssueSchema,
    AgentPassportResponseSchema,
    PassportActionSchema,
    PassportRenewSchema,
)


router = APIRouter(prefix="/passport", tags=["identity-passport"])


def get_agent_passport_service() -> AgentPassportService:
    raise NotImplementedError("Provide AgentPassportService dependency")


@router.post("/issue", response_model=AgentPassportResponseSchema)
async def issue_passport(
    payload: AgentPassportIssueSchema,
    service: AgentPassportService = Depends(get_agent_passport_service),
) -> AgentPassport:
    passport = AgentPassport(
        agent_id=payload.agent_id,
        passport_number=payload.passport_number,
        issued_by=payload.issued_by,
        issued_at=payload.issued_at,
        expires_at=payload.expires_at,
        passport_metadata=payload.passport_metadata,
    )
    try:
        issued = await service.issue_passport(passport)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return issued


@router.get("/{agent_id}", response_model=AgentPassportResponseSchema)
async def get_passport(
    agent_id: str, service: AgentPassportService = Depends(get_agent_passport_service)
) -> AgentPassport:
    passport = await service.get_passport_by_agent(agent_id)
    if not passport:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    return passport


@router.patch("/suspend", response_model=AgentPassportResponseSchema)
async def suspend_passport(
    payload: PassportActionSchema, service: AgentPassportService = Depends(get_agent_passport_service)
) -> AgentPassport:
    passport = await service.get_passport_by_number(payload.passport_number)
    if not passport:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    updated = await service.suspend_passport(passport)
    return updated


@router.patch("/revoke", response_model=AgentPassportResponseSchema)
async def revoke_passport(
    payload: PassportActionSchema, service: AgentPassportService = Depends(get_agent_passport_service)
) -> AgentPassport:
    passport = await service.get_passport_by_number(payload.passport_number)
    if not passport:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    updated = await service.revoke_passport(passport)
    return updated


@router.patch("/renew", response_model=AgentPassportResponseSchema)
async def renew_passport(
    payload: PassportRenewSchema, service: AgentPassportService = Depends(get_agent_passport_service)
) -> AgentPassport:
    passport = await service.get_passport_by_number(payload.passport_number)
    if not passport:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Passport not found")
    updated = await service.renew_passport(passport, payload.expires_at)
    return updated
