from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import Column, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import relationship

from .base import Base


class CashFlow(Base):
    __tablename__ = "cash_flows"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=False)
    wallet_id = Column(String, ForeignKey("wallets.id"), nullable=False, index=True)
    revenue = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    expenses = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    repayments = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    available_balance = Column(Numeric(precision=18, scale=2), default=Decimal("0.00"), nullable=False)
    trend_label = Column(String, default="stable", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    wallet = relationship("Wallet", back_populates="cash_flows")
