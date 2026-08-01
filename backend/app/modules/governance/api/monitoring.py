"""
Monitoring API

Provides live monitoring endpoints for transactions,
wallets, loans, and agent activities.
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/monitoring",
    tags=["Monitoring"]
)

# Temporary in-memory storage
monitoring_logs = []


@router.post("/")
def add_monitoring_event(event: dict):
    """
    Add a monitoring event.
    """
    monitoring_logs.append(event)

    return {
        "message": "Monitoring event added successfully",
        "event": event
    }


@router.get("/")
def get_monitoring_events():
    """
    Retrieve all monitoring events.
    """
    return monitoring_logs


@router.get("/health")
def monitoring_health():
    """
    Monitoring service health.
    """
    return {
        "status": "healthy",
        "events": len(monitoring_logs)
    }


@router.delete("/")
def clear_monitoring_logs():
    """
    Clear all monitoring logs.
    """
    monitoring_logs.clear()

    return {
        "message": "Monitoring logs cleared"
    }