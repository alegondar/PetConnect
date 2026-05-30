from fastapi import APIRouter, Depends, Query

from app.core.auth import get_current_user
from app.schemas.pet_friendly import PetFriendlyPlace, PetFriendlyPlaceCreate
from app.services import pet_friendly_service

router = APIRouter(prefix="/pet-friendly", tags=["PetFriendly"])


@router.get("")
async def list_places(
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=200),
    categoria: str | None = None,
):
    return await pet_friendly_service.list_places(page, limit, categoria)


@router.post("", response_model=PetFriendlyPlace, status_code=201)
async def create_place(
    data: PetFriendlyPlaceCreate,
    user: dict = Depends(get_current_user),
):
    return await pet_friendly_service.create_place(user["id"], data)
