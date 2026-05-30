from fastapi import HTTPException, status
from uuid import UUID

from app.core.supabase import get_supabase
from app.core.pagination import paginate
from app.schemas.pet_friendly import PetFriendlyPlace, PetFriendlyPlaceCreate


async def list_places(page: int, limit: int, categoria: str | None) -> dict:
    supabase = get_supabase()
    query = supabase.table("pet_friendly_places").select("*", count="exact").order("nombre", desc=False)
    if categoria:
        query = query.eq("categoria", categoria)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [PetFriendlyPlace.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def create_place(user_id: str, data: PetFriendlyPlaceCreate) -> PetFriendlyPlace:
    supabase = get_supabase()
    result = (
        supabase.table("pet_friendly_places")
        .insert({**data.model_dump(), "created_by": user_id, "fuente": "usuario"})
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error al crear el lugar")
    return PetFriendlyPlace.model_validate(result.data[0])
