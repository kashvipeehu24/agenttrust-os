from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class EscrowStatus(str, PyEnum):
    pending = "pending"
    active = "active"
    locked = "locked"
    released = "released"
    cancelled = "cancelled"
    failed = "failed"


class EscrowTrigger(str, PyEnum):
    task_start = "task_start"
    milestone_reached = "milestone_reached"
    task_completed = "task_completed"
    manual = "manual"


class Escrow(Base):
    __tablename__ = "escrows"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    wallet_id = Column(String, ForeignKey("wallets.id"), nullable=False, index=True)
    amount = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    status = Column(SQLEnum(EscrowStatus), default=EscrowStatus.locked, nullable=False)
    trigger = Column(SQLEnum(EscrowTrigger), default=EscrowTrigger.task_start, nullable=False)
    milestone_name = Column(String, nullable=True)
    task_reference = Column(String, nullable=True)
    release_condition = Column(String, default="task_completed", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    wallet = relationship("Wallet", back_populates="escrows")

 