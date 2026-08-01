from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.agent_service import AgentService


router = APIRouter(prefix="/trust", tags=["identity-trust"])


def get_agent_service() -> AgentService:
    raise NotImplementedError("Provide AgentService dependency")


@router.get("/{agent_id}/score")
async def get_trust_score(agent_id: str, service: AgentService = Depends(get_agent_service)) -> dict[str, str]:
    agent = await service.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return {"trust_score": "not implemented"}


@router.get("/{agent_id}/timeline")
async def get_reputation_timeline(agent_id: str, service: AgentService = Depends(get_agent_service)) -> dict[str, str]:
    agent = await service.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return {"timeline": "not implemented"}


@router.get("/{agent_id}/explain")
async def explain_trust_score(agent_id: str, service: AgentService = Depends(get_agent_service)) -> dict[str, str]:
    agent = await service.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return {"explanation": "not implemented"}
