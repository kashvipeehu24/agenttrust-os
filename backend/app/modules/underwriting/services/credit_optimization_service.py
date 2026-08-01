class CreditOptimizationService:
    """
    Generates actionable recommendations to improve
    an AI agent's future credit eligibility.
    """

    def optimize(
        self,
        trust_score: float,
        reputation_score: float,
        wallet_balance: float,
        task_success_rate: float,
        active_loans: int,
        fraud_score: float,
    ):

        suggestions = []

        if trust_score < 80:
            suggestions.append(
                "Increase trust score by successfully completing more verified tasks."
            )

        if reputation_score < 80:
            suggestions.append(
                "Improve reputation through consistent high-quality agent performance."
            )

        if wallet_balance < 10000:
            suggestions.append(
                "Maintain a higher wallet balance to strengthen financial stability."
            )

        if task_success_rate < 90:
            suggestions.append(
                "Increase successful task completion rate above 90%."
            )

        if active_loans > 2:
            suggestions.append(
                "Reduce outstanding loans before requesting additional credit."
            )

        if fraud_score > 10:
            suggestions.append(
                "Resolve security or fraud-related issues before reapplying."
            )

        score = 100

        score -= max(0, 80 - trust_score) * 0.3
        score -= max(0, 80 - reputation_score) * 0.2
        score -= active_loans * 5
        score -= fraud_score * 2

        score = max(0, min(100, round(score, 2)))

        if not suggestions:
            suggestions.append(
                "Excellent financial profile. Eligible for premium lending products."
            )

        return {
            "optimization_score": score,
            "recommendations": suggestions,
        }