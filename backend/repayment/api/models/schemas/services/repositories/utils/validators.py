from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict


def validate_positive_amount(value: Decimal | int | float | str, field_name: str = "amount") -> Decimal:
    amount = Decimal(str(value))
    if amount <= 0:
        raise ValueError(f"{field_name} must be greater than zero")
    return amount


def validate_wallet_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_fields = ["wallet_id", "user_id"]
    for field in required_fields:
        if not payload.get(field):
            raise ValueError(f"{field} is required")

    if "balance" in payload:
        validate_positive_amount(payload["balance"], "balance")
    return payload


def validate_repayment_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_fields = ["repayment_id", "wallet_id", "user_id", "total_loan", "monthly_payment"]
    for field in required_fields:
        if not payload.get(field):
            raise ValueError(f"{field} is required")

    validate_positive_amount(payload["total_loan"], "total_loan")
    validate_positive_amount(payload["monthly_payment"], "monthly_payment")
    return payload


def validate_escrow_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_fields = ["escrow_id", "wallet_id", "user_id", "amount"]
    for field in required_fields:
        if not payload.get(field):
            raise ValueError(f"{field} is required")

    validate_positive_amount(payload["amount"], "amount")
    return payload


def validate_revenue_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_fields = ["revenue_id", "wallet_id", "user_id", "amount"]
    for field in required_fields:
        if not payload.get(field):
            raise ValueError(f"{field} is required")

    validate_positive_amount(payload["amount"], "amount")
    return payload


def validate_transaction_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    required_fields = ["transaction_id", "wallet_id", "user_id", "amount"]
    for field in required_fields:
        if not payload.get(field):
            raise ValueError(f"{field} is required")

    validate_positive_amount(payload["amount"], "amount")
    return payload


__all__ = [
    "validate_positive_amount",
    "validate_wallet_payload",
    "validate_repayment_payload",
    "validate_escrow_payload",
    "validate_revenue_payload",
    "validate_transaction_payload",
]
