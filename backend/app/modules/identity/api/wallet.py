from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Path, Query, status

from app.modules.identity.models.wallet_binding import WalletBinding
from app.modules.identity.schemas.wallet_binding import (
    WalletBindSchema,
    WalletVerifySchema,
    WalletPrimarySchema,
    WalletResponseSchema,
)
from app.modules.identity.services.wallet_binding_service import WalletBindingService


router = APIRouter(prefix="/wallet", tags=["identity-wallet"])


def get_wallet_service() -> WalletBindingService:
    raise NotImplementedError("Provide WalletBindingService dependency")


@router.post("/bind", response_model=WalletResponseSchema)
async def bind_wallet(payload: WalletBindSchema, service: WalletBindingService = Depends(get_wallet_service)) -> WalletBinding:
    binding = WalletBinding(
        agent_id=payload.agent_id,
        wallet_address=payload.wallet_address,
        wallet_type=payload.wallet_type,
        network=payload.network,
        is_primary=payload.is_primary or False,
    )
    try:
        created = await service.bind_wallet(binding)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))
    return created


@router.patch("/verify", response_model=WalletResponseSchema)
async def verify_wallet(payload: WalletVerifySchema, service: WalletBindingService = Depends(get_wallet_service)) -> WalletBinding:
    try:
        updated = await service.verify_wallet(payload.wallet_address, payload.verification_status)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated


@router.patch("/primary", response_model=WalletResponseSchema)
async def set_primary(payload: WalletPrimarySchema, service: WalletBindingService = Depends(get_wallet_service)) -> WalletBinding:
    try:
        updated = await service.set_primary_wallet(payload.wallet_address)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
    return updated


@router.get("/{agent_id}", response_model=list[WalletResponseSchema])
async def get_wallets(agent_id: str, service: WalletBindingService = Depends(get_wallet_service)) -> list[WalletBinding]:
    return await service.get_wallets(agent_id)


@router.delete("/{wallet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_wallet(wallet_id: str = Path(...), service: WalletBindingService = Depends(get_wallet_service)) -> None:
    try:
        await service.remove_wallet(wallet_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
