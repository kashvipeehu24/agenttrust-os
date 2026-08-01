from __future__ import annotations

import uuid
from datetime import datetime
from typing import Optional

from app.modules.identity.models.agent_did import AgentDID, AgentDIDStatus
from app.modules.identity.repositories.agent_did_repository import AgentDIDRepository


class AgentDIDService:
    def __init__(self, repository: AgentDIDRepository) -> None:
        self.repository = repository

    async def create_did(
        self,
        agent_id: uuid.UUID,
        method: str | None = None,
        public_key: str | None = None,
        document_url: str | None = None,
        verification_method: str | None = None,
        controller: str | None = None,
    ) -> AgentDID:
        import uuid as _uuid

        method = method or "example"
        did_value = f"did:{method}:{_uuid.uuid4()}"
        public_key = public_key or f"pubkey-{_uuid.uuid4()}"
        verification_method = verification_method or "key-1"
        controller = controller or str(agent_id)

        did = AgentDID(
            agent_id=agent_id,
            did=did_value,
            method=method,
            public_key=public_key,
            document_url=document_url,
            verification_method=verification_method,
            controller=controller,
            status=AgentDIDStatus.ACTIVE,
        )
        return await self.repository.create(did)

    async def get_did_by_agent(self, agent_id: uuid.UUID) -> Optional[AgentDID]:
        return await self.repository.get_by_agent_id(agent_id)

    async def get_did_by_did(self, did_str: str) -> Optional[AgentDID]:
        return await self.repository.get_by_did(did_str)

    async def rotate_key(self, did_str: str, new_public_key: str) -> AgentDID:
        did = await self.repository.get_by_did(did_str)
        if not did:
            raise ValueError("did not found")
        did.public_key = new_public_key
        return await self.repository.update(did, public_key=new_public_key)

    async def revoke_did(self, did_str: str) -> AgentDID:
        did = await self.repository.get_by_did(did_str)
        if not did:
            raise ValueError("did not found")
        did.status = AgentDIDStatus.REVOKED
        return await self.repository.update(did, status=did.status)

    async def suspend_did(self, did_str: str) -> AgentDID:
        did = await self.repository.get_by_did(did_str)
        if not did:
            raise ValueError("did not found")
        did.status = AgentDIDStatus.SUSPENDED
        return await self.repository.update(did, status=did.status)
