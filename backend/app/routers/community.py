from fastapi import APIRouter, Depends, Query
from uuid import UUID

from app.core.auth import get_current_user
from app.schemas.community import (
    LostPet, LostPetDetail, CreateLostPetRequest, UpdateLostPetRequest,
    Adoption, AdoptionDetail, CreateAdoptionRequest, UpdateAdoptionRequest,
)
from app.services import community_service

router = APIRouter(tags=["LostPets", "Adoptions"])

# Lost pets
lost_router = APIRouter(prefix="/lost-pets", tags=["LostPets"])


@lost_router.get("")
async def list_lost_pets(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str | None = None,
):
    return await community_service.list_lost_pets(page, limit, status)


@lost_router.get("/{lost_id}", response_model=LostPetDetail)
async def get_lost_pet(lost_id: UUID):
    return await community_service.get_lost_pet(lost_id)


@lost_router.post("", response_model=LostPet, status_code=201)
async def create_lost_pet(data: CreateLostPetRequest, user: dict = Depends(get_current_user)):
    return await community_service.create_lost_pet(user["id"], data)


@lost_router.put("/{lost_id}", response_model=LostPet)
async def update_lost_pet(lost_id: UUID, data: UpdateLostPetRequest, user: dict = Depends(get_current_user)):
    return await community_service.update_lost_pet(lost_id, user["id"], data)


@lost_router.delete("/{lost_id}", status_code=204)
async def delete_lost_pet(lost_id: UUID, user: dict = Depends(get_current_user)):
    await community_service.delete_lost_pet(lost_id, user["id"])


# Adoptions
adoption_router = APIRouter(prefix="/adoptions", tags=["Adoptions"])


@adoption_router.get("")
async def list_adoptions(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    status: str | None = None,
):
    return await community_service.list_adoptions(page, limit, status)


@adoption_router.get("/{adoption_id}", response_model=AdoptionDetail)
async def get_adoption(adoption_id: UUID):
    return await community_service.get_adoption(adoption_id)


@adoption_router.post("", response_model=Adoption, status_code=201)
async def create_adoption(data: CreateAdoptionRequest, user: dict = Depends(get_current_user)):
    return await community_service.create_adoption(user["id"], data)


@adoption_router.put("/{adoption_id}", response_model=Adoption)
async def update_adoption(adoption_id: UUID, data: UpdateAdoptionRequest, user: dict = Depends(get_current_user)):
    return await community_service.update_adoption(adoption_id, user["id"], data)


@adoption_router.delete("/{adoption_id}", status_code=204)
async def delete_adoption(adoption_id: UUID, user: dict = Depends(get_current_user)):
    await community_service.delete_adoption(adoption_id, user["id"])


router.include_router(lost_router)
router.include_router(adoption_router)
