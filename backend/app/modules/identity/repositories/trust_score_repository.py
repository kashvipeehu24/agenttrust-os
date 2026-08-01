from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.trust_score import TrustScore


class TrustScoreRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, score: TrustScore) -> TrustScore:
        self.session.add(score)
        await self.session.commit()
        await self.session.refresh(score)
        return score

    async def get_by_id(self, score_id: uuid.UUID) -> Optional[TrustScore]:
        return await self.session.get(TrustScore, score_id)

    async def get_by_agent_id(self, agent_id: uuid.UUID) -> Optional[TrustScore]:
        stmt = select(TrustScore).where(TrustScore.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def update(self, score: TrustScore, **values: Any) -> TrustScore:
        for key, value in values.items():
            setattr(score, key, value)
        self.session.add(score)
        await self.session.commit()
        await self.session.refresh(score)
        return score

    async def delete(self, score: TrustScore) -> None:
        await self.session.delete(score)
        await self.session.commit()
