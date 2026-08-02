from __future__ import annotations

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Path, status

from app.modules.identity.models.agent_skill_profile import AgentSkillProfile
from app.modules.identity.schemas.agent_skill_profile import (
    AgentSkillProfileCreateSchema,
    AgentSkillProfileResponseSchema,
    AgentSkillProfileUpdateSchema,
)
from app.modules.identity.services.agent_skill_profile_service import AgentSkillProfileService


router = APIRouter(prefix="/skills", tags=["identity-skills"])


def get_agent_skill_profile_service() -> AgentSkillProfileService:
    raise NotImplementedError("Provide AgentSkillProfileService dependency")


@router.post("/", response_model=AgentSkillProfileResponseSchema)
async def add_skill(payload: AgentSkillProfileCreateSchema, service: AgentSkillProfileService = Depends(get_agent_skill_profile_service)) -> AgentSkillProfile:
    profile = AgentSkillProfile(
        agent_id=payload.agent_id,
        skill_name=payload.skill_name,
        category=payload.category,
        proficiency_level=payload.proficiency_level,
        confidence_score=payload.confidence_score,
        certified=payload.certified,
        last_assessed_at=payload.last_assessed_at,
        skill_metadata=payload.metadata,
    )
    created = await service.add_skill(profile)
    return created


@router.get("/{agent_id}", response_model=list[AgentSkillProfileResponseSchema])
async def list_skills(agent_id: uuid.UUID, service: AgentSkillProfileService = Depends(get_agent_skill_profile_service)) -> list[AgentSkillProfile]:
    return await service.list_skills(agent_id)


@router.patch("/", response_model=AgentSkillProfileResponseSchema)
async def update_skill(payload: AgentSkillProfileUpdateSchema, service: AgentSkillProfileService = Depends(get_agent_skill_profile_service)) -> AgentSkillProfile:
    profile = await service.repository.get_by_id(payload.id)
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill profile not found")

    updates = {
        key: value
        for key, value in payload.model_dump(exclude_unset=True).items()
        if key != "id"
    }
    updated = await service.update_skill(profile, **updates)
    return updated


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_skill(skill_id: uuid.UUID = Path(...), service: AgentSkillProfileService = Depends(get_agent_skill_profile_service)) -> None:
    try:
        await service.remove_skill(skill_id)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc))
