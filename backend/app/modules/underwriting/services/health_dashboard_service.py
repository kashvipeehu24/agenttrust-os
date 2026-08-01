class CreditHealthDashboardService:
    """
    Generates a credit health summary for dashboards.
    """

    def generate_dashboard(
        self,
        trust_score: float,
        reputation_score: float,
        risk_score: float,
        confidence_score: float,
        wallet_balance: float,
        active_loans: int,
        credit_limit: float,
        predicted_revenue: float,
    ):

        if risk_score <= 30:
            health = "EXCELLENT"
        elif risk_score <= 50:
            health = "GOOD"
        elif risk_score <= 70:
            health = "FAIR"
        else:
            health = "POOR"

        utilization = 0.0

        if credit_limit > 0:
            utilization = round(
                (wallet_balance / credit_limit) * 100,
                2
            )

        return {
            "overall_health": health,
            "trust_score": trust_score,
            "reputation_score": reputation_score,
            "risk_score": risk_score,
            "confidence_score": confidence_score,
            "wallet_balance": wallet_balance,
            "active_loans": active_loans,
            "credit_limit": credit_limit,
            "credit_utilization": utilization,
            "predicted_revenue": predicted_revenue,
        }