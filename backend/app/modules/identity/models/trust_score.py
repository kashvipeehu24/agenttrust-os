from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class TrustScore(Base):
    __tablename__ = "trust_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    overall_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    identity_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    activity_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    reputation_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    security_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    last_calculated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    explanation: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<TrustScore id={self.id} agent_id={self.agent_id} overall={self.overall_score}>"
