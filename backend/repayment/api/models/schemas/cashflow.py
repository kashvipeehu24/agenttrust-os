from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


class CashFlowCreate(BaseModel):
    cashflow_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    revenue: Decimal = Decimal("0.00")
    expenses: Decimal = Decimal("0.00")
    repayments: Decimal = Decimal("0.00")
    available_balance: Decimal = Decimal("0.00")
    trend_label: str = "stable"


class CashFlowUpdate(BaseModel):
    revenue: Decimal | None = None
    expenses: Decimal | None = None
    repayments: Decimal | None = None
    available_balance: Decimal | None = None
    trend_label: str | None = None


class CashFlowResponse(BaseModel):
    cashflow_id: str
    user_id: str
    wallet_id: str
    revenue: Decimal
    expenses: Decimal
    repayments: Decimal
    available_balance: Decimal
    trend_label: str
    created_at: datetime
    updated_at: datetime

