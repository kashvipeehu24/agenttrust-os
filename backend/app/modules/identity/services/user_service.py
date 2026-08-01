from __future__ import annotations

import uuid
from typing import Any, Optional

from app.modules.identity.models.user import User
from app.modules.identity.repositories.user_repository import UserRepository


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    async def create_user(self, user: User) -> User:
        return await self.repository.create(user)

    async def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        return await self.repository.get_by_id(user_id)

    async def list_users(self) -> list[User]:
        return await self.repository.get_all()

    async def update_user(self, user: User, **values: Any) -> User:
        return await self.repository.update(user, **values)

    async def delete_user(self, user: User) -> None:
        await self.repository.delete(user)
