from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.modules.identity.schemas.trust_score import (
    TrustScoreCalculateSchema,
    TrustScoreResponseSchema,
    TrustScoreRecalculateSchema,
)
from app.modules.identity.services.trust_score_service import TrustScoreService
from app.modules.identity.models.trust_score import TrustScore


router = APIRouter(prefix="/trust", tags=["identity-trust"])


def get_trust_score_service() -> TrustScoreService:
    raise NotImplementedError("Provide TrustScoreService dependency")


@router.post("/calculate", response_model=TrustScoreResponseSchema)
async def calculate_trust(
    payload: TrustScoreCalculateSchema, service: TrustScoreService = Depends(get_trust_score_service)
) -> TrustScore:
    score = await service.calculate_score(payload.agent_id, inputs=payload.inputs)
    return score


@router.get("/{agent_id}", response_model=TrustScoreResponseSchema)
async def get_trust(agent_id: str, service: TrustScoreService = Depends(get_trust_score_service)) -> TrustScore:
    score = await service.get_score_by_agent(agent_id)
    if not score:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trust score not found")
    return score


@router.patch("/recalculate", response_model=TrustScoreResponseSchema)
async def recalculate_trust(
    payload: TrustScoreRecalculateSchema, service: TrustScoreService = Depends(get_trust_score_service)
) -> TrustScore:
    score = await service.recalculate_score(payload.agent_id)
    return score

