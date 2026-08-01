"""
Audit API

Provides APIs for recording and retrieving governance
audit logs for security and compliance.
"""

from datetime import datetime
from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/audit",
    tags=["Audit"]
)

# Temporary in-memory storage
audit_logs = []


@router.post("/")
def create_audit_log(log: dict):
    """
    Record a new audit event.
    """

    log["timestamp"] = datetime.utcnow().isoformat()

    audit_logs.append(log)

    return {
        "message": "Audit log created successfully",
        "audit_log": log
    }


@router.get("/")
def get_all_logs():
    """
    Retrieve all audit logs.
    """
    return audit_logs


@router.get("/count")
def audit_statistics():
    """
    Return audit statistics.
    """
    return {
        "total_logs": len(audit_logs)
    }


@router.delete("/")
def clear_logs():
    """
    Remove all audit logs.
    """
    audit_logs.clear()

    return {
        "message": "Audit logs cleared successfully"
    }