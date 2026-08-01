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
class WalletSnapshot:
    wallet_id: str
    user_id: str
    currency: str
    balance: Decimal
    credit_available: Decimal
    loan_outstanding: Decimal
    total_revenue: Decimal
    amount_repaid: Decimal
    pending_revenue: Decimal
    total_earnings: Decimal
    payment_status: PaymentStatus
    last_updated: datetime


class WalletService:
    """Core wallet operations for the repayment and monitoring module."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def create_wallet(
        cls,
        wallet_id: str,
        user_id: str,
        currency: str = "USD",
        initial_balance: Decimal | int | float | str = 0,
        credit_limit: Decimal | int | float | str = 0,
        loan_outstanding: Decimal | int | float | str = 0,
    ) -> Dict[str, Any]:
        wallet = {
            "wallet_id": wallet_id,
            "user_id": user_id,
            "currency": currency,
            "balance": cls.money(initial_balance),
            "credit_limit": cls.money(credit_limit),
            "loan_outstanding": cls.money(loan_outstanding),
            "total_revenue": Decimal("0.00"),
            "pending_revenue": Decimal("0.00"),
            "amount_repaid": Decimal("0.00"),
            "payment_status": PaymentStatus.completed,
            "last_updated": cls.utc_now(),
        }
        return wallet

    @classmethod
    def calculate_credit_available(cls, wallet: Dict[str, Any]) -> Decimal:
        credit_limit = cls.money(wallet.get("credit_limit", Decimal("0.00")))
        loan_outstanding = cls.money(wallet.get("loan_outstanding", Decimal("0.00")))
        return max(Decimal("0.00"), credit_limit - loan_outstanding)

    @classmethod
    def build_snapshot(cls, wallet: Dict[str, Any]) -> WalletSnapshot:
        balance = cls.money(wallet.get("balance", Decimal("0.00")))
        loan_outstanding = cls.money(wallet.get("loan_outstanding", Decimal("0.00")))
        total_revenue = cls.money(wallet.get("total_revenue", Decimal("0.00")))
        pending_revenue = cls.money(wallet.get("pending_revenue", Decimal("0.00")))
        amount_repaid = cls.money(wallet.get("amount_repaid", Decimal("0.00")))
        credit_available = cls.calculate_credit_available(wallet)

        return WalletSnapshot(
            wallet_id=str(wallet["wallet_id"]),
            user_id=str(wallet["user_id"]),
            currency=str(wallet.get("currency", "USD")),
            balance=balance,
            credit_available=credit_available,
            loan_outstanding=loan_outstanding,
            total_revenue=total_revenue,
            amount_repaid=amount_repaid,
            pending_revenue=pending_revenue,
            total_earnings=cls.money(total_revenue + pending_revenue),
            payment_status=wallet.get("payment_status", PaymentStatus.completed),
            last_updated=wallet.get("last_updated", cls.utc_now()),
        )

    @classmethod
    def credit_wallet(
        cls,
        wallet: Dict[str, Any],
        amount: Decimal | int | float | str,
        source: str = "manual_credit",
        description: str = "Wallet credit",
    ) -> Dict[str, Any]:
        amount = cls.money(amount)
        if amount <= 0:
            raise ValueError("Credit amount must be greater than zero")

        wallet["balance"] = cls.money(wallet.get("balance", Decimal("0.00")) + amount)
        wallet["total_revenue"] = cls.money(wallet.get("total_revenue", Decimal("0.00")) + amount)
        wallet["payment_status"] = PaymentStatus.completed
        wallet["last_updated"] = cls.utc_now()

        return {
            "wallet": wallet,
            "transaction": {
                "type": TransactionType.credit_received,
                "amount": amount,
                "status": PaymentStatus.completed,
                "source": source,
                "description": description,
                "balance_after": wallet["balance"],
                "created_at": wallet["last_updated"],
            },
        }

    @classmethod
    def debit_wallet(
        cls,
        wallet: Dict[str, Any],
        amount: Decimal | int | float | str,
        source: str = "manual_debit",
        description: str = "Wallet debit",
    ) -> Dict[str, Any]:
        amount = cls.money(amount)
        if amount <= 0:
            raise ValueError("Debit amount must be greater than zero")

        current_balance = cls.money(wallet.get("balance", Decimal("0.00")))
        if amount > current_balance:
            raise ValueError("Insufficient wallet balance")

        wallet["balance"] = cls.money(current_balance - amount)
        wallet["payment_status"] = PaymentStatus.completed
        wallet["last_updated"] = cls.utc_now()

        return {
            "wallet": wallet,
            "transaction": {
                "type": TransactionType.payment,
                "amount": amount,
                "status": PaymentStatus.completed,
                "source": source,
                "description": description,
                "balance_after": wallet["balance"],
                "created_at": wallet["last_updated"],
            },
        }

    @classmethod
    def lock_escrow_funds(
        cls,
        wallet: Dict[str, Any],
        amount: Decimal | int | float | str,
        escrow_id: str,
        milestone: str = "task_start",
    ) -> Dict[str, Any]:
        amount = cls.money(amount)
        current_balance = cls.money(wallet.get("balance", Decimal("0.00")))
        if amount > current_balance:
            raise ValueError("Insufficient balance to lock escrow funds")

        wallet["balance"] = cls.money(current_balance - amount)
        wallet["payment_status"] = PaymentStatus.processing
        wallet["last_updated"] = cls.utc_now()

        return {
            "wallet": wallet,
            "transaction": {
                "type": TransactionType.payment,
                "amount": amount,
                "status": PaymentStatus.processing,
                "source": "escrow_lock",
                "description": f"Escrow locked for {escrow_id} ({milestone})",
                "balance_after": wallet["balance"],
                "created_at": wallet["last_updated"],
            },
        }

    @classmethod
    def release_escrow_funds(
        cls,
        wallet: Dict[str, Any],
        amount: Decimal | int | float | str,
        escrow_id: str,
        milestone: str = "task_completed",
    ) -> Dict[str, Any]:
        amount = cls.money(amount)
        wallet["balance"] = cls.money(wallet.get("balance", Decimal("0.00")) + amount)
        wallet["payment_status"] = PaymentStatus.completed
        wallet["last_updated"] = cls.utc_now()

        return {
            "wallet": wallet,
            "transaction": {
                "type": TransactionType.escrow_release,
                "amount": amount,
                "status": PaymentStatus.completed,
                "source": "escrow_release",
                "description": f"Escrow released for {escrow_id} ({milestone})",
                "balance_after": wallet["balance"],
                "created_at": wallet["last_updated"],
            },
        }

    @classmethod
    def process_repayment(
        cls,
        wallet: Dict[str, Any],
        amount: Decimal | int | float | str,
        source: str = "automatic_repayment",
        description: str = "Automatic repayment",
    ) -> Dict[str, Any]:
        amount = cls.money(amount)
        current_balance = cls.money(wallet.get("balance", Decimal("0.00")))

        if amount <= 0:
            raise ValueError("Repayment amount must be greater than zero")

        if amount > current_balance:
            wallet["payment_status"] = PaymentStatus.pending
            wallet["last_updated"] = cls.utc_now()
            return {
                "wallet": wallet,
                "repayment_allowed": False,
                "amount_requested": amount,
                "amount_processed": Decimal("0.00"),
                "remaining_balance": cls.money(amount - current_balance),
                "transaction": {
                    "type": TransactionType.repayment,
                    "amount": Decimal("0.00"),
                    "status": PaymentStatus.pending,
                    "source": source,
                    "description": description,
                    "balance_after": wallet["balance"],
                    "created_at": wallet["last_updated"],
                },
            }

        wallet["balance"] = cls.money(current_balance - amount)
        wallet["amount_repaid"] = cls.money(wallet.get("amount_repaid", Decimal("0.00")) + amount)
        wallet["loan_outstanding"] = cls.money(max(Decimal("0.00"), wallet.get("loan_outstanding", Decimal("0.00")) - amount))
        wallet["payment_status"] = PaymentStatus.completed
        wallet["last_updated"] = cls.utc_now()

        return {
            "wallet": wallet,
            "repayment_allowed": True,
            "amount_requested": amount,
            "amount_processed": amount,
            "remaining_balance": wallet["balance"],
            "transaction": {
                "type": TransactionType.repayment,
                "amount": amount,
                "status": PaymentStatus.completed,
                "source": source,
                "description": description,
                "balance_after": wallet["balance"],
                "created_at": wallet["last_updated"],
            },
        }

    @classmethod
    def can_repay_automatically(cls, wallet: Dict[str, Any], requested_amount: Decimal | int | float | str) -> bool:
        amount = cls.money(requested_amount)
        return cls.money(wallet.get("balance", Decimal("0.00"))) >= amount > 0

    @classmethod
    def update_after_transaction(
        cls,
        wallet: Dict[str, Any],
        delta: Decimal | int | float | str,
        transaction_type: TransactionType,
    ) -> Dict[str, Any]:
        delta = cls.money(delta)
        if transaction_type in {TransactionType.credit_received, TransactionType.escrow_release, TransactionType.revenue}:
            wallet["balance"] = cls.money(wallet.get("balance", Decimal("0.00")) + delta)
        elif transaction_type in {TransactionType.payment, TransactionType.repayment, TransactionType.refund}:
            wallet["balance"] = cls.money(wallet.get("balance", Decimal("0.00")) - delta)

        wallet["last_updated"] = cls.utc_now()
        wallet["payment_status"] = PaymentStatus.completed if wallet["balance"] >= 0 else PaymentStatus.pending
        return wallet

    @classmethod
    def get_wallet_status(cls, wallet: Dict[str, Any]) -> Dict[str, Any]:
        balance = cls.money(wallet.get("balance", Decimal("0.00")))
        status = wallet.get("payment_status", PaymentStatus.completed)
        return {
            "wallet_id": wallet["wallet_id"],
            "user_id": wallet["user_id"],
            "payment_status": status,
            "can_repay": balance > 0,
            "last_updated": wallet.get("last_updated", cls.utc_now()),
        }

    @classmethod
    def get_summary(cls, wallet: Dict[str, Any]) -> WalletSnapshot:
        return cls.build_snapshot(wallet)


__all__ = [
    "WalletService",
    "WalletSnapshot",
    "PaymentStatus",
    "TransactionType",
]
