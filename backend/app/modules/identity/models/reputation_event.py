from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, JSON, String, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class ReputationEvent(Base):
    __tablename__ = "reputation_events"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)
    event_title: Mapped[str] = mapped_column(String(255), nullable=False)
    event_description: Mapped[str] = mapped_column(Text, nullable=True)
    trust_delta: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    previous_score: Mapped[float] = mapped_column(Float, nullable=True)
    new_score: Mapped[float] = mapped_column(Float, nullable=True)
    event_source: Mapped[str] = mapped_column(String(255), nullable=True)
    extra_metadata: Mapped[dict] = mapped_column("metadata", JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<ReputationEvent id={self.id} agent_id={self.agent_id} type={self.event_type}>"

# Attach metadata property dynamically after SQLAlchemy mapping setup
ReputationEvent.metadata = property(
    fget=lambda self: self.extra_metadata,
    fset=lambda self, val: setattr(self, "extra_metadata", val)
)
