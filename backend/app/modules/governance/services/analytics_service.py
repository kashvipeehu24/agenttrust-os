"""
Security Analytics Service

Provides security analytics for the Governance module.

Metrics:
- Security Health Score
- Fraud Rate
- Alert Count
- Policy Violations
- Active Risks
"""


class AnalyticsService:
    """
    Calculates security metrics.
    """

    def security_summary(
        self,
        fraud_events: int,
        alerts: int,
        policy_violations: int,
        active_risks: int
    ) -> dict:

        score = max(
            0,
            100
            - fraud_events * 5
            - alerts * 2
            - policy_violations * 3
            - active_risks * 4
        )

        return {
            "security_health_score": score,
            "fraud_events": fraud_events,
            "alerts": alerts,
            "policy_violations": policy_violations,
            "active_risks": active_risks,
        }

    def fraud_rate(
        self,
        total_transactions: int,
        fraud_events: int
    ) -> float:

        if total_transactions == 0:
            return 0.0

        return round(
            (fraud_events / total_transactions) * 100,
            2
        )

    def risk_level(
        self,
        score: int
    ) -> str:

        if score >= 90:
            return "Green"

        if score >= 75:
            return "Yellow"

        if score >= 50:
            return "Orange"

        if score >= 25:
            return "Red"

        return "Critical"