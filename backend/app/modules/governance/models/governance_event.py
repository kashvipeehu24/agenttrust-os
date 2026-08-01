"""
Governance Event Model

Stores high-level governance events occurring throughout the
lifecycle of autonomous AI agents. These events provide an
overall history of policy decisions, emergency actions,
repayments, contract interactions, and governance workflows.
"""

from datetime import datetime
from enum import Enum
import uuid

from sqlalchemy import (
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

class GovernanceEventType(str, Enum):
    POLICY_CREATED = "POLICY_CREATED"
    POLICY_UPDATED = "POLICY_UPDATED"
    POLICY_DELETED = "POLICY_DELETED"

    LOAN_CREATED = "LOAN_CREATED"
    LOAN_APPROVED = "LOAN_APPROVED"
    LOAN_REPAID = "LOAN_REPAID"

    ESCROW_CREATED = "ESCROW_CREATED"
    ESCROW_RELEASED = "ESCROW_RELEASED"

    KILL_SWITCH = "KILL_SWITCH"

    ALERT_GENERATED = "ALERT_GENERATED"

    FRAUD_DETECTED = "FRAUD_DETECTED"

    WALLET_FROZEN = "WALLET_FROZEN"

    CONTRACT_EXECUTED = "CONTRACT_EXECUTED"


class GovernanceStatus(str, Enum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    PENDING = "PENDING"


# ---------------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------------

class GovernanceEvent(Base):
    """
    Stores major governance lifecycle events.
    """

    __tablename__ = "governance_events"

    # Primary Key
    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    # Agent Information
    agent_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )

    # Event Information
    event_type: Mapped[GovernanceEventType] = mapped_column(
        SQLEnum(GovernanceEventType),
        nullable=False
    )

    status: Mapped[GovernanceStatus] = mapped_column(
        SQLEnum(GovernanceStatus),
        default=GovernanceStatus.SUCCESS
    )

    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False
    )

    description: Mapped[str] = mapped_column(
        String(1000),
        nullable=False
    )

    reference_id: Mapped[str] = mapped_column(
        String(100),
        default=""
    )

    blockchain_tx_hash: Mapped[str] = mapped_column(
        String(100),
        default=""
    )

    amount: Mapped[float] = mapped_column(
        Float,
        default=0.0
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )