"""
Wallet Activity Model

Tracks all wallet activities performed by autonomous AI agents.
Used for live monitoring, fraud detection, audit history,
risk analysis, and governance enforcement.
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

class WalletActivityType(str, Enum):
    CREDIT = "CREDIT"
    DEBIT = "DEBIT"
    LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT"
    REPAYMENT = "REPAYMENT"
    ESCROW_LOCK = "ESCROW_LOCK"
    ESCROW_RELEASE = "ESCROW_RELEASE"


class WalletStatus(str, Enum):
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    PENDING = "PENDING"
    BLOCKED = "BLOCKED"


class RiskLevel(str, Enum):
    GREEN = "GREEN"
    YELLOW = "YELLOW"
    ORANGE = "ORANGE"
    RED = "RED"
    CRITICAL = "CRITICAL"


# ---------------------------------------------------------------------
# MODEL
# ---------------------------------------------------------------------

class WalletActivity(Base):
    """
    Stores every wallet transaction performed by an AI agent.
    """

    __tablename__ = "wallet_activity"

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

    wallet_address: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True
    )

    # Transaction Details
    transaction_hash: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    activity_type: Mapped[WalletActivityType] = mapped_column(
        SQLEnum(WalletActivityType),
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    balance_after_transaction: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    # Status
    status: Mapped[WalletStatus] = mapped_column(
        SQLEnum(WalletStatus),
        default=WalletStatus.SUCCESS
    )

    # Risk
    risk_level: Mapped[RiskLevel] = mapped_column(
        SQLEnum(RiskLevel),
        default=RiskLevel.GREEN
    )

    # Metadata
    description: Mapped[str] = mapped_column(
        String(500),
        default=""
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )