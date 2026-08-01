from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List


class ForecastStatus(str, Enum):
    stable = "stable"
    warning = "warning"
    critical = "critical"


@dataclass
class ForecastSummary:
    next_repayment: Decimal
    completion_date: date
    remaining_duration_days: int
    future_balance: Decimal
    projected_status: ForecastStatus
    adaptive_adjustment: str


class ForecastService:
    """Forecasting and cashflow prediction support for repayment planning."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def build_forecast(
        cls,
        next_repayment: Decimal | int | float | str,
        completion_date: date,
        remaining_duration_days: int,
        future_balance: Decimal | int | float | str,
        revenue_delay_days: int = 0,
    ) -> ForecastSummary:
        next_payment = cls.money(next_repayment)
        projected_balance = cls.money(future_balance)

        if projected_balance <= 0:
            projected_status = ForecastStatus.critical
        elif revenue_delay_days > 0:
            projected_status = ForecastStatus.warning
        else:
            projected_status = ForecastStatus.stable

        adaptive_adjustment = (
            "Revenue delay detected; schedule has been adjusted to preserve liquidity."
            if revenue_delay_days > 0
            else "Cash flow remains healthy; repayment can continue on schedule."
        )

        return ForecastSummary(
            next_repayment=next_payment,
            completion_date=completion_date,
            remaining_duration_days=max(0, remaining_duration_days),
            future_balance=projected_balance,
            projected_status=projected_status,
            adaptive_adjustment=adaptive_adjustment,
        )

    @classmethod
    def build_cashflow_trend(cls, revenue: Decimal | int | float | str, expenses: Decimal | int | float | str, repayments: Decimal | int | float | str) -> Dict[str, Any]:
        revenue_value = cls.money(revenue)
        expenses_value = cls.money(expenses)
        repayments_value = cls.money(repayments)
        available_balance = cls.money(revenue_value - expenses_value - repayments_value)

        status = ForecastStatus.stable if available_balance >= 0 else ForecastStatus.warning
        return {
            "revenue": revenue_value,
            "expenses": expenses_value,
            "repayments": repayments_value,
            "available_balance": available_balance,
            "status": status,
            "trend": "positive" if available_balance >= 0 else "negative",
        }

    @classmethod
    def suggest_actions(cls, forecast: ForecastSummary) -> List[str]:
        actions: List[str] = []

        if forecast.projected_status == ForecastStatus.critical:
            actions.append("Reduce discretionary spending and prioritize repayment to avoid default risk.")
        elif forecast.projected_status == ForecastStatus.warning:
            actions.append("Delay non-essential payouts and trigger adaptive repayment scheduling.")
        else:
            actions.append("Maintain current schedule and preserve liquidity for upcoming repayments.")

        if forecast.future_balance > 0:
            actions.append("Keep a cash buffer for the next repayment cycle and avoid unplanned repayments.")

        return actions


__all__ = [
    "ForecastService",
    "ForecastSummary",
    "ForecastStatus",
]
