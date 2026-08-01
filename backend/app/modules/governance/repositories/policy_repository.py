"""
Policy Repository

Handles database operations for Policy Rules.
"""

from sqlalchemy.orm import Session

from ..models.policy_rule import PolicyRule


class PolicyRepository:

    def __init__(self, db: Session):
        self.db = db

    # -------------------------------------------------------
    # Create
    # -------------------------------------------------------

    def create(
        self,
        policy: PolicyRule
    ) -> PolicyRule:

        self.db.add(policy)
        self.db.commit()
        self.db.refresh(policy)

        return policy

    # -------------------------------------------------------
    # Get One
    # -------------------------------------------------------

    def get(
        self,
        policy_id: str
    ):

        return (
            self.db.query(PolicyRule)
            .filter(PolicyRule.id == policy_id)
            .first()
        )

    # -------------------------------------------------------
    # Get All
    # -------------------------------------------------------

    def get_all(self):

        return self.db.query(PolicyRule).all()

    # -------------------------------------------------------
    # Update
    # -------------------------------------------------------

    def update(
        self,
        policy: PolicyRule
    ):

        self.db.commit()
        self.db.refresh(policy)

        return policy

    # -------------------------------------------------------
    # Delete
    # -------------------------------------------------------

    def delete(
        self,
        policy: PolicyRule
    ):

        self.db.delete(policy)
        self.db.commit()