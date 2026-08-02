from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum

from sqlalchemy import Column, DateTime, Enum as SQLEnum, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class TransactionType(str, PyEnum):
    credit_received = "credit_received"
    payment = "payment"
    escrow_release = "escrow_release"
    revenue = "revenue"
    repayment = "repayment"
    refund = "refund"


class PaymentStatus(str, PyEnum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    wallet_id = Column(String, ForeignKey("wallets.id"), nullable=False, index=True)
    user_id = Column(String, index=True, nullable=False)
    type = Column(SQLEnum(TransactionType), nullable=False)
    amount = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    description = Column(String, default="Transaction", nullable=False)
    balance_after = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    wallet = relationship("Wallet", back_populates="transactions")

