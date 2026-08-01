from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base


class AgentPermissionType(enum.Enum):
    READ = "READ"
    WRITE = "WRITE"
    ADMIN = "ADMIN"
    OWNER = "OWNER"


class AgentPermission(Base):
    __tablename__ = "agent_permissions"

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
    granted_by_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )
    permission: Mapped[AgentPermissionType] = mapped_column(
        SAEnum(AgentPermissionType, name="agent_permission_type", native_enum=False),
        nullable=False,
    )
    resource: Mapped[str] = mapped_column(String(150), nullable=False)
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
        back_populates="permissions",
    )
    granted_by: Mapped["User"] = relationship(
        "User",
        back_populates="granted_permissions",
    )

    def __repr__(self) -> str:
        return (
            f"<AgentPermission id={self.id} permission={self.permission.value!r} "
            f"resource={self.resource!r}>"
        )
