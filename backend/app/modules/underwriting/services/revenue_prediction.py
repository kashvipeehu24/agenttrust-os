class RevenuePredictionService:

    def predict(
        self,
        trust_score,
        task_success_rate,
        wallet_balance,
        organization_trust,
    ):
        multiplier = (
            (trust_score * 0.35)
            + (task_success_rate * 0.30)
            + (organization_trust * 0.20)
            + (min(wallet_balance / 1000, 100) * 0.15)
        ) / 100

        predicted_revenue = round(wallet_balance * (1 + multiplier), 2)

        return {
            "predicted_revenue": predicted_revenue,
            "growth_multiplier": round(multiplier, 2),
        }