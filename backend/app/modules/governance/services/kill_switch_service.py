"""
Kill Switch Service

Business logic for emergency controls.
"""

from typing import Dict


class KillSwitchService:

    def __init__(self):

        self._state = {
            "wallet_frozen": False,
            "transactions_enabled": True,
            "agent_enabled": True,
            "emergency_mode": False,
        }

    def status(self) -> Dict:
        return self._state

    def freeze_wallet(self) -> Dict:
        self._state["wallet_frozen"] = True
        return self._state

    def unfreeze_wallet(self) -> Dict:
        self._state["wallet_frozen"] = False
        return self._state

    def stop_transactions(self) -> Dict:
        self._state["transactions_enabled"] = False
        return self._state

    def resume_transactions(self) -> Dict:
        self._state["transactions_enabled"] = True
        return self._state

    def disable_agent(self) -> Dict:
        self._state["agent_enabled"] = False
        return self._state

    def enable_agent(self) -> Dict:
        self._state["agent_enabled"] = True
        return self._state

    def emergency_freeze(self) -> Dict:
        self._state["wallet_frozen"] = True
        self._state["transactions_enabled"] = False
        self._state["agent_enabled"] = False
        self._state["emergency_mode"] = True
        return self._state

    def reset(self) -> Dict:
        self._state = {
            "wallet_frozen": False,
            "transactions_enabled": True,
            "agent_enabled": True,
            "emergency_mode": False,
        }
        return self._state