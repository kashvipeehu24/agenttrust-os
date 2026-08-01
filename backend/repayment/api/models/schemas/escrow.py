from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


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


class EscrowCreate(BaseModel):
    escrow_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    trigger: EscrowTrigger = EscrowTrigger.task_start
    milestone_name: str | None = None
    task_reference: str | None = None
    release_condition: str = "task_completed"


class EscrowRelease(BaseModel):
    escrow_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    released_by: str = "system"
    reason: str = "Escrow release"


class EscrowResponse(BaseModel):
    escrow_id: str
    user_id: str
    wallet_id: str
    amount: Decimal
    status: EscrowStatus
    trigger: EscrowTrigger
    milestone_name: str | None = None
    task_reference: str | None = None
    release_condition: str
    created_at: datetime
    updated_at: datetime
