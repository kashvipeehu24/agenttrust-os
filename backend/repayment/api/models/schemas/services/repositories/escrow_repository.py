from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class EscrowRepository:
    """Repository-style data access for escrow records in the repayment domain."""

    def __init__(self):
        self._escrows: Dict[str, Dict[str, Any]] = {}

    def create(self, escrow: Dict[str, Any]) -> Dict[str, Any]:
        self._escrows[escrow["escrow_id"]] = escrow
        return escrow

    def get_by_id(self, escrow_id: str) -> Optional[Dict[str, Any]]:
        return self._escrows.get(escrow_id)

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [escrow for escrow in self._escrows.values() if escrow.get("user_id") == user_id]

    def get_by_wallet(self, wallet_id: str) -> List[Dict[str, Any]]:
        return [escrow for escrow in self._escrows.values() if escrow.get("wallet_id") == wallet_id]

    def list(self) -> List[Dict[str, Any]]:
        return list(self._escrows.values())

    def update(self, escrow_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        escrow = self._escrows.get(escrow_id)
        if escrow is None:
            return None
        escrow.update(updates)
        return escrow

    def delete(self, escrow_id: str) -> bool:
        if escrow_id in self._escrows:
            del self._escrows[escrow_id]
            return True
        return False

    def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        return [escrow for escrow in self._escrows.values() if escrow.get("status") == status]

    def total_amount(self, user_id: Optional[str] = None) -> Decimal:
        escrows = self._escrows.values()
        if user_id is not None:
            escrows = [escrow for escrow in escrows if escrow.get("user_id") == user_id]
        return sum((Decimal(str(escrow.get("amount", "0.00"))) for escrow in escrows), Decimal("0.00"))


__all__ = ["EscrowRepository"]
