from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/payments", tags=["Payments"])


class PaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class PaymentType(str, Enum):
    wallet = "wallet"
    escrow = "escrow"
    direct = "direct"
    refund = "refund"


class PaymentCreateRequest(BaseModel):
    payment_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    type: PaymentType = PaymentType.wallet
    status: PaymentStatus = PaymentStatus.pending
    description: str = "Payment"


class PaymentUpdateRequest(BaseModel):
    amount: Optional[Decimal] = None
    type: Optional[PaymentType] = None
    status: Optional[PaymentStatus] = None
    description: Optional[str] = None


class PaymentResponse(BaseModel):
    payment_id: str
    user_id: str
    wallet_id: str
    amount: Decimal
    type: PaymentType
    status: PaymentStatus
    description: str
    created_at: datetime
    updated_at: datetime


PAYMENT_STORE: Dict[str, Dict[str, object]] = {}


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _get_payment_or_404(payment_id: str) -> Dict[str, object]:
    payment = PAYMENT_STORE.get(payment_id)
    if payment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment not found")
    return payment


def _serialize_payment(payment: Dict[str, object]) -> PaymentResponse:
    return PaymentResponse(
        payment_id=str(payment["payment_id"]),
        user_id=str(payment["user_id"]),
        wallet_id=str(payment["wallet_id"]),
        amount=_money(payment["amount"]),
        type=payment["type"],
        status=payment["status"],
        description=str(payment["description"]),
        created_at=payment["created_at"],
        updated_at=payment["updated_at"],
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_payment(payload: PaymentCreateRequest) -> PaymentResponse:
    if payload.payment_id in PAYMENT_STORE:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Payment already exists")

    now = _utc_now()
    payment = {
        "payment_id": payload.payment_id,
        "user_id": payload.user_id,
        "wallet_id": payload.wallet_id,
        "amount": _money(payload.amount),
        "type": payload.type,
        "status": payload.status,
        "description": payload.description,
        "created_at": now,
        "updated_at": now,
    }

    PAYMENT_STORE[payload.payment_id] = payment
    return _serialize_payment(payment)


@router.get("/{payment_id}")
async def get_payment(payment_id: str) -> PaymentResponse:
    return _serialize_payment(_get_payment_or_404(payment_id))


@router.get("")
async def list_payments(
    user_id: Optional[str] = Query(default=None),
    wallet_id: Optional[str] = Query(default=None),
    status: Optional[PaymentStatus] = Query(default=None),
    type: Optional[PaymentType] = Query(default=None),
) -> List[PaymentResponse]:
    items = list(PAYMENT_STORE.values())

    if user_id is not None:
        items = [item for item in items if str(item["user_id"]) == user_id]
    if wallet_id is not None:
        items = [item for item in items if str(item["wallet_id"]) == wallet_id]
    if status is not None:
        items = [item for item in items if item["status"] == status]
    if type is not None:
        items = [item for item in items if item["type"] == type]

    return [_serialize_payment(item) for item in items]


@router.patch("/{payment_id}")
async def update_payment(payment_id: str, payload: PaymentUpdateRequest) -> PaymentResponse:
    payment = _get_payment_or_404(payment_id)

    if payload.amount is not None:
        payment["amount"] = _money(payload.amount)
    if payload.type is not None:
        payment["type"] = payload.type
    if payload.status is not None:
        payment["status"] = payload.status
    if payload.description is not None:
        payment["description"] = payload.description

    payment["updated_at"] = _utc_now()
    return _serialize_payment(payment)


@router.post("/{payment_id}/process")
async def process_payment(payment_id: str) -> PaymentResponse:
    payment = _get_payment_or_404(payment_id)
    payment["status"] = PaymentStatus.processing
    payment["updated_at"] = _utc_now()
    return _serialize_payment(payment)


@router.post("/{payment_id}/complete")
async def complete_payment(payment_id: str) -> PaymentResponse:
    payment = _get_payment_or_404(payment_id)
    payment["status"] = PaymentStatus.completed
    payment["updated_at"] = _utc_now()
    return _serialize_payment(payment)


@router.post("/{payment_id}/fail")
async def fail_payment(payment_id: str) -> PaymentResponse:
    payment = _get_payment_or_404(payment_id)
    payment["status"] = PaymentStatus.failed
    payment["updated_at"] = _utc_now()
    return _serialize_payment(payment)


@router.get("/health")
async def payment_health() -> Dict[str, str]:
    return {"status": "ok", "module": "payment"}
