from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional


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


@dataclass
class EscrowRecord:
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


class EscrowService:
    """Escrow control logic for funds protection during financial operations."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @staticmethod
    def utc_now() -> datetime:
        return datetime.now(timezone.utc)

    @classmethod
    def create_escrow(
        cls,
        escrow_id: str,
        user_id: str,
        wallet_id: str,
        amount: Decimal | int | float | str,
        trigger: EscrowTrigger = EscrowTrigger.task_start,
        milestone_name: Optional[str] = None,
        task_reference: Optional[str] = None,
        release_condition: str = "task_completed",
    ) -> Dict[str, Any]:
        escrow = {
            "escrow_id": escrow_id,
            "user_id": user_id,
            "wallet_id": wallet_id,
            "amount": cls.money(amount),
            "status": EscrowStatus.locked,
            "trigger": trigger,
            "milestone_name": milestone_name,
            "task_reference": task_reference,
            "release_condition": release_condition,
            "created_at": cls.utc_now(),
            "updated_at": cls.utc_now(),
        }
        return escrow

    @classmethod
    def activate_escrow(cls, escrow: Dict[str, Any]) -> Dict[str, Any]:
        escrow["status"] = EscrowStatus.active
        escrow["updated_at"] = cls.utc_now()
        return escrow

    @classmethod
    def lock_escrow(cls, escrow: Dict[str, Any]) -> Dict[str, Any]:
        escrow["status"] = EscrowStatus.locked
        escrow["updated_at"] = cls.utc_now()
        return escrow

    @classmethod
    def release_escrow(cls, escrow: Dict[str, Any], amount: Decimal | int | float | str) -> Dict[str, Any]:
        release_amount = cls.money(amount)
        escrow_amount = cls.money(escrow.get("amount", Decimal("0.00")))
        if release_amount > escrow_amount:
            raise ValueError("Release amount cannot exceed escrow amount")

        escrow["status"] = EscrowStatus.released
        escrow["trigger"] = EscrowTrigger.task_completed
        escrow["updated_at"] = cls.utc_now()
        escrow["release_amount"] = release_amount
        return escrow

    @classmethod
    def milestone_reached(cls, escrow: Dict[str, Any], milestone_name: str, percentage: Decimal | int | float | str = 100) -> Dict[str, Any]:
        percentage_value = Decimal(str(percentage))
        escrow["milestone_name"] = milestone_name
        escrow["trigger"] = EscrowTrigger.milestone_reached
        escrow["updated_at"] = cls.utc_now()

        if percentage_value >= 100:
            escrow["status"] = EscrowStatus.released
        else:
            escrow["status"] = EscrowStatus.active

        return escrow

    @classmethod
    def cancel_escrow(cls, escrow: Dict[str, Any]) -> Dict[str, Any]:
        escrow["status"] = EscrowStatus.cancelled
        escrow["updated_at"] = cls.utc_now()
        return escrow

    @classmethod
    def can_release(cls, escrow: Dict[str, Any]) -> bool:
        return escrow.get("status") in {EscrowStatus.active, EscrowStatus.locked, EscrowStatus.released}

    @classmethod
    def get_escrow_status(cls, escrow: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "escrow_id": escrow["escrow_id"],
            "user_id": escrow["user_id"],
            "wallet_id": escrow["wallet_id"],
            "status": escrow["status"],
            "amount": escrow["amount"],
            "released": escrow.get("status") == EscrowStatus.released,
            "updated_at": escrow["updated_at"],
        }


__all__ = [
    "EscrowService",
    "EscrowStatus",
    "EscrowTrigger",
    "EscrowRecord",
]
