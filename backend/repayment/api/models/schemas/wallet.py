from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class PaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class WalletCreate(BaseModel):
    user_id: str = Field(..., min_length=1)
    currency: str = "USD"
    initial_balance: Decimal = Decimal("0.00")
    credit_limit: Decimal = Decimal("0.00")
    loan_outstanding: Decimal = Decimal("0.00")


class WalletUpdate(BaseModel):
    currency: str | None = None
    initial_balance: Decimal | None = None
    credit_limit: Decimal | None = None
    loan_outstanding: Decimal | None = None
    balance: Decimal | None = None
    total_revenue: Decimal | None = None
    pending_revenue: Decimal | None = None
    amount_repaid: Decimal | None = None
    is_active: bool | None = None


class WalletResponse(BaseModel):
    id: str
    user_id: str
    currency: str
    balance: Decimal
    credit_limit: Decimal
    loan_outstanding: Decimal
    total_revenue: Decimal
    pending_revenue: Decimal
    amount_repaid: Decimal
    is_active: bool
    payment_status: PaymentStatus = PaymentStatus.completed
    created_at: datetime
    updated_at: datetime


class WalletSummary(BaseModel):
    wallet_id: str
    user_id: str
    currency: str
    balance: Decimal
    credit_available: Decimal
    loan_outstanding: Decimal
    total_revenue: Decimal
    amount_repaid: Decimal
    pending_revenue: Decimal
    total_earnings: Decimal
    payment_status: PaymentStatus = PaymentStatus.completed
    last_updated: datetime
