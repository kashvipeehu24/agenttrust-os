from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, constr

from app.modules.identity.models.wallet_binding import WalletType, VerificationStatus


class WalletBindSchema(BaseModel):
    agent_id: uuid.UUID = Field(...)
    wallet_address: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(...)
    wallet_type: WalletType = Field(...)
    network: Optional[str] = Field(None)
    is_primary: Optional[bool] = Field(False)


class WalletVerifySchema(BaseModel):
    wallet_address: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(...)
    verification_status: VerificationStatus = Field(...)


class WalletPrimarySchema(BaseModel):
    wallet_address: constr(strip_whitespace=True, min_length=1, max_length=255) = Field(...)


class WalletResponseSchema(BaseModel):
    id: uuid.UUID
    agent_id: uuid.UUID
    wallet_address: str
    wallet_type: WalletType
    network: Optional[str]
    is_primary: bool
    verification_status: VerificationStatus
    bound_at: datetime
    last_verified_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
