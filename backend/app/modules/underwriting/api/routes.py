from fastapi import APIRouter
from ..services.eligibility_service import EligibilityService

router = APIRouter(
    prefix="/underwriting",
    tags=["Underwriting"]
)

service = EligibilityService()


@router.post("/evaluate")
def evaluate():

    result = service.evaluate_agent(
        trust_score=90,
        reputation_score=85,
        task_success_rate=95,
        wallet_balance=150000,
        predicted_revenue=200000,
        organization_trust=92,
        active_loans=0,
        loan_amount=50000,
        fraud_score=5,
        kill_switch=False,
        mission_critical=True,
        confidence_score=96,
    )

    return result