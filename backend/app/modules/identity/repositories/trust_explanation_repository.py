from __future__ import annotations

import uuid
from typing import Optional

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.trust_explanation import TrustExplanation


class TrustExplanationRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, explanation: TrustExplanation) -> TrustExplanation:
        self.session.add(explanation)
        await self.session.commit()
        await self.session.refresh(explanation)
        return explanation

    async def get_by_id(self, explanation_id: uuid.UUID) -> Optional[TrustExplanation]:
        return await self.session.get(TrustExplanation, explanation_id)

    async def get_latest_by_agent(self, agent_id: uuid.UUID) -> Optional[TrustExplanation]:
        stmt = select(TrustExplanation).where(TrustExplanation.agent_id == agent_id).order_by(desc(TrustExplanation.generated_at)).limit(1)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_agent(self, agent_id: uuid.UUID, limit: int | None = None) -> list[TrustExplanation]:
        stmt = select(TrustExplanation).where(TrustExplanation.agent_id == agent_id).order_by(desc(TrustExplanation.generated_at))
        if limit:
            stmt = stmt.limit(limit)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def delete(self, explanation: TrustExplanation) -> None:
        await self.session.delete(explanation)
        await self.session.commit()
