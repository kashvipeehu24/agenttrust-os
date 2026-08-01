from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.modules.identity.schemas.trust_explanation import (
    TrustExplanationGenerateSchema,
    TrustExplanationResponseSchema,
)
from app.modules.identity.services.trust_explanation_service import TrustExplanationService
from app.modules.identity.models.trust_explanation import TrustExplanation


router = APIRouter(prefix="/trust/explanation", tags=["identity-trust-explanation"])


def get_trust_explanation_service() -> TrustExplanationService:
    raise NotImplementedError("Provide TrustExplanationService dependency")


@router.post("/generate", response_model=TrustExplanationResponseSchema)
async def generate_explanation(
    payload: TrustExplanationGenerateSchema, service: TrustExplanationService = Depends(get_trust_explanation_service)
) -> TrustExplanation:
    explanation = await service.generate_explanation(payload.agent_id, payload.trust_score, trust_score_id=payload.trust_score_id)
    return explanation


@router.get("/{agent_id}", response_model=TrustExplanationResponseSchema)
async def get_latest(agent_id: str, service: TrustExplanationService = Depends(get_trust_explanation_service)) -> TrustExplanation:
    explanation = await service.get_latest_explanation(agent_id)
    if not explanation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Explanation not found")
    return explanation


@router.get("/history/{agent_id}", response_model=list[TrustExplanationResponseSchema])
async def history(agent_id: str, limit: int = Query(50, ge=1, le=500), service: TrustExplanationService = Depends(get_trust_explanation_service)) -> list[TrustExplanation]:
    return await service.list_explanations(agent_id, limit=limit)
