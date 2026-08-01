class DynamicCreditService:
    """
    Adjusts the base credit limit dynamically using
    trust, reputation and financial behaviour.
    """

    def calculate_dynamic_limit(
        self,
        base_credit_limit: float,
        trust_score: float,
        reputation_score: float,
        task_success_rate: float,
        wallet_balance: float,
        active_loans: int,
    ):

        multiplier = 1.0

        # Trust Score
        if trust_score >= 90:
            multiplier += 0.20
        elif trust_score >= 80:
            multiplier += 0.10
        elif trust_score < 60:
            multiplier -= 0.20

        # Reputation
        if reputation_score >= 90:
            multiplier += 0.15
        elif reputation_score < 60:
            multiplier -= 0.15

        # Success Rate
        if task_success_rate >= 95:
            multiplier += 0.10
        elif task_success_rate < 75:
            multiplier -= 0.10

        # Wallet Balance
        if wallet_balance >= 100000:
            multiplier += 0.15
        elif wallet_balance < 5000:
            multiplier -= 0.10

        # Existing Loans
        if active_loans >= 3:
            multiplier -= 0.20

        dynamic_limit = max(
            0,
            round(base_credit_limit * multiplier, 2)
        )

        return {
            "base_credit_limit": base_credit_limit,
            "dynamic_credit_limit": dynamic_limit,
            "credit_multiplier": round(multiplier, 2),
            "increase": dynamic_limit > base_credit_limit,
        }