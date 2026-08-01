class CreditService:

    def calculate_credit_limit(
        self,
        risk_score: float,
        predicted_revenue: float,
        wallet_balance: float,
        organization_trust: float,
    ):

        # Base credit derived from expected revenue
        credit_limit = predicted_revenue * 0.50

        # Bonus for healthy wallet
        if wallet_balance > 100000:
            credit_limit += 20000

        # Bonus for trusted organization
        if organization_trust >= 80:
            credit_limit += 30000

        # Risk adjustment
        if risk_score >= 85:
            multiplier = 1.20
        elif risk_score >= 70:
            multiplier = 1.00
        elif risk_score >= 50:
            multiplier = 0.70
        else:
            multiplier = 0.40

        credit_limit *= multiplier

        return {
            "credit_limit": round(credit_limit, 2),
            "risk_multiplier": multiplier
        }