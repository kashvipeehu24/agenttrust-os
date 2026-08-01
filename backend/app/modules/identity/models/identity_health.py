from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class IdentityHealthStatus(enum.Enum):
    HEALTHY = "HEALTHY"
    WARNING = "WARNING"
    CRITICAL = "CRITICAL"


class IdentityHealth(Base):
    __tablename__ = "identity_health"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    health_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    identity_completeness: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    verification_status_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    security_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    activity_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    last_checked_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    status: Mapped[IdentityHealthStatus] = mapped_column(
        SAEnum(IdentityHealthStatus, name="identity_health_status", native_enum=False), nullable=False, default=IdentityHealthStatus.HEALTHY
    )
    recommendations: Mapped[dict] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<IdentityHealth id={self.id} agent_id={self.agent_id} health={self.health_score}>"
