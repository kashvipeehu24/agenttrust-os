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


class PaymentType(str, Enum):
    wallet = "wallet"
    escrow = "escrow"
    direct = "direct"
    refund = "refund"


class PaymentCreate(BaseModel):
    payment_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    type: PaymentType = PaymentType.wallet
    status: PaymentStatus = PaymentStatus.pending
    description: str = "Payment"


class PaymentUpdate(BaseModel):
    amount: Decimal | None = None
    type: PaymentType | None = None
    status: PaymentStatus | None = None
    description: str | None = None


class PaymentResponse(BaseModel):
    payment_id: str
    user_id: str
    wallet_id: str
    amount: Decimal
    type: PaymentType
    status: PaymentStatus
    description: str
    created_at: datetime
    updated_at: datetime
