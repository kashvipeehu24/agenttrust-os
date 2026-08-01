from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class PaymentRepository:
    """Repository-style data access for payment records in the repayment domain."""

    def __init__(self):
        self._payments: Dict[str, Dict[str, Any]] = {}

    def create(self, payment: Dict[str, Any]) -> Dict[str, Any]:
        self._payments[payment["payment_id"]] = payment
        return payment

    def get_by_id(self, payment_id: str) -> Optional[Dict[str, Any]]:
        return self._payments.get(payment_id)

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [payment for payment in self._payments.values() if payment.get("user_id") == user_id]

    def get_by_wallet(self, wallet_id: str) -> List[Dict[str, Any]]:
        return [payment for payment in self._payments.values() if payment.get("wallet_id") == wallet_id]

    def list(self) -> List[Dict[str, Any]]:
        return list(self._payments.values())

    def update(self, payment_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        payment = self._payments.get(payment_id)
        if payment is None:
            return None
        payment.update(updates)
        return payment

    def delete(self, payment_id: str) -> bool:
        if payment_id in self._payments:
            del self._payments[payment_id]
            return True
        return False

    def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        return [payment for payment in self._payments.values() if payment.get("status") == status]

    def get_by_type(self, type_name: str) -> List[Dict[str, Any]]:
        return [payment for payment in self._payments.values() if payment.get("type") == type_name]

    def total_amount(self, user_id: Optional[str] = None) -> Decimal:
        payments = self._payments.values()
        if user_id is not None:
            payments = [payment for payment in payments if payment.get("user_id") == user_id]
        return sum((Decimal(str(payment.get("amount", "0.00"))) for payment in payments), Decimal("0.00"))


__all__ = ["PaymentRepository"]
