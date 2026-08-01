from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class RevenueRepository:
    """Repository-style data access for revenue records in the repayment domain."""

    def __init__(self):
        self._revenues: Dict[str, Dict[str, Any]] = {}

    def create(self, revenue: Dict[str, Any]) -> Dict[str, Any]:
        self._revenues[revenue["revenue_id"]] = revenue
        return revenue

    def get_by_id(self, revenue_id: str) -> Optional[Dict[str, Any]]:
        return self._revenues.get(revenue_id)

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [revenue for revenue in self._revenues.values() if revenue.get("user_id") == user_id]

    def get_by_wallet(self, wallet_id: str) -> List[Dict[str, Any]]:
        return [revenue for revenue in self._revenues.values() if revenue.get("wallet_id") == wallet_id]

    def list(self) -> List[Dict[str, Any]]:
        return list(self._revenues.values())

    def update(self, revenue_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        revenue = self._revenues.get(revenue_id)
        if revenue is None:
            return None
        revenue.update(updates)
        return revenue

    def delete(self, revenue_id: str) -> bool:
        if revenue_id in self._revenues:
            del self._revenues[revenue_id]
            return True
        return False

    def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        return [revenue for revenue in self._revenues.values() if revenue.get("status") == status]

    def get_by_source(self, source: str) -> List[Dict[str, Any]]:
        return [revenue for revenue in self._revenues.values() if revenue.get("source") == source]

    def total_revenue(self, user_id: Optional[str] = None) -> Decimal:
        revenues = self._revenues.values()
        if user_id is not None:
            revenues = [revenue for revenue in revenues if revenue.get("user_id") == user_id]
        return sum((Decimal(str(revenue.get("amount", "0.00"))) for revenue in revenues), Decimal("0.00"))


__all__ = ["RevenueRepository"]
