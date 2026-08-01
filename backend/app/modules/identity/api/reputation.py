from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from app.modules.identity.models.reputation_event import ReputationEvent
from app.modules.identity.schemas.reputation_event import (
    ReputationEventCreateSchema,
    ReputationEventResponseSchema,
)
from app.modules.identity.services.reputation_event_service import ReputationEventService


router = APIRouter(prefix="/reputation", tags=["identity-reputation"])


def get_reputation_event_service() -> ReputationEventService:
    raise NotImplementedError("Provide ReputationEventService dependency")


@router.post("/event", response_model=ReputationEventResponseSchema)
async def create_event(
    payload: ReputationEventCreateSchema, service: ReputationEventService = Depends(get_reputation_event_service)
) -> ReputationEvent:
    event = ReputationEvent(
        agent_id=payload.agent_id,
        event_type=payload.event_type,
        event_title=payload.event_title,
        event_description=payload.event_description,
        trust_delta=payload.trust_delta,
        previous_score=payload.previous_score,
        new_score=payload.new_score,
        event_source=payload.event_source,
        metadata=payload.metadata,
    )
    created = await service.create_event(event)
    return created


@router.get("/{agent_id}", response_model=list[ReputationEventResponseSchema])
async def list_timeline(
    agent_id: str = Path(..., description="Agent UUID"), service: ReputationEventService = Depends(get_reputation_event_service)
) -> list[ReputationEvent]:
    return await service.list_timeline(agent_id)


@router.get("/{agent_id}/recent", response_model=list[ReputationEventResponseSchema])
async def recent_events(
    agent_id: str = Path(..., description="Agent UUID"),
    limit: int = Query(10, ge=1, le=100),
    service: ReputationEventService = Depends(get_reputation_event_service),
) -> list[ReputationEvent]:
    return await service.recent_events(agent_id, limit=limit)


@router.delete("/event/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_event(id: str, service: ReputationEventService = Depends(get_reputation_event_service)) -> None:
    event = await service.repository.get_by_id(id)
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    await service.delete_event(event)
