class ConfidenceService:
    """
    Calculates the confidence level of the underwriting decision.
    """

    def calculate_confidence(
        self,
        trust_score: float,
        reputation_score: float,
        task_success_rate: float,
        fraud_score: float,
        data_completeness: float,
    ):

        confidence = (
            trust_score * 0.30
            + reputation_score * 0.25
            + task_success_rate * 0.25
            + data_completeness * 0.20
            - fraud_score * 0.20
        )

        confidence = max(0.0, min(100.0, confidence))

        if confidence >= 90:
            level = "VERY HIGH"
        elif confidence >= 75:
            level = "HIGH"
        elif confidence >= 60:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "confidence_score": round(confidence, 2),
            "confidence_level": level,
        }