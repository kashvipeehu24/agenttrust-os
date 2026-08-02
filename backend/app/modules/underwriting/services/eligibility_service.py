from ..models import risk

from .risk_service import RiskService
from .credit_service import CreditService
from .explainability_service import ExplainabilityService
from .recommendation_service import RecommendationService
from .revenue_prediction import RevenuePredictionService
from .dynamic_credit_service import DynamicCreditService
from .confidence_service import ConfidenceService
from .credit_optimization_service import CreditOptimizationService
from .health_dashboard_service import CreditHealthDashboardService


class EligibilityService:

    def __init__(self):
        self.risk_service = RiskService()
        self.credit_service = CreditService()
        self.explainer = ExplainabilityService()
        self.recommendation_service = RecommendationService()
        self.revenue_prediction_service = RevenuePredictionService()
        self.dynamic_credit_service = DynamicCreditService()
        self.confidence_service = ConfidenceService()
        self.credit_optimization_service = CreditOptimizationService()
        self.health_dashboard_service = CreditHealthDashboardService()

    def evaluate_agent(
        self,
        trust_score,
        reputation_score,
        task_success_rate,
        wallet_balance,
        predicted_revenue,
        organization_trust,
        active_loans,
        loan_amount,
        fraud_score,
        kill_switch,
        mission_critical,
        confidence_score,
    ):

        # Step 1: Risk Analysis
        risk = self.risk_service.calculate_risk(
            trust_score,
            reputation_score,
            task_success_rate,
            wallet_balance,
            predicted_revenue,
            organization_trust,
            active_loans,
            loan_amount,
            fraud_score,
            kill_switch,
            mission_critical,
            confidence_score,
        )

        # Step 2: Credit Calculation
        credit = self.credit_service.calculate_credit_limit(
            risk["risk_score"],
            predicted_revenue,
            wallet_balance,
            organization_trust,
        )

        # Step 3: Explainable AI
        explanation = self.explainer.generate_explanation(
            risk["risk_score"],
            risk["decision"],
            credit["credit_limit"],
        )

        revenue = self.revenue_prediction_service.predict(
            trust_score,
            task_success_rate,
            wallet_balance,
            organization_trust,
        )

        recommendations = self.recommendation_service.generate_recommendations(
            risk["risk_score"],
           trust_score,
           reputation_score,
           task_success_rate,
           wallet_balance,
           active_loans,
           fraud_score,
           confidence_score,
)

        dynamic_credit = self.dynamic_credit_service.calculate_dynamic_limit(
         credit["credit_limit"],
         trust_score,
         reputation_score,
         task_success_rate,
         wallet_balance,
         active_loans,
)

        confidence = self.confidence_service.calculate_confidence(
        trust_score,
        reputation_score,
        task_success_rate,
        fraud_score,
        confidence_score,
)

        optimization = self.credit_optimization_service.optimize(
         trust_score,
         reputation_score,
         wallet_balance,
         task_success_rate,
         active_loans,
        fraud_score,
)

        dashboard = self.health_dashboard_service.generate_dashboard(
        trust_score,
        reputation_score,
        risk["risk_score"],
        confidence["confidence_score"],
        wallet_balance,
        active_loans,
        dynamic_credit["dynamic_credit_limit"],
        revenue["predicted_revenue"],
) 

        # Step 4: Final Response
        return {
          "decision": risk["decision"],
          "risk_score": risk["risk_score"],
          "risk_level": risk["risk_level"],
         "credit_limit": credit["credit_limit"],
         "risk_multiplier": credit["risk_multiplier"],
         "predicted_revenue": revenue["predicted_revenue"],
         "growth_multiplier": revenue["growth_multiplier"],
         "recommendations": recommendations,
         "explanation": explanation,
        "dynamic_credit": dynamic_credit,
        "confidence": confidence,
        "optimization": optimization,
        "dashboard": dashboard,
}