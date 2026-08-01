from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.services.agent_service import AgentService
from app.modules.identity.schemas.agent import AgentCreateSchema
from app.modules.identity.models.agent import Agent


router = APIRouter(prefix="/agents", tags=["identity-agents"])


def get_agent_service() -> AgentService:
    raise NotImplementedError("Provide AgentService dependency")


@router.post("/", response_model=None)
async def register_agent(
    payload: AgentCreateSchema,
    service: AgentService = Depends(get_agent_service),
) -> dict[str, str]:
    agent = Agent(
        name=payload.name,
        organization_id=payload.organization_id,
        owner_id=payload.owner_id,
        status=payload.status,
        is_active=payload.is_active,
    )
    await service.create_agent(agent)
    return {"message": "agent registered"}


@router.get("/{agent_id}", response_model=Agent)
async def get_agent(agent_id: str, service: AgentService = Depends(get_agent_service)) -> Agent:
    agent = await service.get_agent_by_id(agent_id)
    if not agent:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Agent not found")
    return agent


@router.get("/", response_model=list[Agent])
async def list_agents(service: AgentService = Depends(get_agent_service)) -> list[Agent]:
    return await service.list_agents()
