from __future__ import annotations

import uuid
from typing import Any, Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.identity.models.wallet_binding import WalletBinding


class WalletBindingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(self, binding: WalletBinding) -> WalletBinding:
        self.session.add(binding)
        await self.session.commit()
        await self.session.refresh(binding)
        return binding

    async def get_by_id(self, binding_id: uuid.UUID) -> Optional[WalletBinding]:
        return await self.session.get(WalletBinding, binding_id)

    async def get_by_wallet_address(self, wallet_address: str) -> Optional[WalletBinding]:
        stmt = select(WalletBinding).where(WalletBinding.wallet_address == wallet_address)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def list_by_agent(self, agent_id: uuid.UUID) -> list[WalletBinding]:
        stmt = select(WalletBinding).where(WalletBinding.agent_id == agent_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update(self, binding: WalletBinding, **values: Any) -> WalletBinding:
        for key, value in values.items():
            setattr(binding, key, value)
        self.session.add(binding)
        await self.session.commit()
        await self.session.refresh(binding)
        return binding

    async def unset_primary_for_agent(self, agent_id: uuid.UUID) -> None:
        stmt = update(WalletBinding).where(WalletBinding.agent_id == agent_id).values(is_primary=False)
        await self.session.execute(stmt)
        await self.session.commit()

    async def delete(self, binding: WalletBinding) -> None:
        await self.session.delete(binding)
        await self.session.commit()
