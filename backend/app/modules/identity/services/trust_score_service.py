from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.trust_score import TrustScore
from app.modules.identity.repositories.trust_score_repository import TrustScoreRepository


class TrustScoreService:
    def __init__(self, repository: TrustScoreRepository) -> None:
        self.repository = repository

    async def calculate_score(self, agent_id: uuid.UUID, inputs: Optional[dict] = None) -> TrustScore:
        # Placeholder calculation logic
        identity_score = 80.0
        activity_score = 70.0
        reputation_score = 75.0
        security_score = 85.0
        overall = (identity_score + activity_score + reputation_score + security_score) / 4.0
        now = datetime.utcnow()

        score = TrustScore(
            agent_id=agent_id,
            overall_score=overall,
            identity_score=identity_score,
            activity_score=activity_score,
            reputation_score=reputation_score,
            security_score=security_score,
            last_calculated_at=now,
            explanation={"method": "placeholder", "inputs": inputs},
        )
        return await self.repository.create(score)

    async def get_score_by_agent(self, agent_id: uuid.UUID) -> Optional[TrustScore]:
        return await self.repository.get_by_agent_id(agent_id)

    async def recalculate_score(self, agent_id: uuid.UUID, inputs: Optional[dict] = None) -> TrustScore:
        existing = await self.repository.get_by_agent_id(agent_id)
        new_score = await self.calculate_score(agent_id, inputs=inputs)
        if existing:
            # update existing record with new values
            return await self.repository.update(
                existing,
                overall_score=new_score.overall_score,
                identity_score=new_score.identity_score,
                activity_score=new_score.activity_score,
                reputation_score=new_score.reputation_score,
                security_score=new_score.security_score,
                last_calculated_at=new_score.last_calculated_at,
                explanation=new_score.explanation,
            )
        return new_score
