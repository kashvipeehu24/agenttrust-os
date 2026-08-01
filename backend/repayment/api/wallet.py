from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field

router = APIRouter(prefix="/wallets", tags=["Wallet"])


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


class WalletCreateRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    currency: str = "USD"
    initial_balance: Decimal = Decimal("0.00")
    credit_limit: Decimal = Decimal("0.00")
    loan_outstanding: Decimal = Decimal("0.00")


class WalletTransaction(BaseModel):
    transaction_id: str
    wallet_id: str
    user_id: str
    type: TransactionType
    amount: Decimal
    status: PaymentStatus
    description: str
    created_at: datetime
    balance_after: Decimal


class WalletSummary(BaseModel):
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
    payment_status: PaymentStatus = PaymentStatus.completed
    last_updated: datetime


class WalletTopUpRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    source: str = "manual_credit"
    description: str = "Wallet credit"


class WalletDebitRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    source: str = "manual_debit"
    description: str = "Wallet debit"


class WalletRepaymentRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    source: str = "automatic_repayment"
    description: str = "Scheduled repayment"


class WalletEscrowRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    escrow_id: str = Field(..., min_length=1)
    milestone: str = "task_start"


class WalletBalanceResponse(BaseModel):
    wallet_id: str
    user_id: str
    currency: str
    balance: Decimal
    credit_available: Decimal
    loan_outstanding: Decimal
    total_revenue: Decimal
    amount_repaid: Decimal
    payment_status: PaymentStatus
    last_updated: datetime


class WalletTransactionResponse(BaseModel):
    message: str
    transaction: WalletTransaction
    wallet: WalletBalanceResponse


class WalletRepaymentResponse(BaseModel):
    message: str
    repayment_allowed: bool
    amount_requested: Decimal
    amount_processed: Decimal
    remaining_balance: Decimal
    payment_status: PaymentStatus
    wallet: WalletBalanceResponse


model_config = ConfigDict(arbitrary_types_allowed=True)


def _to_money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


wallet_store: Dict[str, Dict[str, Any]] = {}
transaction_store: Dict[str, List[Dict[str, Any]]] = {}


def _get_wallet_or_404(wallet_id: str) -> Dict[str, Any]:
    wallet = wallet_store.get(wallet_id)
    if wallet is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Wallet not found")
    return wallet


def _build_wallet_snapshot(wallet: Dict[str, Any]) -> WalletBalanceResponse:
    balance = _to_money(wallet["balance"])
    credit_limit = _to_money(wallet["credit_limit"])
    loan_outstanding = _to_money(wallet["loan_outstanding"])
    total_revenue = _to_money(wallet["total_revenue"])
    amount_repaid = _to_money(wallet["amount_repaid"])
    credit_available = max(Decimal("0.00"), credit_limit - loan_outstanding)

    return WalletBalanceResponse(
        wallet_id=wallet["wallet_id"],
        user_id=wallet["user_id"],
        currency=wallet["currency"],
        balance=balance,
        credit_available=_to_money(credit_available),
        loan_outstanding=loan_outstanding,
        total_revenue=total_revenue,
        amount_repaid=amount_repaid,
        payment_status=wallet["payment_status"],
        last_updated=wallet["last_updated"],
    )


def _record_transaction(wallet: Dict[str, Any], tx_type: TransactionType, amount: Decimal, status: PaymentStatus, description: str) -> WalletTransaction:
    now = datetime.now(timezone.utc)
    transaction_id = f"tx_{len(transaction_store.get(wallet['wallet_id'], [])) + 1:06d}"
    transaction = {
        "transaction_id": transaction_id,
        "wallet_id": wallet["wallet_id"],
        "user_id": wallet["user_id"],
        "type": tx_type,
        "amount": _to_money(amount),
        "status": status,
        "description": description,
        "created_at": now,
        "balance_after": _to_money(wallet["balance"]),
    }
    transaction_store.setdefault(wallet["wallet_id"], []).append(transaction)

    return WalletTransaction(**transaction)


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_wallet(payload: WalletCreateRequest) -> WalletBalanceResponse:
    wallet_id = f"wallet_{payload.user_id}_{len(wallet_store) + 1}"

    wallet = {
        "wallet_id": wallet_id,
        "user_id": payload.user_id,
        "currency": payload.currency,
        "balance": _to_money(payload.initial_balance),
        "credit_limit": _to_money(payload.credit_limit),
        "loan_outstanding": _to_money(payload.loan_outstanding),
        "total_revenue": Decimal("0.00"),
        "pending_revenue": Decimal("0.00"),
        "amount_repaid": Decimal("0.00"),
        "payment_status": PaymentStatus.completed,
        "last_updated": datetime.now(timezone.utc),
    }

    wallet_store[wallet_id] = wallet
    transaction_store.setdefault(wallet_id, [])

    if payload.initial_balance > 0:
        _record_transaction(
            wallet,
            TransactionType.credit_received,
            payload.initial_balance,
            PaymentStatus.completed,
            "Initial wallet credit",
        )

    return _build_wallet_snapshot(wallet)


@router.get("/{wallet_id}")
async def get_wallet(wallet_id: str) -> WalletBalanceResponse:
    wallet = _get_wallet_or_404(wallet_id)
    return _build_wallet_snapshot(wallet)


@router.get("/{wallet_id}/summary")
async def get_wallet_summary(wallet_id: str) -> WalletSummary:
    wallet = _get_wallet_or_404(wallet_id)
    credit_available = max(Decimal("0.00"), _to_money(wallet["credit_limit"]) - _to_money(wallet["loan_outstanding"]))

    summary = WalletSummary(
        wallet_id=wallet["wallet_id"],
        user_id=wallet["user_id"],
        currency=wallet["currency"],
        balance=_to_money(wallet["balance"]),
        credit_available=_to_money(credit_available),
        loan_outstanding=_to_money(wallet["loan_outstanding"]),
        total_revenue=_to_money(wallet["total_revenue"]),
        amount_repaid=_to_money(wallet["amount_repaid"]),
        pending_revenue=_to_money(wallet["pending_revenue"]),
        total_earnings=_to_money(wallet["total_revenue"] + wallet["pending_revenue"]),
        payment_status=wallet["payment_status"],
        last_updated=wallet["last_updated"],
    )
    return summary


@router.post("/{wallet_id}/credit")
async def credit_wallet(wallet_id: str, payload: WalletTopUpRequest) -> WalletTransactionResponse:
    wallet = _get_wallet_or_404(wallet_id)
    wallet["balance"] = _to_money(wallet["balance"] + payload.amount)
    wallet["total_revenue"] = _to_money(wallet["total_revenue"] + payload.amount)
    wallet["last_updated"] = datetime.now(timezone.utc)

    transaction = _record_transaction(
        wallet,
        TransactionType.credit_received,
        payload.amount,
        PaymentStatus.completed,
        payload.description or "Wallet credit",
    )

    return WalletTransactionResponse(
        message="Wallet credited successfully",
        transaction=transaction,
        wallet=_build_wallet_snapshot(wallet),
    )


@router.post("/{wallet_id}/debit")
async def debit_wallet(wallet_id: str, payload: WalletDebitRequest) -> WalletTransactionResponse:
    wallet = _get_wallet_or_404(wallet_id)
    available_balance = wallet["balance"]

    if payload.amount > available_balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient wallet balance for this debit",
        )

    wallet["balance"] = _to_money(wallet["balance"] - payload.amount)
    wallet["last_updated"] = datetime.now(timezone.utc)

    transaction = _record_transaction(
        wallet,
        TransactionType.payment,
        payload.amount,
        PaymentStatus.completed,
        payload.description or "Wallet debit",
    )

    return WalletTransactionResponse(
        message="Wallet debited successfully",
        transaction=transaction,
        wallet=_build_wallet_snapshot(wallet),
    )


@router.post("/{wallet_id}/repayment")
async def process_repayment(wallet_id: str, payload: WalletRepaymentRequest) -> WalletRepaymentResponse:
    wallet = _get_wallet_or_404(wallet_id)
    repayment_amount = _to_money(payload.amount)
    available_cash = _to_money(wallet["balance"])

    if repayment_amount <= Decimal("0.00"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Repayment amount must be greater than zero",
        )

    if repayment_amount > available_cash:
        wallet["payment_status"] = PaymentStatus.pending
        wallet["last_updated"] = datetime.now(timezone.utc)
        return WalletRepaymentResponse(
            message="Automatic repayment not possible due to insufficient wallet balance",
            repayment_allowed=False,
            amount_requested=repayment_amount,
            amount_processed=Decimal("0.00"),
            remaining_balance=repayment_amount - available_cash,
            payment_status=wallet["payment_status"],
            wallet=_build_wallet_snapshot(wallet),
        )

    wallet["balance"] = _to_money(wallet["balance"] - repayment_amount)
    wallet["loan_outstanding"] = _to_money(max(Decimal("0.00"), wallet["loan_outstanding"] - repayment_amount))
    wallet["amount_repaid"] = _to_money(wallet["amount_repaid"] + repayment_amount)
    wallet["payment_status"] = PaymentStatus.completed
    wallet["last_updated"] = datetime.now(timezone.utc)

    _record_transaction(
        wallet,
        TransactionType.repayment,
        repayment_amount,
        PaymentStatus.completed,
        payload.description or "Automatic repayment",
    )

    return WalletRepaymentResponse(
        message="Repayment processed successfully",
        repayment_allowed=True,
        amount_requested=repayment_amount,
        amount_processed=repayment_amount,
        remaining_balance=_to_money(wallet["balance"]),
        payment_status=wallet["payment_status"],
        wallet=_build_wallet_snapshot(wallet),
    )


@router.post("/{wallet_id}/escrow-lock")
async def lock_escrow_funds(wallet_id: str, payload: WalletEscrowRequest) -> WalletTransactionResponse:
    wallet = _get_wallet_or_404(wallet_id)

    if payload.amount > wallet["balance"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance to lock funds in escrow",
        )

    wallet["balance"] = _to_money(wallet["balance"] - payload.amount)
    wallet["last_updated"] = datetime.now(timezone.utc)

    transaction = _record_transaction(
        wallet,
        TransactionType.payment,
        payload.amount,
        PaymentStatus.processing,
        f"Escrow locked for {payload.escrow_id} ({payload.milestone})",
    )

    return WalletTransactionResponse(
        message="Escrow funds locked successfully",
        transaction=transaction,
        wallet=_build_wallet_snapshot(wallet),
    )


@router.post("/{wallet_id}/escrow-release")
async def release_escrow_funds(wallet_id: str, payload: WalletEscrowRequest) -> WalletTransactionResponse:
    wallet = _get_wallet_or_404(wallet_id)

    wallet["balance"] = _to_money(wallet["balance"] + payload.amount)
    wallet["last_updated"] = datetime.now(timezone.utc)

    transaction = _record_transaction(
        wallet,
        TransactionType.escrow_release,
        payload.amount,
        PaymentStatus.completed,
        f"Escrow released for {payload.escrow_id} ({payload.milestone})",
    )

    return WalletTransactionResponse(
        message="Escrow funds released successfully",
        transaction=transaction,
        wallet=_build_wallet_snapshot(wallet),
    )


@router.get("/{wallet_id}/transactions")
async def get_wallet_transactions(
    wallet_id: str,
    status_filter: Optional[PaymentStatus] = Query(default=None, alias="status"),
    type_filter: Optional[TransactionType] = Query(default=None, alias="type"),
) -> List[WalletTransaction]:
    _get_wallet_or_404(wallet_id)
    transactions = transaction_store.get(wallet_id, [])

    if status_filter:
        transactions = [tx for tx in transactions if tx["status"] == status_filter]
    if type_filter:
        transactions = [tx for tx in transactions if tx["type"] == type_filter]

    return [WalletTransaction(**tx) for tx in transactions]


@router.get("/{wallet_id}/status")
async def get_wallet_status(wallet_id: str) -> Dict[str, Any]:
    wallet = _get_wallet_or_404(wallet_id)
    return {
        "wallet_id": wallet["wallet_id"],
        "user_id": wallet["user_id"],
        "payment_status": wallet["payment_status"],
        "can_repay": wallet["balance"] > 0,
        "last_updated": wallet["last_updated"],
    }


@router.get("/health")
async def wallet_health() -> Dict[str, str]:
    return {"status": "ok", "module": "wallet"}
