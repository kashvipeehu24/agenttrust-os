from __future__ import annotations

from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List


@dataclass
class AISuggestion:
    recommendation: str
    confidence: Decimal
    suggested_action: str
    impact: str


class AISuggestionService:
    """AI-guided suggestions for repayment strategy and liquidity safety."""

    @staticmethod
    def money(value: Decimal | int | float | str) -> Decimal:
        amount = Decimal(str(value))
        return amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

    @classmethod
    def generate_repayment_suggestions(
        cls,
        revenue_stream: Decimal | int | float | str,
        monthly_payment: Decimal | int | float | str,
        remaining_amount: Decimal | int | float | str,
    ) -> List[AISuggestion]:
        revenue = cls.money(revenue_stream)
        payment = cls.money(monthly_payment)
        balance = cls.money(remaining_amount)
        suggestions: List[AISuggestion] = []

        if revenue < payment:
            suggestions.append(
                AISuggestion(
                    recommendation="Revenue is below the repayment threshold.",
                    confidence=Decimal("0.87"),
                    suggested_action="Reduce discretionary spend and apply a partial repayment to avoid missed payment events.",
                    impact="Preserves liquidity while keeping the repayment schedule intact.",
                )
            )

        if balance > payment * Decimal("2"):
            suggestions.append(
                AISuggestion(
                    recommendation="Early repayment is financially viable.",
                    confidence=Decimal("0.81"),
                    suggested_action="Use any surplus cash to pay ahead and reduce future interest exposure.",
                    impact="Decreases interest burden and shortens the repayment timeline.",
                )
            )

        suggestions.append(
            AISuggestion(
                recommendation="Keep repayment aligned with cash flow timing.",
                confidence=Decimal("0.90"),
                suggested_action="Rebalance your schedule around revenue inflows and escrow milestones.",
                impact="Improves financial stability and reduces repayment pressure.",
            )
        )

        return suggestions

    @classmethod
    def recommend_loan_restructure(
        cls,
        remaining_amount: Decimal | int | float | str,
        revenue_stream: Decimal | int | float | str,
    ) -> AISuggestion:
        balance = cls.money(remaining_amount)
        revenue = cls.money(revenue_stream)

        if revenue <= 0:
            return AISuggestion(
                recommendation="Revenue has stalled and the current plan is under stress.",
                confidence=Decimal("0.95"),
                suggested_action="Consider a temporary repayment restructuring or reduced payment plan.",
                impact="Prevents default while preserving operational liquidity.",
            )

        return AISuggestion(
            recommendation="The existing structure remains viable, but a small restructure may improve flexibility.",
            confidence=Decimal("0.82"),
            suggested_action="Recalibrate the monthly schedule based on revenue stability and maintain a minimum reserve buffer.",
            impact="Improves repayment reliability without overextending the wallet.",
        )


__all__ = [
    "AISuggestionService",
    "AISuggestion",
]
