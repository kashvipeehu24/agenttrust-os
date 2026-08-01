from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


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


class CreateRepaymentPlan(BaseModel):
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    total_loan: Decimal = Field(..., gt=0)
    interest_rate: Decimal = Decimal("0.00")
    monthly_payment: Decimal = Field(..., gt=0)
    due_date: date
    revenue_stream: Decimal = Decimal("0.00")
    revenue_delay_days: int = 0
    payment_mode: PaymentMode = PaymentMode.wallet
    payment_type: RepaymentType = RepaymentType.automatic


class RepaymentUpdate(BaseModel):
    total_loan: Decimal | None = None
    interest_rate: Decimal | None = None
    monthly_payment: Decimal | None = None
    due_date: date | None = None
    revenue_stream: Decimal | None = None
    revenue_delay_days: int | None = None
    payment_mode: PaymentMode | None = None
    payment_type: RepaymentType | None = None
    payment_status: RepaymentStatus | None = None


class RepaymentResponse(BaseModel):
    repayment_id: str
    user_id: str
    wallet_id: str
    total_loan: Decimal
    amount_paid: Decimal
    remaining_amount: Decimal
    interest: Decimal
    interest_rate: Decimal
    due_date: date
    next_payment: Decimal
    payment_status: RepaymentStatus
    payment_mode: PaymentMode
    payment_type: RepaymentType
    revenue_stream: Decimal
    revenue_delay_days: int
    created_at: datetime
    updated_at: datetime


class RepaymentForecast(BaseModel):
    repayment_id: str
    next_repayment: Decimal
    completion_date: date
    remaining_duration_days: int
    future_balance: Decimal
    projected_payment_status: RepaymentStatus
    adaptive_adjustment: str


class RepaymentSuggestion(BaseModel):
    repayment_id: str
    recommendation: str
    confidence: Decimal
    suggested_action: str
    impact: str
 