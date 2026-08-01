from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List


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


@dataclass
class RevenueEntry:
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


class RevenueService:
    """Revenue tracking and summary logic for the repayment module."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def create_revenue(
        cls,
        revenue_id: str,
        user_id: str,
        wallet_id: str,
        amount: Decimal | int | float | str,
        source: RevenueSource = RevenueSource.task_completion,
        source_name: str = "Task payout",
        timeline: str = "pending",
        status: RevenueStatus = RevenueStatus.pending,
    ) -> Dict[str, Any]:
        now = cls.utc_now()
        return {
            "revenue_id": revenue_id,
            "user_id": user_id,
            "wallet_id": wallet_id,
            "amount": cls.money(amount),
            "source": source,
            "source_name": source_name,
            "timeline": timeline,
            "status": status,
            "created_at": now,
            "updated_at": now,
        }

    @classmethod
    def mark_earned(cls, revenue: Dict[str, Any]) -> Dict[str, Any]:
        revenue["status"] = RevenueStatus.earned
        revenue["timeline"] = "earned"
        revenue["updated_at"] = cls.utc_now()
        return revenue

    @classmethod
    def process_revenue(cls, revenue: Dict[str, Any]) -> Dict[str, Any]:
        revenue["status"] = RevenueStatus.processed
        revenue["timeline"] = "processed"
        revenue["updated_at"] = cls.utc_now()
        return revenue

    @classmethod
    def summarize(cls, revenues: List[Dict[str, Any]], user_id: str, wallet_id: str | None = None) -> Dict[str, Any]:
        filtered = [item for item in revenues if item.get("user_id") == user_id]
        if wallet_id:
            filtered = [item for item in filtered if item.get("wallet_id") == wallet_id]

        revenue_earned = sum((cls.money(item["amount"]) for item in filtered if item.get("status") in {RevenueStatus.earned, RevenueStatus.processed}), Decimal("0.00"))
        pending_revenue = sum((cls.money(item["amount"]) for item in filtered if item.get("status") == RevenueStatus.pending), Decimal("0.00"))
        total_earnings = cls.money(revenue_earned + pending_revenue)

        source_breakdown: Dict[str, Decimal] = {}
        for item in filtered:
            key = str(item.get("source"))
            source_breakdown[key] = cls.money(source_breakdown.get(key, Decimal("0.00")) + cls.money(item.get("amount", Decimal("0.00"))))

        return {
            "user_id": user_id,
            "wallet_id": wallet_id or "",
            "revenue_earned": cls.money(revenue_earned),
            "pending_revenue": cls.money(pending_revenue),
            "total_earnings": total_earnings,
            "source_breakdown": source_breakdown,
            "timeline": [str(item.get("timeline", "pending")) for item in filtered],
        }

    @classmethod
    def status_for(cls, revenue: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "revenue_id": revenue["revenue_id"],
            "user_id": revenue["user_id"],
            "wallet_id": revenue["wallet_id"],
            "amount": revenue["amount"],
            "source": revenue["source"],
            "status": revenue["status"],
            "timeline": revenue.get("timeline", "pending"),
        }


__all__ = [
    "RevenueService",
    "RevenueStatus",
    "RevenueSource",
    "RevenueEntry",
]
