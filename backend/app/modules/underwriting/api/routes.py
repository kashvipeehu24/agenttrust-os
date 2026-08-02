from fastapi import APIRouter
from pydantic import BaseModel
from ..services.eligibility_service import EligibilityService

router = APIRouter(
    prefix="/underwriting",
    tags=["Underwriting"]
)

service = EligibilityService()

class UnderwritingEvaluationRequest(BaseModel):
    trust_score: float
    reputation_score: float
    task_success_rate: float
    wallet_balance: float
    predicted_revenue: float
    organization_trust: float
    active_loans: int
    loan_amount: float
    fraud_score: float
    kill_switch: bool
    mission_critical: bool
    confidence_score: float

@router.post("/evaluate")
def evaluate(payload: UnderwritingEvaluationRequest):
    result = service.evaluate_agent(
        trust_score=payload.trust_score,
        reputation_score=payload.reputation_score,
        task_success_rate=payload.task_success_rate,
        wallet_balance=payload.wallet_balance,
        predicted_revenue=payload.predicted_revenue,
        organization_trust=payload.organization_trust,
        active_loans=payload.active_loans,
        loan_amount=payload.loan_amount,
        fraud_score=payload.fraud_score,
        kill_switch=payload.kill_switch,
        mission_critical=payload.mission_critical,
        confidence_score=payload.confidence_score,
    )
    return result