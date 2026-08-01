from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AgentDIDStatus(enum.Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"
    SUSPENDED = "SUSPENDED"


class AgentDID(Base):
    __tablename__ = "agent_dids"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    did: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    method: Mapped[str] = mapped_column(String(100), nullable=False)
    public_key: Mapped[str] = mapped_column(Text, nullable=False)
    document_url: Mapped[str] = mapped_column(String(512), nullable=True)
    verification_method: Mapped[str] = mapped_column(String(255), nullable=False)
    controller: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[AgentDIDStatus] = mapped_column(
        SAEnum(AgentDIDStatus, name="agent_did_status", native_enum=False), nullable=False, default=AgentDIDStatus.ACTIVE
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<AgentDID id={self.id} did={self.did} status={self.status}>"
