"""
Monitoring Service

Business logic for live monitoring of AI agents,
wallets, loans and transactions.
"""

from typing import Dict, List


class MonitoringService:

    def __init__(self):
        self._events: List[dict] = []

    # ---------------------------------------------------------
    # Add Event
    # ---------------------------------------------------------

    def add_event(
        self,
        event: Dict
    ) -> Dict:

        self._events.append(event)

        return event

    # ---------------------------------------------------------
    # Get All Events
    # ---------------------------------------------------------

    def get_events(
        self
    ) -> List[Dict]:

        return self._events

    # ---------------------------------------------------------
    # Clear Events
    # ---------------------------------------------------------

    def clear_events(
        self
    ) -> bool:

        self._events.clear()

        return True

    # ---------------------------------------------------------
    # Statistics
    # ---------------------------------------------------------

    def statistics(
        self
    ) -> Dict:

        return {
            "total_events": len(self._events)
        }