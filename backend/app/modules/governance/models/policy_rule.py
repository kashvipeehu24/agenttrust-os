"""
Policy Rule Model

Stores governance policies applied to autonomous AI agents.
These rules define how an AI agent is allowed to use credit.
"""

from datetime import datetime
from enum import Enum
import uuid

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SQLEnum,
    Float,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base


# ---------------------------------------------------------------------
# ENUMS
# ---------------------------------------------------------------------

class PolicyStatus(str, Enum):
    ACTIVE = "ACTIVE"
    DISABLED = "DISABLED"
    EXPIRED = "EXPIRED"


# ---------------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------------

class PolicyRule(Base):
    """
    Stores spending and governance policies for AI agents.
    """

    __tablename__ = "policy_rules"

    # Primary Key
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    # Agent Identifier
    agent_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )

    # Spending Limits
    max_transaction_amount: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    daily_limit: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    monthly_limit: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    wallet_limit: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    # Governance Rules
    allowed_vendors: Mapped[str] = mapped_column(
        String(500),
        default=""
    )

    approved_apis: Mapped[str] = mapped_column(
        String(500),
        default=""
    )

    credit_restrictions: Mapped[str] = mapped_column(
        String(500),
        default=""
    )

    time_restrictions: Mapped[str] = mapped_column(
        String(200),
        default=""
    )

    # Status
    status: Mapped[PolicyStatus] = mapped_column(
        SQLEnum(PolicyStatus),
        default=PolicyStatus.ACTIVE
    )

    is_enabled: Mapped[bool] = mapped_column(
        Boolean,
        default=True
    )

    # Audit Fields
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )