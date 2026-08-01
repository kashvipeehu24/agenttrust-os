"""
Fraud Detection API

Provides APIs for recording, retrieving, and managing
fraud detection events.
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/fraud",
    tags=["Fraud Detection"]
)

# Temporary in-memory storage
fraud_events = []


@router.post("/")
def report_fraud(event: dict):
    """
    Report a fraud event.
    """
    fraud_events.append(event)

    return {
        "message": "Fraud event recorded",
        "event": event
    }


@router.get("/")
def get_fraud_events():
    """
    Retrieve all fraud events.
    """
    return fraud_events


@router.get("/count")
def fraud_count():
    """
    Return fraud statistics.
    """
    return {
        "total_fraud_events": len(fraud_events)
    }


@router.delete("/")
def clear_fraud_events():
    """
    Remove all fraud events.
    """
    fraud_events.clear()

    return {
        "message": "Fraud events cleared"
    }