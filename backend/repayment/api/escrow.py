from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/escrows", tags=["Escrow"])


class EscrowStatus(str, Enum):
    pending = "pending"
    active = "active"
    locked = "locked"
    released = "released"
    cancelled = "cancelled"
    failed = "failed"


class EscrowTrigger(str, Enum):
    task_start = "task_start"
    milestone_reached = "milestone_reached"
    task_completed = "task_completed"
    manual = "manual"


class EscrowCreateRequest(BaseModel):
    escrow_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    trigger: EscrowTrigger = EscrowTrigger.task_start
    milestone_name: Optional[str] = None
    task_reference: Optional[str] = None
    release_condition: str = "task_completed"


class EscrowReleaseRequest(BaseModel):
    escrow_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    released_by: str = "system"
    reason: str = "Escrow release"


class EscrowStatusResponse(BaseModel):
    escrow_id: str
    user_id: str
    wallet_id: str
    amount: Decimal
    status: EscrowStatus
    trigger: EscrowTrigger
    milestone_name: Optional[str]
    task_reference: Optional[str]
    release_condition: str
    created_at: datetime
    updated_at: datetime


class EscrowActionResponse(BaseModel):
    message: str
    escrow: EscrowStatusResponse


ESCROW_STORE: Dict[str, Dict[str, object]] = {}


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _get_escrow_or_404(escrow_id: str) -> Dict[str, object]:
    escrow = ESCROW_STORE.get(escrow_id)
    if escrow is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Escrow not found")
    return escrow


def _serialize_escrow(escrow: Dict[str, object]) -> EscrowStatusResponse:
    return EscrowStatusResponse(
        escrow_id=str(escrow["escrow_id"]),
        user_id=str(escrow["user_id"]),
        wallet_id=str(escrow["wallet_id"]),
        amount=_money(escrow["amount"]),
        status=escrow["status"],
        trigger=escrow["trigger"],
        milestone_name=escrow.get("milestone_name"),
        task_reference=escrow.get("task_reference"),
        release_condition=str(escrow.get("release_condition", "task_completed")),
        created_at=escrow["created_at"],
        updated_at=escrow["updated_at"],
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_escrow(payload: EscrowCreateRequest) -> EscrowActionResponse:
    if payload.escrow_id in ESCROW_STORE:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Escrow already exists")

    now = _utc_now()
    escrow = {
        "escrow_id": payload.escrow_id,
        "user_id": payload.user_id,
        "wallet_id": payload.wallet_id,
        "amount": _money(payload.amount),
        "status": EscrowStatus.locked,
        "trigger": payload.trigger,
        "milestone_name": payload.milestone_name,
        "task_reference": payload.task_reference,
        "release_condition": payload.release_condition,
        "created_at": now,
        "updated_at": now,
    }

    ESCROW_STORE[payload.escrow_id] = escrow

    return EscrowActionResponse(message="Escrow created and funds locked", escrow=_serialize_escrow(escrow))


@router.get("/{escrow_id}")
async def get_escrow(escrow_id: str) -> EscrowStatusResponse:
    escrow = _get_escrow_or_404(escrow_id)
    return _serialize_escrow(escrow)


@router.get("")
async def list_escrows(
    status: Optional[EscrowStatus] = Query(default=None),
    user_id: Optional[str] = Query(default=None),
) -> List[EscrowStatusResponse]:
    items = list(ESCROW_STORE.values())

    if status is not None:
        items = [item for item in items if item["status"] == status]
    if user_id is not None:
        items = [item for item in items if str(item["user_id"]) == user_id]

    return [_serialize_escrow(item) for item in items]


@router.post("/{escrow_id}/activate")
async def activate_escrow(escrow_id: str) -> EscrowActionResponse:
    escrow = _get_escrow_or_404(escrow_id)
    escrow["status"] = EscrowStatus.active
    escrow["updated_at"] = _utc_now()
    return EscrowActionResponse(message="Escrow activated", escrow=_serialize_escrow(escrow))


@router.post("/{escrow_id}/milestone")
async def milestone_release(escrow_id: str, milestone_name: str, percentage: Decimal = 100) -> EscrowActionResponse:
    escrow = _get_escrow_or_404(escrow_id)
    if escrow["status"] == EscrowStatus.released:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Escrow already released")

    escrow["milestone_name"] = milestone_name
    escrow["trigger"] = EscrowTrigger.milestone_reached
    escrow["updated_at"] = _utc_now()

    if percentage >= 100:
        escrow["status"] = EscrowStatus.released
        return EscrowActionResponse(message="Milestone achieved; escrow released", escrow=_serialize_escrow(escrow))

    escrow["status"] = EscrowStatus.active
    return EscrowActionResponse(message="Milestone reached; escrow remains locked for partial release", escrow=_serialize_escrow(escrow))


@router.post("/{escrow_id}/release")
async def release_escrow(escrow_id: str, payload: EscrowReleaseRequest) -> EscrowActionResponse:
    escrow = _get_escrow_or_404(escrow_id)

    if escrow["status"] == EscrowStatus.released:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Escrow has already been released")

    amount = _money(payload.amount)
    if amount > _money(escrow["amount"]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Release amount cannot exceed escrow amount")

    escrow["status"] = EscrowStatus.released
    escrow["trigger"] = EscrowTrigger.task_completed
    escrow["updated_at"] = _utc_now()

    return EscrowActionResponse(
        message="Escrow released successfully",
        escrow=_serialize_escrow(escrow),
    )


@router.post("/{escrow_id}/cancel")
async def cancel_escrow(escrow_id: str) -> EscrowActionResponse:
    escrow = _get_escrow_or_404(escrow_id)
    escrow["status"] = EscrowStatus.cancelled
    escrow["updated_at"] = _utc_now()
    return EscrowActionResponse(message="Escrow cancelled", escrow=_serialize_escrow(escrow))


@router.get("/{escrow_id}/status")
async def escrow_status(escrow_id: str) -> Dict[str, object]:
    escrow = _get_escrow_or_404(escrow_id)
    return {
        "escrow_id": escrow["escrow_id"],
        "user_id": escrow["user_id"],
        "wallet_id": escrow["wallet_id"],
        "status": escrow["status"],
        "amount": _money(escrow["amount"]),
        "released": escrow["status"] == EscrowStatus.released,
        "updated_at": escrow["updated_at"],
    }


@router.get("/health")
async def escrow_health() -> Dict[str, str]:
    return {"status": "ok", "module": "escrow"}
