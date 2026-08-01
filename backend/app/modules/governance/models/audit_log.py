"""
Audit Log Model

Stores immutable audit records for governance actions.
Used for compliance, security investigations, and complete
activity history.
"""

from datetime import datetime
from enum import Enum
import uuid

from sqlalchemy import (
    DateTime,
    Enum as SQLEnum,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


# ---------------------------------------------------------------------
# ENUMS
# ---------------------------------------------------------------------

class AuditEventType(str, Enum):
    LOAN = "LOAN"
    WALLET = "WALLET"
    POLICY = "POLICY"
    SECURITY = "SECURITY"
    USER = "USER"
    SYSTEM = "SYSTEM"


# ---------------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------------

class AuditLog(Base):
    """
    Immutable audit history for governance operations.
    """

    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    event_type: Mapped[AuditEventType] = mapped_column(
        SQLEnum(AuditEventType),
        nullable=False
    )

    actor_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )

    resource_id: Mapped[str] = mapped_column(
        String(100),
        default=""
    )

    action: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    ip_address: Mapped[str] = mapped_column(
        String(45),
        default=""
    )

    user_agent: Mapped[str] = mapped_column(
        String(500),
        default=""
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )