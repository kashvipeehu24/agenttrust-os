"""
Policy Management API

Provides APIs to create, update, retrieve, and delete
governance policies for autonomous AI agents.
"""

from fastapi import APIRouter

router = APIRouter(
    prefix="/governance/policies",
    tags=["Governance Policies"]
)

# -------------------------------------------------------------------
# Sample In-Memory Storage
# Replace with repository/database integration later.
# -------------------------------------------------------------------

policies = {}

# -------------------------------------------------------------------
# Create Policy
# -------------------------------------------------------------------

@router.post("/")
def create_policy(policy: dict):
    """
    Create a governance policy.
    """
    policy_id = str(len(policies) + 1)

    policies[policy_id] = policy

    return {
        "message": "Policy created successfully",
        "policy_id": policy_id,
        "policy": policy
    }


# -------------------------------------------------------------------
# Get All Policies
# -------------------------------------------------------------------

@router.get("/")
def get_all_policies():
    """
    Return all governance policies.
    """
    return list(policies.values())


# -------------------------------------------------------------------
# Get Policy
# -------------------------------------------------------------------

@router.get("/{policy_id}")
def get_policy(policy_id: str):
    """
    Retrieve a policy by ID.
    """
    if policy_id not in policies:
        return {
            "error": "Policy not found"
        }

    return policies[policy_id]


# -------------------------------------------------------------------
# Update Policy
# -------------------------------------------------------------------

@router.put("/{policy_id}")
def update_policy(policy_id: str, policy: dict):
    """
    Update an existing policy.
    """
    if policy_id not in policies:
        return {
            "error": "Policy not found"
        }

    policies[policy_id] = policy

    return {
        "message": "Policy updated",
        "policy": policy
    }


# -------------------------------------------------------------------
# Delete Policy
# -------------------------------------------------------------------

@router.delete("/{policy_id}")
def delete_policy(policy_id: str):
    """
    Delete a governance policy.
    """
    if policy_id not in policies:
        return {
            "error": "Policy not found"
        }

    del policies[policy_id]

    return {
        "message": "Policy deleted"
    }