from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional


class PaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class TransactionType(str, Enum):
    credit_received = "credit_received"
    payment = "payment"
    escrow_release = "escrow_release"
    revenue = "revenue"
    repayment = "repayment"
    refund = "refund"


@dataclass
class TransactionRecord:
    transaction_id: str
    wallet_id: str
    user_id: str
    type: TransactionType
    amount: Decimal
    status: PaymentStatus
    description: str
    created_at: datetime
    balance_after: Decimal


class TransactionService:
    """Transaction log and status tracking for repayment flows."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def create_transaction(
        cls,
        transaction_id: str,
        wallet_id: str,
        user_id: str,
        type: TransactionType,
        amount: Decimal | int | float | str,
        status: PaymentStatus = PaymentStatus.pending,
        description: str = "Transaction",
        balance_after: Decimal | int | float | str = 0,
    ) -> Dict[str, Any]:
        now = cls.utc_now()
        return {
            "transaction_id": transaction_id,
            "wallet_id": wallet_id,
            "user_id": user_id,
            "type": type,
            "amount": cls.money(amount),
            "status": status,
            "description": description,
            "created_at": now,
            "balance_after": cls.money(balance_after),
        }

    @classmethod
    def mark_completed(cls, transaction: Dict[str, Any]) -> Dict[str, Any]:
        transaction["status"] = PaymentStatus.completed
        return transaction

    @classmethod
    def mark_processing(cls, transaction: Dict[str, Any]) -> Dict[str, Any]:
        transaction["status"] = PaymentStatus.processing
        return transaction

    @classmethod
    def mark_failed(cls, transaction: Dict[str, Any]) -> Dict[str, Any]:
        transaction["status"] = PaymentStatus.failed
        return transaction

    @classmethod
    def filter_transactions(
        cls,
        transactions: List[Dict[str, Any]],
        wallet_id: Optional[str] = None,
        user_id: Optional[str] = None,
        status: Optional[PaymentStatus] = None,
        type: Optional[TransactionType] = None,
    ) -> List[Dict[str, Any]]:
        filtered = list(transactions)

        if wallet_id is not None:
            filtered = [item for item in filtered if str(item.get("wallet_id")) == wallet_id]
        if user_id is not None:
            filtered = [item for item in filtered if str(item.get("user_id")) == user_id]
        if status is not None:
            filtered = [item for item in filtered if item.get("status") == status]
        if type is not None:
            filtered = [item for item in filtered if item.get("type") == type]

        return filtered

    @classmethod
    def summarize_by_type(cls, transactions: List[Dict[str, Any]]) -> Dict[str, Decimal]:
        result: Dict[str, Decimal] = {}
        for item in transactions:
            key = str(item.get("type"))
            amount = cls.money(item.get("amount", Decimal("0.00")))
            result[key] = cls.money(result.get(key, Decimal("0.00")) + amount)
        return result


__all__ = [
    "TransactionService",
    "TransactionRecord",
    "PaymentStatus",
    "TransactionType",
]
