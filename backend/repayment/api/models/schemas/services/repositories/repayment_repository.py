from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class RepaymentRepository:
    """Repository-style data access for repayment records in the repayment domain."""

    def __init__(self):
        self._repayments: Dict[str, Dict[str, Any]] = {}

    def create(self, repayment: Dict[str, Any]) -> Dict[str, Any]:
        self._repayments[repayment["repayment_id"]] = repayment
        return repayment

    def get_by_id(self, repayment_id: str) -> Optional[Dict[str, Any]]:
        return self._repayments.get(repayment_id)

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [repayment for repayment in self._repayments.values() if repayment.get("user_id") == user_id]

    def get_by_wallet(self, wallet_id: str) -> List[Dict[str, Any]]:
        return [repayment for repayment in self._repayments.values() if repayment.get("wallet_id") == wallet_id]

    def list(self) -> List[Dict[str, Any]]:
        return list(self._repayments.values())

    def update(self, repayment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        repayment = self._repayments.get(repayment_id)
        if repayment is None:
            return None
        repayment.update(updates)
        return repayment

    def delete(self, repayment_id: str) -> bool:
        if repayment_id in self._repayments:
            del self._repayments[repayment_id]
            return True
        return False

    def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        return [repayment for repayment in self._repayments.values() if repayment.get("payment_status") == status]

    def total_outstanding(self, user_id: Optional[str] = None) -> Decimal:
        repayments = self._repayments.values()
        if user_id is not None:
            repayments = [repayment for repayment in repayments if repayment.get("user_id") == user_id]
        return sum((Decimal(str(repayment.get("remaining_amount", "0.00"))) for repayment in repayments), Decimal("0.00"))

    def total_paid(self, user_id: Optional[str] = None) -> Decimal:
        repayments = self._repayments.values()
        if user_id is not None:
            repayments = [repayment for repayment in repayments if repayment.get("user_id") == user_id]
        return sum((Decimal(str(repayment.get("amount_paid", "0.00"))) for repayment in repayments), Decimal("0.00"))


__all__ = ["RepaymentRepository"]
