from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.trust_explanation import TrustExplanation, RiskLevel
from app.modules.identity.repositories.trust_explanation_repository import TrustExplanationRepository


class TrustExplanationService:
    def __init__(self, repository: TrustExplanationRepository) -> None:
        self.repository = repository

    def _deterministic_confidence(self, overall_score: float) -> float:
        # Deterministic mapping: higher overall -> higher confidence
        return max(0.0, min(100.0, overall_score * 0.9 + 5.0))

    def _deterministic_risk(self, overall_score: float) -> RiskLevel:
        if overall_score >= 75.0:
            return RiskLevel.LOW
        if overall_score >= 50.0:
            return RiskLevel.MEDIUM
        return RiskLevel.HIGH

    async def generate_explanation(self, agent_id: uuid.UUID, trust_score: dict, trust_score_id: Optional[uuid.UUID] = None) -> TrustExplanation:
        # trust_score is expected to contain numeric components and overall_score
        overall = float(trust_score.get("overall_score", 0.0))
        confidence = self._deterministic_confidence(overall)
        risk = self._deterministic_risk(overall)

        # Build simple deterministic factors
        positive = {k: v for k, v in trust_score.items() if isinstance(v, (int, float)) and v >= 75}
        negative = {k: v for k, v in trust_score.items() if isinstance(v, (int, float)) and v < 50}

        summary_parts = []
        if positive:
            summary_parts.append(f"Strengths: {', '.join(positive.keys())}")
        if negative:
            summary_parts.append(f"Weaknesses: {', '.join(negative.keys())}")
        summary = "; ".join(summary_parts) if summary_parts else "Balanced"

        recommendations = {"improve": list(negative.keys()), "maintain": list(positive.keys())}

        now = datetime.utcnow()
        explanation = TrustExplanation(
            agent_id=agent_id,
            trust_score_id=trust_score_id,
            overall_score=overall,
            confidence_score=confidence,
            risk_level=risk,
            explanation_summary=summary,
            positive_factors=positive or None,
            negative_factors=negative or None,
            recommendations=recommendations,
            generated_at=now,
        )

        return await self.repository.create(explanation)

    async def get_latest_explanation(self, agent_id: uuid.UUID) -> Optional[TrustExplanation]:
        return await self.repository.get_latest_by_agent(agent_id)

    async def list_explanations(self, agent_id: uuid.UUID, limit: int | None = None) -> list[TrustExplanation]:
        return await self.repository.list_by_agent(agent_id, limit=limit)
