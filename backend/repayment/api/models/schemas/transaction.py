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


class TransactionType(str, Enum):
    credit_received = "credit_received"
    payment = "payment"
    escrow_release = "escrow_release"
    revenue = "revenue"
    repayment = "repayment"
    refund = "refund"


class TransactionCreate(BaseModel):
    transaction_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    type: TransactionType = TransactionType.payment
    amount: Decimal = Field(..., gt=0)
    status: PaymentStatus = PaymentStatus.pending
    description: str = "Transaction"
    balance_after: Decimal = Decimal("0.00")


class TransactionUpdate(BaseModel):
    type: TransactionType | None = None
    amount: Decimal | None = None
    status: PaymentStatus | None = None
    description: str | None = None
    balance_after: Decimal | None = None


class TransactionResponse(BaseModel):
    transaction_id: str
    wallet_id: str
    user_id: str
    type: TransactionType
    amount: Decimal
    status: PaymentStatus
    description: str
    created_at: datetime
    balance_after: Decimal
