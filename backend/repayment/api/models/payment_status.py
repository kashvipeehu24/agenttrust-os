from __future__ import annotations

from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, String

from .base import Base


class PaymentStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class PaymentStatusModel(Base):
    __tablename__ = "payment_statuses"

    id = Column(String, primary_key=True, index=True)
    payment_id = Column(String, index=True, nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.pending, nullable=False)
    updated_by = Column(String, default="system", nullable=False)
    reason = Column(String, default="No reason provided", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
