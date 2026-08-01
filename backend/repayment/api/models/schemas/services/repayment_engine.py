from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional


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


@dataclass
class RepaymentPlan:
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
    monthly_payment: Decimal
    payment_status: RepaymentStatus
    payment_type: RepaymentType
    revenue_stream: Decimal
    revenue_delay_days: int
    created_at: datetime
    updated_at: datetime


@dataclass
class RepaymentForecast:
    repayment_id: str
    next_repayment: Decimal
    completion_date: date
    remaining_duration_days: int
    future_balance: Decimal
    projected_payment_status: RepaymentStatus
    adaptive_adjustment: str


class RepaymentEngine:
    """Repayment orchestration logic for the repayment monitoring module."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def calculate_interest(cls, total_loan: Decimal | int | float | str, interest_rate: Decimal | int | float | str) -> Decimal:
        amount = cls.money(total_loan)
        rate = cls.money(interest_rate)
        return cls.money(amount * (rate / Decimal("100")))

    @classmethod
    def create_plan(
        cls,
        repayment_id: str,
        user_id: str,
        wallet_id: str,
        total_loan: Decimal | int | float | str,
        interest_rate: Decimal | int | float | str,
        monthly_payment: Decimal | int | float | str,
        due_date: date,
        revenue_stream: Decimal | int | float | str = 0,
        revenue_delay_days: int = 0,
        payment_type: RepaymentType = RepaymentType.automatic,
    ) -> Dict[str, Any]:
        total_loan_value = cls.money(total_loan)
        interest = cls.calculate_interest(total_loan_value, interest_rate)
        monthly_payment_value = cls.money(monthly_payment)
        now = cls.utc_now()

        repayment = {
            "repayment_id": repayment_id,
            "user_id": user_id,
            "wallet_id": wallet_id,
            "total_loan": total_loan_value,
            "amount_paid": Decimal("0.00"),
            "remaining_amount": cls.money(total_loan_value + interest),
            "interest": interest,
            "interest_rate": cls.money(interest_rate),
            "due_date": due_date,
            "next_payment": monthly_payment_value,
            "monthly_payment": monthly_payment_value,
            "payment_status": RepaymentStatus.pending,
            "payment_type": payment_type,
            "revenue_stream": cls.money(revenue_stream),
            "revenue_delay_days": max(0, revenue_delay_days),
            "created_at": now,
            "updated_at": now,
        }
        return repayment

    @classmethod
    def calculate_next_payment(cls, plan: Dict[str, Any]) -> Decimal:
        base_payment = cls.money(plan.get("monthly_payment", Decimal("0.00")))
        revenue_delay_days = int(plan.get("revenue_delay_days", 0))
        if revenue_delay_days > 0:
            adjustment_factor = Decimal("1") - (Decimal(revenue_delay_days) / Decimal("30"))
            adjustment_factor = max(Decimal("0.30"), adjustment_factor)
            return cls.money(base_payment * adjustment_factor)
        return base_payment

    @classmethod
    def apply_payment(cls, plan: Dict[str, Any], amount: Decimal | int | float | str) -> Dict[str, Any]:
        amount = cls.money(amount)
        remaining = cls.money(plan.get("remaining_amount", Decimal("0.00")))
        if amount <= 0:
            raise ValueError("Payment amount must be greater than zero")

        effective_payment = min(amount, remaining)
        plan["amount_paid"] = cls.money(plan.get("amount_paid", Decimal("0.00")) + effective_payment)
        plan["remaining_amount"] = cls.money(remaining - effective_payment)
        plan["updated_at"] = cls.utc_now()
        plan["next_payment"] = cls.calculate_next_payment(plan)

        if plan["remaining_amount"] <= 0:
            plan["payment_status"] = RepaymentStatus.completed
        elif plan["due_date"] < date.today():
            plan["payment_status"] = RepaymentStatus.overdue
        else:
            plan["payment_status"] = RepaymentStatus.processing

        return plan

    @classmethod
    def partial_repayment(cls, plan: Dict[str, Any], amount: Decimal | int | float | str) -> Dict[str, Any]:
        amount = cls.money(amount)
        if amount > cls.money(plan.get("remaining_amount", Decimal("0.00"))):
            raise ValueError("Partial repayment cannot exceed the remaining amount")
        return cls.apply_payment(plan, amount)

    @classmethod
    def milestone_payment(cls, plan: Dict[str, Any], milestone_amount: Decimal | int | float | str) -> Dict[str, Any]:
        milestone_amount = cls.money(milestone_amount)
        if milestone_amount > cls.money(plan.get("remaining_amount", Decimal("0.00"))):
            raise ValueError("Milestone payment cannot exceed the remaining balance")
        return cls.apply_payment(plan, milestone_amount)

    @classmethod
    def generate_forecast(cls, plan: Dict[str, Any]) -> RepaymentForecast:
        next_repayment = cls.calculate_next_payment(plan)
        remaining_days = max((plan["due_date"] - date.today()).days, 1)
        future_balance = cls.money(plan.get("remaining_amount", Decimal("0.00")) - next_repayment)
        projected_status = RepaymentStatus.completed if future_balance <= 0 else RepaymentStatus.processing
        adaptive_adjustment = (
            "Revenue delay detected; repayment schedule adjusted automatically to preserve liquidity."
            if int(plan.get("revenue_delay_days", 0)) > 0
            else "Cash flow stable; repayment remains on schedule."
        )

        return RepaymentForecast(
            repayment_id=str(plan["repayment_id"]),
            next_repayment=next_repayment,
            completion_date=plan["due_date"],
            remaining_duration_days=remaining_days,
            future_balance=future_balance,
            projected_payment_status=projected_status,
            adaptive_adjustment=adaptive_adjustment,
        )

    @classmethod
    def build_suggestions(cls, plan: Dict[str, Any]) -> List[str]:
        suggestions: List[str] = []
        revenue_stream = cls.money(plan.get("revenue_stream", Decimal("0.00")))
        monthly_payment = cls.money(plan.get("monthly_payment", Decimal("0.00")))

        if revenue_stream < monthly_payment:
            suggestions.append("Revenue is below the plan threshold. Reduce discretionary spend and apply partial repayment when possible.")

        if cls.money(plan.get("remaining_amount", Decimal("0.00"))) > monthly_payment * Decimal("2"):
            suggestions.append("Early repayment is viable when revenue improves. Consider paying ahead to reduce interest cost.")

        suggestions.append("Keep repayment aligned with revenue timing and escrow release cycles for a safer cash flow profile.")
        return suggestions

    @classmethod
    def repayment_status_summary(cls, plan: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "repayment_id": plan["repayment_id"],
            "user_id": plan["user_id"],
            "wallet_id": plan["wallet_id"],
            "total_loan": plan["total_loan"],
            "amount_paid": plan["amount_paid"],
            "remaining_amount": plan["remaining_amount"],
            "interest": plan["interest"],
            "due_date": plan["due_date"],
            "next_payment": plan["next_payment"],
            "payment_status": plan["payment_status"],
            "can_repay_automatically": cls.money(plan.get("remaining_amount", Decimal("0.00"))) > 0,
            "payment_type": plan["payment_type"],
        }


__all__ = [
    "RepaymentEngine",
    "RepaymentPlan",
    "RepaymentForecast",
    "RepaymentStatus",
    "RepaymentType",
]
