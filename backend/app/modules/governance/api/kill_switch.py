"""
Kill Switch API

Provides emergency controls for autonomous AI agents.

Supported actions:
- Freeze Wallet
- Stop Transactions
- Disable Agent
- Emergency Freeze
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/kill-switch",
    tags=["Kill Switch"]
)

# Temporary in-memory state
kill_switch_state = {
    "wallet_frozen": False,
    "transactions_enabled": True,
    "agent_enabled": True,
    "emergency_mode": False
}


@router.get("/")
def get_status():
    """
    Get current kill switch status.
    """
    return kill_switch_state


@router.post("/freeze-wallet")
def freeze_wallet():
    """
    Freeze wallet operations.
    """
    kill_switch_state["wallet_frozen"] = True

    return {
        "message": "Wallet frozen successfully",
        "status": kill_switch_state
    }


@router.post("/unfreeze-wallet")
def unfreeze_wallet():
    """
    Restore wallet operations.
    """
    kill_switch_state["wallet_frozen"] = False

    return {
        "message": "Wallet unfrozen successfully",
        "status": kill_switch_state
    }


@router.post("/disable-agent")
def disable_agent():
    """
    Disable autonomous AI agent.
    """
    kill_switch_state["agent_enabled"] = False

    return {
        "message": "Agent disabled",
        "status": kill_switch_state
    }


@router.post("/enable-agent")
def enable_agent():
    """
    Enable autonomous AI agent.
    """
    kill_switch_state["agent_enabled"] = True

    return {
        "message": "Agent enabled",
        "status": kill_switch_state
    }


@router.post("/stop-transactions")
def stop_transactions():
    """
    Stop all outgoing transactions.
    """
    kill_switch_state["transactions_enabled"] = False

    return {
        "message": "Transactions stopped",
        "status": kill_switch_state
    }


@router.post("/resume-transactions")
def resume_transactions():
    """
    Resume transactions.
    """
    kill_switch_state["transactions_enabled"] = True

    return {
        "message": "Transactions resumed",
        "status": kill_switch_state
    }


@router.post("/emergency-freeze")
def emergency_freeze():
    """
    Activate emergency mode.
    """
    kill_switch_state["wallet_frozen"] = True
    kill_switch_state["transactions_enabled"] = False
    kill_switch_state["agent_enabled"] = False
    kill_switch_state["emergency_mode"] = True

    return {
        "message": "Emergency Freeze Activated",
        "status": kill_switch_state
    }


@router.post("/reset")
def reset():
    """
    Restore normal operations.
    """
    kill_switch_state["wallet_frozen"] = False
    kill_switch_state["transactions_enabled"] = True
    kill_switch_state["agent_enabled"] = True
    kill_switch_state["emergency_mode"] = False

    return {
        "message": "System restored",
        "status": kill_switch_state
    }