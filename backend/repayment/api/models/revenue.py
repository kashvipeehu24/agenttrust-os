from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class RevenueStatus(str, Enum):
    pending = "pending"
    earned = "earned"
    processed = "processed"
    failed = "failed"


class RevenueSource(str, Enum):
    task_completion = "task_completion"
    subscription = "subscription"
    milestone = "milestone"
    referral = "referral"
    commission = "commission"
    other = "other"


class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    wallet_id = Column(String, ForeignKey("wallets.id"), nullable=False, index=True)
    amount = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    source = Column(Enum(RevenueSource), default=RevenueSource.task_completion, nullable=False)
    source_name = Column(String, default="Task payout", nullable=False)
    timeline = Column(String, default="pending", nullable=False)
    status = Column(Enum(RevenueStatus), default=RevenueStatus.pending, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    wallet = relationship("Wallet", back_populates="revenues")
