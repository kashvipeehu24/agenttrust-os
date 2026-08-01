from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class TransactionRepository:
    """Repository-style data access for transaction records in the repayment domain."""

    def __init__(self):
        self._transactions: Dict[str, Dict[str, Any]] = {}

    def create(self, transaction: Dict[str, Any]) -> Dict[str, Any]:
        self._transactions[transaction["transaction_id"]] = transaction
        return transaction

    def get_by_id(self, transaction_id: str) -> Optional[Dict[str, Any]]:
        return self._transactions.get(transaction_id)

    def get_by_wallet(self, wallet_id: str) -> List[Dict[str, Any]]:
        return [tx for tx in self._transactions.values() if tx.get("wallet_id") == wallet_id]

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [tx for tx in self._transactions.values() if tx.get("user_id") == user_id]

    def list(self) -> List[Dict[str, Any]]:
        return list(self._transactions.values())

    def update(self, transaction_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        tx = self._transactions.get(transaction_id)
        if tx is None:
            return None
        tx.update(updates)
        return tx

    def delete(self, transaction_id: str) -> bool:
        if transaction_id in self._transactions:
            del self._transactions[transaction_id]
            return True
        return False

    def get_by_status(self, status: str) -> List[Dict[str, Any]]:
        return [tx for tx in self._transactions.values() if tx.get("status") == status]

    def get_by_type(self, type_name: str) -> List[Dict[str, Any]]:
        return [tx for tx in self._transactions.values() if tx.get("type") == type_name]

    def total_amount(self, wallet_id: Optional[str] = None) -> Decimal:
        transactions = self._transactions.values()
        if wallet_id is not None:
            transactions = [tx for tx in transactions if tx.get("wallet_id") == wallet_id]
        return sum((Decimal(str(tx.get("amount", "0.00"))) for tx in transactions), Decimal("0.00"))


__all__ = ["TransactionRepository"]
