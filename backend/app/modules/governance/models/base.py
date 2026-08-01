"""
Base class for all Governance module database models.

This file provides the SQLAlchemy Declarative Base that will be shared
across all Governance models. Keeping it inside the Governance module
ensures the module remains self-contained and does not modify the
project's global database architecture.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for Governance module models."""
    pass