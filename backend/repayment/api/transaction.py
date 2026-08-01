from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/transactions", tags=["Transactions"])


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


class TransactionCreateRequest(BaseModel):
    transaction_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    type: TransactionType = TransactionType.payment
    amount: Decimal = Field(..., gt=0)
    status: PaymentStatus = PaymentStatus.pending
    description: str = "Transaction"
    balance_after: Decimal = Decimal("0.00")


class TransactionUpdateRequest(BaseModel):
    type: Optional[TransactionType] = None
    amount: Optional[Decimal] = None
    status: Optional[PaymentStatus] = None
    description: Optional[str] = None
    balance_after: Optional[Decimal] = None


class TransactionResponse(BaseModel):
    transaction_id: str
    wallet_id: str
    user_id: str
    type: TransactionType
    amount: Decimal
    status: PaymentStatus
    description: str
    created_at: datetime
    balance_after: Decimal


TRANSACTION_STORE: Dict[str, Dict[str, object]] = {}


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _get_transaction_or_404(transaction_id: str) -> Dict[str, object]:
    transaction = TRANSACTION_STORE.get(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return transaction


def _serialize_transaction(transaction: Dict[str, object]) -> TransactionResponse:
    return TransactionResponse(
        transaction_id=str(transaction["transaction_id"]),
        wallet_id=str(transaction["wallet_id"]),
        user_id=str(transaction["user_id"]),
        type=transaction["type"],
        amount=_money(transaction["amount"]),
        status=transaction["status"],
        description=str(transaction["description"]),
        created_at=transaction["created_at"],
        balance_after=_money(transaction["balance_after"]),
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_transaction(payload: TransactionCreateRequest) -> TransactionResponse:
    if payload.transaction_id in TRANSACTION_STORE:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Transaction already exists")

    transaction = {
        "transaction_id": payload.transaction_id,
        "wallet_id": payload.wallet_id,
        "user_id": payload.user_id,
        "type": payload.type,
        "amount": _money(payload.amount),
        "status": payload.status,
        "description": payload.description,
        "created_at": _utc_now(),
        "balance_after": _money(payload.balance_after),
    }
    TRANSACTION_STORE[payload.transaction_id] = transaction

    return _serialize_transaction(transaction)


@router.get("/{transaction_id}")
async def get_transaction(transaction_id: str) -> TransactionResponse:
    return _serialize_transaction(_get_transaction_or_404(transaction_id))


@router.get("")
async def list_transactions(
    wallet_id: Optional[str] = Query(default=None),
    user_id: Optional[str] = Query(default=None),
    status: Optional[PaymentStatus] = Query(default=None),
    type: Optional[TransactionType] = Query(default=None),
) -> List[TransactionResponse]:
    items = list(TRANSACTION_STORE.values())

    if wallet_id is not None:
        items = [item for item in items if str(item["wallet_id"]) == wallet_id]
    if user_id is not None:
        items = [item for item in items if str(item["user_id"]) == user_id]
    if status is not None:
        items = [item for item in items if item["status"] == status]
    if type is not None:
        items = [item for item in items if item["type"] == type]

    return [_serialize_transaction(item) for item in items]


@router.patch("/{transaction_id}")
async def update_transaction(transaction_id: str, payload: TransactionUpdateRequest) -> TransactionResponse:
    transaction = _get_transaction_or_404(transaction_id)

    if payload.type is not None:
        transaction["type"] = payload.type
    if payload.amount is not None:
        transaction["amount"] = _money(payload.amount)
    if payload.status is not None:
        transaction["status"] = payload.status
    if payload.description is not None:
        transaction["description"] = payload.description
    if payload.balance_after is not None:
        transaction["balance_after"] = _money(payload.balance_after)

    return _serialize_transaction(transaction)


@router.post("/{transaction_id}/complete")
async def complete_transaction(transaction_id: str) -> TransactionResponse:
    transaction = _get_transaction_or_404(transaction_id)
    transaction["status"] = PaymentStatus.completed
    return _serialize_transaction(transaction)


@router.post("/{transaction_id}/fail")
async def fail_transaction(transaction_id: str) -> TransactionResponse:
    transaction = _get_transaction_or_404(transaction_id)
    transaction["status"] = PaymentStatus.failed
    return _serialize_transaction(transaction)


@router.get("/health")
async def transaction_health() -> Dict[str, str]:
    return {"status": "ok", "module": "transaction"}
