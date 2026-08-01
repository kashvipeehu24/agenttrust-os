from __future__ import annotations

from datetime import date, datetime, timedelta, timezone
from decimal import Decimal, ROUND_HALF_UP
from enum import Enum
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field

router = APIRouter(prefix="/repayments", tags=["Repayment"])


class RepaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"
    overdue = "overdue"


class RepaymentType(str, Enum):
    automatic = "automatic"
    partial = "partial"
    milestone = "milestone"
    manual = "manual"


class PaymentMode(str, Enum):
    wallet = "wallet"
    escrow = "escrow"
    direct = "direct"


class Money(BaseModel):
    amount: Decimal = Field(..., ge=0)


class CreateRepaymentPlanRequest(BaseModel):
    user_id: str = Field(..., min_length=1)
    wallet_id: str = Field(..., min_length=1)
    total_loan: Decimal = Field(..., gt=0)
    interest_rate: Decimal = Field(default=Decimal("0.00"), ge=0)
    monthly_payment: Decimal = Field(..., gt=0)
    due_date: date
    revenue_stream: Decimal = Field(default=Decimal("0.00"), ge=0)
    revenue_delay_days: int = Field(default=0, ge=0)
    payment_mode: PaymentMode = PaymentMode.wallet
    payment_type: RepaymentType = RepaymentType.automatic


class PartialRepaymentRequest(BaseModel):
    repayment_id: str = Field(..., min_length=1)
    amount: Decimal = Field(..., gt=0)
    reason: str = "Partial repayment"


class MilestonePaymentRequest(BaseModel):
    repayment_id: str = Field(..., min_length=1)
    milestone_name: str = Field(..., min_length=1)
    completed_percentage: Decimal = Field(..., ge=0, le=100)
    amount: Decimal = Field(..., ge=0)


class RepaymentPlanResponse(BaseModel):
    repayment_id: str
    user_id: str
    wallet_id: str
    total_loan: Decimal
    amount_paid: Decimal
    remaining_amount: Decimal
    interest: Decimal
    interest_rate: Decimal
    due_date: date
    next_payment: Decimal
    payment_status: RepaymentStatus
    payment_mode: PaymentMode
    payment_type: RepaymentType
    revenue_stream: Decimal
    revenue_delay_days: int
    created_at: datetime
    updated_at: datetime


class RepaymentForecast(BaseModel):
    repayment_id: str
    next_repayment: Decimal
    completion_date: date
    remaining_duration_days: int
    future_balance: Decimal
    projected_payment_status: RepaymentStatus
    adaptive_adjustment: str


class RepaymentSuggestion(BaseModel):
    repayment_id: str
    recommendation: str
    confidence: Decimal
    suggested_action: str
    impact: str


class MilestoneResult(BaseModel):
    repayment_id: str
    milestone_name: str
    completed_percentage: Decimal
    amount: Decimal
    status: RepaymentStatus
    released_at: datetime


class RepaymentTransaction(BaseModel):
    repayment_id: str
    amount: Decimal
    transaction_type: str
    status: RepaymentStatus
    created_at: datetime
    description: str


class RepaymentStatusResponse(BaseModel):
    repayment_id: str
    user_id: str
    wallet_id: str
    total_loan: Decimal
    amount_paid: Decimal
    remaining_amount: Decimal
    interest: Decimal
    due_date: date
    next_payment: Decimal
    payment_status: RepaymentStatus
    can_repay_automatically: bool
    repayment_type: RepaymentType


REPAYMENT_STORE: Dict[str, Dict[str, Any]] = {}
TRANSACTION_STORE: Dict[str, List[Dict[str, Any]]] = {}
MILESTONE_STORE: Dict[str, List[Dict[str, Any]]] = {}


def _money(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _today_utc() -> datetime:
    return datetime.now(timezone.utc)


def _get_repayment_or_404(repayment_id: str) -> Dict[str, Any]:
    repayment = REPAYMENT_STORE.get(repayment_id)
    if repayment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Repayment record not found")
    return repayment


def _derive_interest(total_loan: Decimal, interest_rate: Decimal) -> Decimal:
    return _money(total_loan * (interest_rate / Decimal("100")))


def _calculate_next_payment(repayment: Dict[str, Any]) -> Decimal:
    base_payment = _money(repayment["monthly_payment"])
    if repayment["revenue_delay_days"] > 0:
        adjustment_factor = Decimal("1") - (Decimal(repayment["revenue_delay_days"]) / Decimal("30"))
        adjustment_factor = max(Decimal("0.30"), adjustment_factor)
        return _money(base_payment * adjustment_factor)
    return base_payment


def _apply_automatic_repayment(repayment: Dict[str, Any], amount: Decimal) -> Dict[str, Any]:
    remaining_amount = _money(repayment["remaining_amount"])
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Repayment amount must be greater than zero")

    effective_payment = min(amount, remaining_amount)
    repayment["amount_paid"] = _money(repayment["amount_paid"] + effective_payment)
    repayment["remaining_amount"] = _money(remaining_amount - effective_payment)
    repayment["updated_at"] = _today_utc()

    if repayment["remaining_amount"] <= 0:
        repayment["payment_status"] = RepaymentStatus.completed
    elif repayment["due_date"] < date.today():
        repayment["payment_status"] = RepaymentStatus.overdue
    else:
        repayment["payment_status"] = RepaymentStatus.processing

    repayment["next_payment"] = _calculate_next_payment(repayment)
    return repayment


def _build_repayment_response(repayment: Dict[str, Any]) -> RepaymentPlanResponse:
    return RepaymentPlanResponse(
        repayment_id=repayment["repayment_id"],
        user_id=repayment["user_id"],
        wallet_id=repayment["wallet_id"],
        total_loan=repayment["total_loan"],
        amount_paid=repayment["amount_paid"],
        remaining_amount=repayment["remaining_amount"],
        interest=repayment["interest"],
        interest_rate=repayment["interest_rate"],
        due_date=repayment["due_date"],
        next_payment=repayment["next_payment"],
        payment_status=repayment["payment_status"],
        payment_mode=repayment["payment_mode"],
        payment_type=repayment["payment_type"],
        revenue_stream=repayment["revenue_stream"],
        revenue_delay_days=repayment["revenue_delay_days"],
        created_at=repayment["created_at"],
        updated_at=repayment["updated_at"],
    )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_repayment_plan(payload: CreateRepaymentPlanRequest) -> RepaymentPlanResponse:
    repayment_id = f"repay_{payload.user_id}_{len(REPAYMENT_STORE) + 1}"
    total_loan = _money(payload.total_loan)
    interest = _derive_interest(total_loan, payload.interest_rate)
    next_payment = _money(payload.monthly_payment)
    now = _today_utc()

    repayment = {
        "repayment_id": repayment_id,
        "user_id": payload.user_id,
        "wallet_id": payload.wallet_id,
        "total_loan": total_loan,
        "amount_paid": Decimal("0.00"),
        "remaining_amount": _money(total_loan + interest),
        "interest": interest,
        "interest_rate": _money(payload.interest_rate),
        "due_date": payload.due_date,
        "next_payment": next_payment,
        "monthly_payment": _money(payload.monthly_payment),
        "payment_status": RepaymentStatus.pending,
        "payment_mode": payload.payment_mode,
        "payment_type": payload.payment_type,
        "revenue_stream": _money(payload.revenue_stream),
        "revenue_delay_days": payload.revenue_delay_days,
        "created_at": now,
        "updated_at": now,
    }

    REPAYMENT_STORE[repayment_id] = repayment
    TRANSACTION_STORE.setdefault(repayment_id, [])
    MILESTONE_STORE.setdefault(repayment_id, [])

    return _build_repayment_response(repayment)


@router.get("/{repayment_id}")
async def get_repayment(repayment_id: str) -> RepaymentPlanResponse:
    repayment = _get_repayment_or_404(repayment_id)
    return _build_repayment_response(repayment)


@router.post("/{repayment_id}/process")
async def process_repayment(repayment_id: str, payload: Money) -> RepaymentPlanResponse:
    repayment = _get_repayment_or_404(repayment_id)
    processed = _apply_automatic_repayment(repayment, payload.amount)

    TRANSACTION_STORE.setdefault(repayment_id, []).append(
        {
            "repayment_id": repayment_id,
            "amount": _money(payload.amount),
            "transaction_type": "automatic_repayment",
            "status": processed["payment_status"],
            "created_at": _today_utc(),
            "description": "Smart repayment deducted automatically",
        }
    )

    return _build_repayment_response(processed)


@router.get("/{repayment_id}/status")
async def repayment_status(repayment_id: str) -> RepaymentStatusResponse:
    repayment = _get_repayment_or_404(repayment_id)
    can_repay_automatically = repayment["remaining_amount"] > 0 and repayment["payment_status"] != RepaymentStatus.completed

    return RepaymentStatusResponse(
        repayment_id=repayment["repayment_id"],
        user_id=repayment["user_id"],
        wallet_id=repayment["wallet_id"],
        total_loan=repayment["total_loan"],
        amount_paid=repayment["amount_paid"],
        remaining_amount=repayment["remaining_amount"],
        interest=repayment["interest"],
        due_date=repayment["due_date"],
        next_payment=repayment["next_payment"],
        payment_status=repayment["payment_status"],
        can_repay_automatically=can_repay_automatically,
        repayment_type=repayment["payment_type"],
    )


@router.get("/{repayment_id}/forecast")
async def repayment_forecast(repayment_id: str) -> RepaymentForecast:
    repayment = _get_repayment_or_404(repayment_id)

    remaining_days = max((repayment["due_date"] - date.today()).days, 1)
    future_balance = _money(repayment["remaining_amount"] - repayment["next_payment"])
    projected_status = RepaymentStatus.completed if future_balance <= 0 else RepaymentStatus.processing
    adaptive_adjustment = "Revenue delay detected; automated schedule softened to preserve liquidity." if repayment["revenue_delay_days"] > 0 else "Stable cash flow; repayment remains on schedule."

    return RepaymentForecast(
        repayment_id=repayment["repayment_id"],
        next_repayment=repayment["next_payment"],
        completion_date=repayment["due_date"],
        remaining_duration_days=remaining_days,
        future_balance=future_balance,
        projected_payment_status=projected_status,
        adaptive_adjustment=adaptive_adjustment,
    )


@router.get("/{repayment_id}/suggestions")
async def repayment_suggestions(repayment_id: str) -> List[RepaymentSuggestion]:
    repayment = _get_repayment_or_404(repayment_id)
    suggestions: List[RepaymentSuggestion] = []

    if repayment["revenue_stream"] < repayment["monthly_payment"]:
        suggestions.append(
            RepaymentSuggestion(
                repayment_id=repayment["repayment_id"],
                recommendation="Revenue is below the repayment threshold. Consider reduced spending or partial repayment.",
                confidence=Decimal("0.87"),
                suggested_action="Reduce discretionary spend and apply partial repayment.",
                impact="Protects wallet health while preventing missed payment events.",
            )
        )

    if repayment["remaining_amount"] > repayment["monthly_payment"] * Decimal("2"):
        suggestions.append(
            RepaymentSuggestion(
                repayment_id=repayment["repayment_id"],
                recommendation="Early repayment is viable if cash flow improves. Consider paying ahead to reduce interest burden.",
                confidence=Decimal("0.81"),
                suggested_action="Apply early repayment when revenue exceeds the baseline threshold.",
                impact="Reduces future interest and shortens the repayment duration.",
            )
        )

    suggestions.append(
        RepaymentSuggestion(
            repayment_id=repayment["repayment_id"],
            recommendation="Keep the repayment plan aligned with revenue timing and escrow release cycles.",
            confidence=Decimal("0.9"),
            suggested_action="Rebalance the payment schedule using cash-flow forecast and milestone release data.",
            impact="Improves repayment reliability while preserving working capital.",
        )
    )

    return suggestions


@router.post("/{repayment_id}/partial")
async def partial_repayment(repayment_id: str, payload: PartialRepaymentRequest) -> RepaymentPlanResponse:
    repayment = _get_repayment_or_404(repayment_id)
    amount = _money(payload.amount)

    if amount > repayment["remaining_amount"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Partial repayment cannot exceed remaining balance")

    repayment = _apply_automatic_repayment(repayment, amount)
    TRANSACTION_STORE.setdefault(repayment_id, []).append(
        {
            "repayment_id": repayment_id,
            "amount": amount,
            "transaction_type": "partial_repayment",
            "status": repayment["payment_status"],
            "created_at": _today_utc(),
            "description": payload.reason,
        }
    )

    return _build_repayment_response(repayment)


@router.post("/{repayment_id}/milestones")
async def add_milestone_payment(repayment_id: str, payload: MilestonePaymentRequest) -> MilestoneResult:
    repayment = _get_repayment_or_404(repayment_id)

    if payload.amount > repayment["remaining_amount"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Milestone amount cannot exceed remaining balance")

    result = {
        "repayment_id": repayment_id,
        "milestone_name": payload.milestone_name,
        "completed_percentage": _money(payload.completed_percentage),
        "amount": _money(payload.amount),
        "status": RepaymentStatus.completed,
        "released_at": _today_utc(),
    }

    MILESTONE_STORE.setdefault(repayment_id, []).append(result)
    repayment["amount_paid"] = _money(repayment["amount_paid"] + payload.amount)
    repayment["remaining_amount"] = _money(repayment["remaining_amount"] - payload.amount)
    repayment["updated_at"] = _today_utc()

    if repayment["remaining_amount"] <= 0:
        repayment["payment_status"] = RepaymentStatus.completed

    return MilestoneResult(**result)


@router.get("/{repayment_id}/milestones")
async def get_milestone_payments(repayment_id: str) -> List[MilestoneResult]:
    _get_repayment_or_404(repayment_id)
    return [MilestoneResult(**item) for item in MILESTONE_STORE.get(repayment_id, [])]


@router.get("/{repayment_id}/transactions")
async def get_repayment_transactions(
    repayment_id: str,
    status: Optional[RepaymentStatus] = Query(default=None),
    transaction_type: Optional[str] = Query(default=None),
) -> List[RepaymentTransaction]:
    _get_repayment_or_404(repayment_id)
    transactions = TRANSACTION_STORE.get(repayment_id, [])

    if status:
        transactions = [txn for txn in transactions if txn["status"] == status]
    if transaction_type:
        transactions = [txn for txn in transactions if txn["transaction_type"] == transaction_type]

    return [RepaymentTransaction(**txn) for txn in transactions]


@router.get("/health")
async def repayment_health() -> Dict[str, str]:
    return {"status": "ok", "module": "repayment"}
