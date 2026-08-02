from __future__ import annotations

import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AgentSkillProfile(Base):
    __tablename__ = "agent_skill_profiles"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    skill_name: Mapped[str] = mapped_column(String(150), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    proficiency_level: Mapped[str] = mapped_column(String(100), nullable=False)
    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)
    certified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    last_assessed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    skill_metadata: Mapped[dict] = mapped_column("metadata", JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<AgentSkillProfile id={self.id} agent_id={self.agent_id} skill={self.skill_name!r}>"

# Attach metadata property dynamically after SQLAlchemy mapping setup
AgentSkillProfile.metadata = property(
    fget=lambda self: self.skill_metadata,
    fset=lambda self, val: setattr(self, "skill_metadata", val)
)