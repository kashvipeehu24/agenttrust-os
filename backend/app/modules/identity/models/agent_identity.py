from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class AgentIdentityType(enum.Enum):
    DID = "DID"
    EMAIL = "EMAIL"
    PASSPORT = "PASSPORT"
    USERNAME = "USERNAME"


class AgentIdentity(Base):
    __tablename__ = "agent_identities"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        nullable=False,
        unique=True,
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("agents.id", ondelete="CASCADE"),
        nullable=False,
    )
    identity_type: Mapped[AgentIdentityType] = mapped_column(
        SAEnum(AgentIdentityType, name="agent_identity_type", native_enum=False),
        nullable=False,
    )
    identifier: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    agent: Mapped["Agent"] = relationship(
        "Agent",
        back_populates="identities",
    )

    def __repr__(self) -> str:
        return (
            f"<AgentIdentity id={self.id} "
            f"type={self.identity_type.value!r} identifier={self.identifier!r}>"
        )
