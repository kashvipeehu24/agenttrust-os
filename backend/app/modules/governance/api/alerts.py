"""
Security Alerts API

Provides APIs for generating, retrieving,
and clearing security alerts.
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/alerts",
    tags=["Security Alerts"]
)

# Temporary in-memory storage
alerts = []


@router.post("/")
def create_alert(alert: dict):
    """
    Create a security alert.
    """
    alerts.append(alert)

    return {
        "message": "Alert created successfully",
        "alert": alert
    }


@router.get("/")
def get_alerts():
    """
    Retrieve all alerts.
    """
    return alerts


@router.get("/count")
def alert_count():
    """
    Get alert statistics.
    """
    return {
        "total_alerts": len(alerts)
    }


@router.delete("/")
def clear_alerts():
    """
    Clear all alerts.
    """
    alerts.clear()

    return {
        "message": "All alerts cleared"
    }