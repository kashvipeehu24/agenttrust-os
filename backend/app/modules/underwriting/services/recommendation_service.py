class RecommendationService:

    def generate_recommendations(
        self,
        risk_score: float,
        trust_score: float,
        reputation_score: float,
        task_success_rate: float,
        wallet_balance: float,
        active_loans: int,
        fraud_score: float,
        confidence_score: float,
    ):
        recommendations = []

        if trust_score < 80:
            recommendations.append(
                "Increase trust score through successful mission completion."
            )

        if reputation_score < 80:
            recommendations.append(
                "Improve organizational reputation before requesting additional credit."
            )

        if task_success_rate < 90:
            recommendations.append(
                "Increase task success rate to reduce lending risk."
            )

        if wallet_balance < 10000:
            recommendations.append(
                "Maintain a higher wallet balance to improve financial stability."
            )

        if active_loans > 2:
            recommendations.append(
                "Reduce existing loan exposure before requesting another loan."
            )

        if fraud_score > 10:
            recommendations.append(
                "Fraud score is high. Security verification is recommended."
            )

        if confidence_score < 80:
            recommendations.append(
                "Increase AI confidence through more reliable historical performance."
            )

        if risk_score > 70:
            recommendations.append(
                "High-risk profile detected. Consider lowering requested credit amount."
            )

        if not recommendations:
            recommendations.append(
                "Agent demonstrates strong creditworthiness. Eligible for premium lending."
            )

        return recommendations