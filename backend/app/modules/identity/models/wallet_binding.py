from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class WalletType(enum.Enum):
    ETHEREUM = "ETHEREUM"
    SOLANA = "SOLANA"
    BITCOIN = "BITCOIN"
    OTHER = "OTHER"


class VerificationStatus(enum.Enum):
    PENDING = "PENDING"
    VERIFIED = "VERIFIED"
    REJECTED = "REJECTED"


class WalletBinding(Base):
    __tablename__ = "wallet_bindings"

    id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, nullable=False, unique=True
    )
    agent_id: Mapped[uuid.UUID] = mapped_column(
        PG_UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    wallet_address: Mapped[str] = mapped_column(String(255), nullable=False, unique=True, index=True)
    wallet_type: Mapped[WalletType] = mapped_column(
        SAEnum(WalletType, name="wallet_type", native_enum=False), nullable=False
    )
    network: Mapped[str] = mapped_column(String(100), nullable=True)
    is_primary: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    verification_status: Mapped[VerificationStatus] = mapped_column(
        SAEnum(VerificationStatus, name="wallet_verification_status", native_enum=False), nullable=False, default=VerificationStatus.PENDING
    )
    bound_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    last_verified_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __repr__(self) -> str:  # pragma: no cover - trivial
        return f"<WalletBinding id={self.id} address={self.wallet_address} status={self.verification_status}>"
