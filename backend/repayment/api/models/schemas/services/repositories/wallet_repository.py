from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional


class WalletRepository:
    """Repository-style data access for wallet records in the repayment domain."""

    def __init__(self):
        self._wallets: Dict[str, Dict[str, Any]] = {}

    def create(self, wallet: Dict[str, Any]) -> Dict[str, Any]:
        self._wallets[wallet["wallet_id"]] = wallet
        return wallet

    def get_by_id(self, wallet_id: str) -> Optional[Dict[str, Any]]:
        return self._wallets.get(wallet_id)

    def get_by_user(self, user_id: str) -> List[Dict[str, Any]]:
        return [wallet for wallet in self._wallets.values() if wallet.get("user_id") == user_id]

    def update(self, wallet_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        wallet = self._wallets.get(wallet_id)
        if wallet is None:
            return None
        wallet.update(updates)
        return wallet

    def delete(self, wallet_id: str) -> bool:
        if wallet_id in self._wallets:
            del self._wallets[wallet_id]
            return True
        return False

    def list(self) -> List[Dict[str, Any]]:
        return list(self._wallets.values())

    def get_balance(self, wallet_id: str) -> Optional[Decimal]:
        wallet = self._wallets.get(wallet_id)
        if wallet is None:
            return None
        return Decimal(str(wallet.get("balance", "0.00")))

    def update_balance(self, wallet_id: str, new_balance: Decimal) -> Optional[Dict[str, Any]]:
        wallet = self._wallets.get(wallet_id)
        if wallet is None:
            return None
        wallet["balance"] = Decimal(str(new_balance))
        return wallet

    def update_loan_outstanding(self, wallet_id: str, new_amount: Decimal) -> Optional[Dict[str, Any]]:
        wallet = self._wallets.get(wallet_id)
        if wallet is None:
            return None
        wallet["loan_outstanding"] = Decimal(str(new_amount))
        return wallet

    def update_payment_status(self, wallet_id: str, status: str) -> Optional[Dict[str, Any]]:
        wallet = self._wallets.get(wallet_id)
        if wallet is None:
            return None
        wallet["payment_status"] = status
        return wallet


__all__ = ["WalletRepository"]
