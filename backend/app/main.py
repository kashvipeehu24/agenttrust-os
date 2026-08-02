from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Underwriting Module Router
from app.modules.underwriting.api.routes import router as underwriting_router

# Repayment Monitoring Module Routers
from repayment.api.wallet import router as repayment_wallet_router
from repayment.api.transaction import router as repayment_transaction_router
from repayment.api.payment import router as repayment_payment_router
from repayment.api.repayment import router as repayment_repayment_router
from repayment.api.revenue import router as repayment_revenue_router
from repayment.api.escrow import router as repayment_escrow_router

# Extra Repayment Routers mapping the frontend endpoints
from repayment.api.extra_routes import (
    forecast_router,
    ai_suggestions_router,
    cashflow_router,
    revenue_router
)

# Governance Module Routers
from app.modules.governance.api.alerts import router as governance_alerts_router
from app.modules.governance.api.audit import router as governance_audit_router
from app.modules.governance.api.fraud import router as governance_fraud_router
from app.modules.governance.api.kill_switch import router as governance_kill_switch_router
from app.modules.governance.api.monitoring import router as governance_monitoring_router
from app.modules.governance.api.policy import router as governance_policy_router

# Identity Module Routers
from app.modules.identity.api.agent import router as identity_agent_router
from app.modules.identity.api.agent_skill_profile import router as identity_skills_router
from app.modules.identity.api.auth import router as identity_auth_router
from app.modules.identity.api.did import router as identity_did_router
from app.modules.identity.api.human_agent_mapping import router as identity_human_agent_router
from app.modules.identity.api.identity_health import router as identity_health_router
from app.modules.identity.api.organization import router as identity_organization_router
from app.modules.identity.api.organization_trust import router as identity_organization_trust_router
from app.modules.identity.api.passport import router as identity_passport_router
from app.modules.identity.api.permissions import router as identity_permissions_router
from app.modules.identity.api.reputation import router as identity_reputation_router
from app.modules.identity.api.trust import router as identity_trust_router
from app.modules.identity.api.trust_explanation import router as identity_trust_explanation_router
from app.modules.identity.api.wallet import router as identity_wallet_router

app = FastAPI(
    title="AgentTrust OS",
    version="1.0.0"
)

# Enable CORS for all local requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Underwriting router
app.include_router(underwriting_router)

# Mount Repayment routers
app.include_router(repayment_wallet_router)
app.include_router(repayment_transaction_router)
app.include_router(repayment_payment_router)
app.include_router(repayment_repayment_router)
app.include_router(repayment_revenue_router)
app.include_router(repayment_escrow_router)

# Mount extra repayment routing endpoints matching the frontend
app.include_router(forecast_router)
app.include_router(ai_suggestions_router)
app.include_router(cashflow_router)
app.include_router(revenue_router)

# Mount Governance routers
app.include_router(governance_alerts_router)
app.include_router(governance_audit_router)
app.include_router(governance_fraud_router)
app.include_router(governance_kill_switch_router)
app.include_router(governance_monitoring_router)
app.include_router(governance_policy_router)

# Mount Identity routers
app.include_router(identity_agent_router)
app.include_router(identity_skills_router)
app.include_router(identity_auth_router)
app.include_router(identity_did_router)
app.include_router(identity_human_agent_router)
app.include_router(identity_health_router)
app.include_router(identity_organization_router)
app.include_router(identity_organization_trust_router)
app.include_router(identity_passport_router)
app.include_router(identity_permissions_router)
app.include_router(identity_reputation_router)
app.include_router(identity_trust_router)
app.include_router(identity_trust_explanation_router)
app.include_router(identity_wallet_router)

@app.get("/")
def home():
    return {
        "message": "AgentTrust OS Backend Running"
    }