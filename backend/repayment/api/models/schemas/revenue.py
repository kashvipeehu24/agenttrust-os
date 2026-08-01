from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


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


class RevenueCreate(BaseModel):
    revenue_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    source: RevenueSource = RevenueSource.task_completion
    source_name: str = "Task payout"
    timeline: str | None = None
    status: RevenueStatus = RevenueStatus.pending


class RevenueUpdate(BaseModel):
    amount: Decimal | None = None
    source: RevenueSource | None = None
    source_name: str | None = None
    timeline: str | None = None
    status: RevenueStatus | None = None


class RevenueResponse(BaseModel):
    revenue_id: str
    user_id: str
    wallet_id: str
    amount: Decimal
    source: RevenueSource
    source_name: str
    timeline: str
    status: RevenueStatus
    created_at: datetime
    updated_at: datetime


class RevenueSummary(BaseModel):
    user_id: str
    wallet_id: str
    revenue_earned: Decimal
    pending_revenue: Decimal
    total_earnings: Decimal
    source_breakdown: dict[str, Decimal]
    timeline: list[str]
