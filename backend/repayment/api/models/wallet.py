from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    currency = Column(String, default="USD", nullable=False)
    balance = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    credit_limit = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    loan_outstanding = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    total_revenue = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    pending_revenue = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    amount_repaid = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    transactions = relationship("Transaction", back_populates="wallet", cascade="all, delete-orphan")
    repayments = relationship("Repayment", back_populates="wallet", cascade="all, delete-orphan")
    revenues = relationship("Revenue", back_populates="wallet", cascade="all, delete-orphan")
    escrows = relationship("Escrow", back_populates="wallet", cascade="all, delete-orphan")
