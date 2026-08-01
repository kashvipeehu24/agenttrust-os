from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class OrganizationTrust(Base):
    __tablename__ = "organization_trust"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    organization_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False
    )
    base_trust_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    inherited_trust_score: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    inheritance_weight: Mapped[float] = mapped_column(Float, nullable=False, default=1.0)
    child_agent_count: Mapped[int] = mapped_column(nullable=False, default=0)
    verified_agent_count: Mapped[int] = mapped_column(nullable=False, default=0)
    last_calculated_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<OrganizationTrust id={self.id} org_id={self.organization_id} inherited={self.inherited_trust_score}>"
