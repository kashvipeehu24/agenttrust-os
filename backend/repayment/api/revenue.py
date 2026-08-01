from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/revenues", tags=["Revenue"])


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


class RevenueCreateRequest(BaseModel):
    revenue_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    source: RevenueSource = RevenueSource.task_completion
    source_name: str = "Task payout"
    timeline: Optional[str] = None
    status: RevenueStatus = RevenueStatus.pending


class RevenueUpdateRequest(BaseModel):
    amount: Optional[Decimal] = None
    source: Optional[RevenueSource] = None
    source_name: Optional[str] = None
    timeline: Optional[str] = None
    status: Optional[RevenueStatus] = None


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
    source_breakdown: Dict[str, Decimal]
    timeline: List[str]


REVENUE_STORE: Dict[str, Dict[str, object]] = {}


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _get_revenue_or_404(revenue_id: str) -> Dict[str, object]:
    revenue = REVENUE_STORE.get(revenue_id)
    if revenue is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Revenue entry not found")
    return revenue


def _serialize_revenue(revenue: Dict[str, object]) -> RevenueResponse:
    return RevenueResponse(
        revenue_id=str(revenue["revenue_id"]),
        user_id=str(revenue["user_id"]),
        wallet_id=str(revenue["wallet_id"]),
        amount=_money(revenue["amount"]),
        source=revenue["source"],
        source_name=str(revenue["source_name"]),
        timeline=str(revenue.get("timeline", "pending")),
        status=revenue["status"],
        created_at=revenue["created_at"],
        updated_at=revenue["updated_at"],
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_revenue(payload: RevenueCreateRequest) -> RevenueResponse:
    if payload.revenue_id in REVENUE_STORE:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Revenue ID already exists")

    now = _utc_now()
    revenue = {
        "revenue_id": payload.revenue_id,
        "user_id": payload.user_id,
        "wallet_id": payload.wallet_id,
        "amount": _money(payload.amount),
        "source": payload.source,
        "source_name": payload.source_name,
        "timeline": payload.timeline or "pending",
        "status": payload.status,
        "created_at": now,
        "updated_at": now,
    }
    REVENUE_STORE[payload.revenue_id] = revenue

    return _serialize_revenue(revenue)


@router.get("/{revenue_id}")
async def get_revenue(revenue_id: str) -> RevenueResponse:
    return _serialize_revenue(_get_revenue_or_404(revenue_id))


@router.get("")
async def list_revenues(
    user_id: Optional[str] = Query(default=None),
    status: Optional[RevenueStatus] = Query(default=None),
    source: Optional[RevenueSource] = Query(default=None),
) -> List[RevenueResponse]:
    items = list(REVENUE_STORE.values())

    if user_id is not None:
        items = [item for item in items if str(item["user_id"]) == user_id]
    if status is not None:
        items = [item for item in items if item["status"] == status]
    if source is not None:
        items = [item for item in items if item["source"] == source]

    return [_serialize_revenue(item) for item in items]


@router.patch("/{revenue_id}")
async def update_revenue(revenue_id: str, payload: RevenueUpdateRequest) -> RevenueResponse:
    revenue = _get_revenue_or_404(revenue_id)

    if payload.amount is not None:
        revenue["amount"] = _money(payload.amount)
    if payload.source is not None:
        revenue["source"] = payload.source
    if payload.source_name is not None:
        revenue["source_name"] = payload.source_name
    if payload.timeline is not None:
        revenue["timeline"] = payload.timeline
    if payload.status is not None:
        revenue["status"] = payload.status

    revenue["updated_at"] = _utc_now()
    return _serialize_revenue(revenue)


@router.post("/{revenue_id}/mark-earned")
async def mark_revenue_earned(revenue_id: str) -> RevenueResponse:
    revenue = _get_revenue_or_404(revenue_id)
    revenue["status"] = RevenueStatus.earned
    revenue["timeline"] = "earned"
    revenue["updated_at"] = _utc_now()
    return _serialize_revenue(revenue)


@router.post("/{revenue_id}/process")
async def process_revenue(revenue_id: str) -> RevenueResponse:
    revenue = _get_revenue_or_404(revenue_id)
    revenue["status"] = RevenueStatus.processed
    revenue["timeline"] = "processed"
    revenue["updated_at"] = _utc_now()
    return _serialize_revenue(revenue)


@router.get("/{user_id}/summary")
async def revenue_summary(user_id: str, wallet_id: Optional[str] = Query(default=None)) -> RevenueSummary:
    items = [item for item in REVENUE_STORE.values() if str(item["user_id"]) == user_id]
    if wallet_id:
        items = [item for item in items if str(item["wallet_id"]) == wallet_id]

    revenue_earned = sum((_money(item["amount"]) for item in items if item["status"] in {RevenueStatus.earned, RevenueStatus.processed}), Decimal("0.00"))
    pending_revenue = sum((_money(item["amount"]) for item in items if item["status"] == RevenueStatus.pending), Decimal("0.00"))
    total_earnings = _money(revenue_earned + pending_revenue)

    source_breakdown: Dict[str, Decimal] = {}
    for item in items:
        key = str(item["source"])
        source_breakdown[key] = _money(source_breakdown.get(key, Decimal("0.00")) + _money(item["amount"]))

    timeline = [str(item["timeline"]) for item in items if item.get("timeline")]

    return RevenueSummary(
        user_id=user_id,
        wallet_id=wallet_id or "",
        revenue_earned=_money(revenue_earned),
        pending_revenue=_money(pending_revenue),
        total_earnings=total_earnings,
        source_breakdown=source_breakdown,
        timeline=timeline,
    )


@router.get("/health")
async def revenue_health() -> Dict[str, str]:
    return {"status": "ok", "module": "revenue"}
