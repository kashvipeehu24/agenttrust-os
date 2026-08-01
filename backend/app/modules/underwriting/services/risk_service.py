class RiskService:

    def calculate_risk(
        self,
        trust_score: float,
        reputation_score: float,
        task_success_rate: float,
        wallet_balance: float,
        predicted_revenue: float,
        organization_trust: float,
        active_loans: int,
        loan_amount: float,
        fraud_score: float,
        kill_switch: bool,
        mission_critical: bool,
        confidence_score: float,
    ):

        score = 0
        explanation = []

        # 1. Trust Score
        score += trust_score * 0.20
        if trust_score >= 80:
            explanation.append("High trust score")

        # 2. Reputation
        score += reputation_score * 0.10

        # 3. Task Success
        score += task_success_rate * 0.15

        # 4. Wallet Health
        if wallet_balance >= loan_amount:
            score += 10
            explanation.append("Wallet has sufficient reserve")

        # 5. Revenue Prediction
        if predicted_revenue >= loan_amount:
            score += 10
            explanation.append("Predicted revenue covers loan")

        # 6. Organization Trust
        score += organization_trust * 0.10

        # 7. Existing Loans
        if active_loans == 0:
            score += 5

        # 8. Small Loan Bonus
        if loan_amount < 50000:
            score += 5

        # 9. Fraud Detection
        score += (100 - fraud_score) * 0.10

        # 10. Kill Switch
        if not kill_switch:
            score += 5

        # 11. Mission Critical
        if mission_critical:
            score += 5

        # 12. Confidence
        score += confidence_score * 0.05

        # Final Decision
        if score >= 80:
            risk = "LOW"
            decision = "APPROVED"

        elif score >= 60:
            risk = "MEDIUM"
            decision = "REVIEW"

        else:
            risk = "HIGH"
            decision = "REJECTED"

        return {
            "risk_score": round(score, 2),
            "risk_level": risk,
            "decision": decision,
            "explanation": explanation
        }