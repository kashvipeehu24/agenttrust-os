from __future__ import annotations

import uuid
from datetime import datetime
from typing import List, Optional

from app.modules.identity.models.wallet_binding import WalletBinding, VerificationStatus
from app.modules.identity.repositories.wallet_binding_repository import WalletBindingRepository


class WalletBindingService:
    def __init__(self, repository: WalletBindingRepository) -> None:
        self.repository = repository

    async def bind_wallet(self, binding: WalletBinding) -> WalletBinding:
        existing = await self.repository.get_by_wallet_address(binding.wallet_address)
        if existing:
            raise ValueError("wallet_address already bound")
        if binding.is_primary:
            await self.repository.unset_primary_for_agent(binding.agent_id)
        binding.bound_at = binding.bound_at or datetime.utcnow()
        binding.verification_status = VerificationStatus.PENDING
        return await self.repository.create(binding)

    async def verify_wallet(self, wallet_address: str, status: VerificationStatus) -> WalletBinding:
        binding = await self.repository.get_by_wallet_address(wallet_address)
        if not binding:
            raise ValueError("wallet not found")
        binding.verification_status = status
        binding.last_verified_at = datetime.utcnow()
        return await self.repository.update(binding, verification_status=binding.verification_status, last_verified_at=binding.last_verified_at)

    async def get_wallets(self, agent_id: uuid.UUID) -> List[WalletBinding]:
        return await self.repository.list_by_agent(agent_id)

    async def set_primary_wallet(self, wallet_address: str) -> WalletBinding:
        binding = await self.repository.get_by_wallet_address(wallet_address)
        if not binding:
            raise ValueError("wallet not found")
        await self.repository.unset_primary_for_agent(binding.agent_id)
        binding.is_primary = True
        return await self.repository.update(binding, is_primary=True)

    async def remove_wallet(self, wallet_id: uuid.UUID) -> None:
        binding = await self.repository.get_by_id(wallet_id)
        if not binding:
            raise ValueError("wallet not found")
        await self.repository.delete(binding)
