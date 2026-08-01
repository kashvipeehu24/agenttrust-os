from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Column, Date, DateTime, Enum, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class RepaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    overdue = "overdue"


class RepaymentType(str, Enum):
    automatic = "automatic"
    partial = "partial"
    milestone = "milestone"
    manual = "manual"


class PaymentMode(str, Enum):
    wallet = "wallet"
    escrow = "escrow"
    direct = "direct"


class Repayment(Base):
    __tablename__ = "repayments"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    wallet_id = Column(String, ForeignKey("wallets.id"), nullable=False, index=True)
    total_loan = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    amount_paid = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    remaining_amount = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    interest = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    interest_rate = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    due_date = Column(Date, nullable=False)
    next_payment = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    monthly_payment = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    payment_status = Column(Enum(RepaymentStatus), default=RepaymentStatus.pending, nullable=False)
    payment_mode = Column(Enum(PaymentMode), default=PaymentMode.wallet, nullable=False)
    payment_type = Column(Enum(RepaymentType), default=RepaymentType.automatic, nullable=False)
    revenue_stream = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    revenue_delay_days = Column(Numeric(precision=10, scale=0), default=0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    wallet = relationship("Wallet", back_populates="repayments")
