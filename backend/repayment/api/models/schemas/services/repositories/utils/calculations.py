from __future__ import annotations

from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, Iterable, List, Optional


def money(value: Decimal | int | float | str) -> Decimal:
    amount = Decimal(str(value))
    return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def add_money(values: Iterable[Decimal | int | float | str]) -> Decimal:
    return money(sum((Decimal(str(value)) for value in values), Decimal("0.00")))


def subtract_money(a: Decimal | int | float | str, b: Decimal | int | float | str) -> Decimal:
    return money(Decimal(str(a)) - Decimal(str(b)))


def percent_of(value: Decimal | int | float | str, percentage: Decimal | int | float | str) -> Decimal:
    return money(Decimal(str(value)) * (Decimal(str(percentage)) / Decimal("100")))


def safe_min(a: Decimal | int | float | str, b: Decimal | int | float | str) -> Decimal:
    return money(min(Decimal(str(a)), Decimal(str(b))))


def safe_max(a: Decimal | int | float | str, b: Decimal | int | float | str) -> Decimal:
    return money(max(Decimal(str(a)), Decimal(str(b))))


def calculate_credit_available(credit_limit: Decimal | int | float | str, loan_outstanding: Decimal | int | float | str) -> Decimal:
    return money(max(Decimal("0.00"), Decimal(str(credit_limit)) - Decimal(str(loan_outstanding))))


def calculate_interest(total_loan: Decimal | int | float | str, interest_rate: Decimal | int | float | str) -> Decimal:
    return money(Decimal(str(total_loan)) * (Decimal(str(interest_rate)) / Decimal("100")))


def calculate_remaining_amount(total_loan: Decimal | int | float | str, amount_paid: Decimal | int | float | str, interest: Decimal | int | float | str) -> Decimal:
    return money((Decimal(str(total_loan)) + Decimal(str(interest))) - Decimal(str(amount_paid)))


def calculate_next_payment(monthly_payment: Decimal | int | float | str, revenue_delay_days: int = 0) -> Decimal:
    base = Decimal(str(monthly_payment))
    if revenue_delay_days <= 0:
        return money(base)
    factor = Decimal("1") - (Decimal(revenue_delay_days) / Decimal("30"))
    factor = max(Decimal("0.30"), factor)
    return money(base * factor)


def summarize_cashflow(revenue: Decimal | int | float | str, expenses: Decimal | int | float | str, repayments: Decimal | int | float | str) -> Dict[str, Decimal]:
    revenue_value = Decimal(str(revenue))
    expenses_value = Decimal(str(expenses))
    repayments_value = Decimal(str(repayments))
    available_balance = revenue_value - expenses_value - repayments_value
    return {
        "revenue": money(revenue_value),
        "expenses": money(expenses_value),
        "repayments": money(repayments_value),
        "available_balance": money(available_balance),
    }


__all__ = [
    "money",
    "add_money",
    "subtract_money",
    "percent_of",
    "safe_min",
    "safe_max",
    "calculate_credit_available",
    "calculate_interest",
    "calculate_remaining_amount",
    "calculate_next_payment",
    "summarize_cashflow",
]
