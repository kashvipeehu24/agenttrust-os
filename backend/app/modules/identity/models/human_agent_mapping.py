from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, Float, ForeignKey, JSON, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class RelationshipType(enum.Enum):
    OWNER = "OWNER"
    CREATOR = "CREATOR"
    OPERATOR = "OPERATOR"
    DELEGATE = "DELEGATE"


class MappingStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"
    SUSPENDED = "SUSPENDED"


class HumanAgentMapping(Base):
    __tablename__ = "human_agent_mappings"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    human_user_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    relationship_type: Mapped[RelationshipType] = mapped_column(
        SAEnum(RelationshipType, name="relationship_type", native_enum=False), nullable=False
    )
    status: Mapped[MappingStatus] = mapped_column(
        SAEnum(MappingStatus, name="mapping_status", native_enum=False), nullable=False, default=MappingStatus.ACTIVE
    )
    permissions: Mapped[dict] = mapped_column(JSON, nullable=True)
    ownership_percentage: Mapped[float] = mapped_column(Float, nullable=True, default=0.0)
    linked_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    last_updated: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<HumanAgentMapping id={self.id} human={self.human_user_id} agent={self.agent_id} type={self.relationship_type}>"