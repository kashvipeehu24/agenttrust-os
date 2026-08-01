class ExplainabilityService:

    def generate_explanation(
        self,
        risk_score: float,
        decision: str,
        credit_limit: float,
    ):

        reasons = []

        if risk_score >= 80:
            reasons.append("Excellent operational history.")
        elif risk_score >= 60:
            reasons.append("Moderate operational risk.")
        else:
            reasons.append("High operational risk detected.")

        if credit_limit > 100000:
            reasons.append("Eligible for a high credit limit based on financial indicators.")

        if decision == "APPROVED":
            reasons.append("Loan approved because the agent satisfies underwriting requirements.")
        elif decision == "REVIEW":
            reasons.append("Manual review is recommended before loan approval.")
        else:
            reasons.append("Loan rejected because the current risk exceeds the acceptable threshold.")

        return reasons