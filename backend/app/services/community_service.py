from fastapi import HTTPException, status
from uuid import UUID

from app.core.supabase import get_supabase
from app.core.pagination import paginate
from app.schemas.community import (
    LostPet, LostPetDetail, CreateLostPetRequest, UpdateLostPetRequest,
    Adoption, AdoptionDetail, CreateAdoptionRequest, UpdateAdoptionRequest,
)


async def list_lost_pets(page: int, limit: int, status_filter: str | None) -> dict:
    supabase = get_supabase()
    query = supabase.table("lost_pets").select("*", count="exact").order("created_at", desc=True)
    if status_filter:
        query = query.eq("status", status_filter)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [LostPet.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def get_lost_pet(lost_id: UUID) -> LostPetDetail:
    supabase = get_supabase()
    result = supabase.table("lost_pets").select("*, reporter:profiles(*)").eq("id", str(lost_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reporte no encontrado")
    return LostPetDetail.model_validate(result.data)


async def create_lost_pet(reporter_id: str, data: CreateLostPetRequest) -> LostPet:
    supabase = get_supabase()
    result = supabase.table("lost_pets").insert({**data.model_dump(), "reporter_id": reporter_id}).execute()
    return LostPet.model_validate(result.data[0])


async def update_lost_pet(lost_id: UUID, user_id: str, data: UpdateLostPetRequest) -> LostPet:
    supabase = get_supabase()
    existing = supabase.table("lost_pets").select("reporter_id").eq("id", str(lost_id)).single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reporte no encontrado")
    if existing.data["reporter_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este reporte")
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    result = supabase.table("lost_pets").update(update_data).eq("id", str(lost_id)).execute()
    return LostPet.model_validate(result.data[0])


async def delete_lost_pet(lost_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    existing = supabase.table("lost_pets").select("reporter_id").eq("id", str(lost_id)).single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reporte no encontrado")
    if existing.data["reporter_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este reporte")
    supabase.table("lost_pets").delete().eq("id", str(lost_id)).execute()


async def list_adoptions(page: int, limit: int, status_filter: str | None) -> dict:
    supabase = get_supabase()
    query = supabase.table("adoptions").select("*", count="exact").order("created_at", desc=True)
    if status_filter:
        query = query.eq("status", status_filter)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [Adoption.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def get_adoption(adoption_id: UUID) -> AdoptionDetail:
    supabase = get_supabase()
    result = supabase.table("adoptions").select("*, pet:pets(*), owner:profiles!adoptions_owner_id_fkey(*), adopter:profiles!adoptions_adopter_id_fkey(*)").eq("id", str(adoption_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adopción no encontrada")
    return AdoptionDetail.model_validate(result.data)


async def create_adoption(owner_id: str, data: CreateAdoptionRequest) -> Adoption:
    supabase = get_supabase()
    result = supabase.table("adoptions").insert({"owner_id": owner_id, "pet_id": str(data.pet_id), "description": data.description}).execute()
    return Adoption.model_validate(result.data[0])


async def update_adoption(adoption_id: UUID, user_id: str, data: UpdateAdoptionRequest) -> Adoption:
    supabase = get_supabase()
    existing = supabase.table("adoptions").select("owner_id").eq("id", str(adoption_id)).single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adopción no encontrada")
    if existing.data["owner_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el dueño de esta publicación")
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if "adopter_id" in update_data and update_data["adopter_id"]:
        update_data["adopter_id"] = str(update_data["adopter_id"])
    result = supabase.table("adoptions").update(update_data).eq("id", str(adoption_id)).execute()
    return Adoption.model_validate(result.data[0])


async def delete_adoption(adoption_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    existing = supabase.table("adoptions").select("owner_id").eq("id", str(adoption_id)).single().execute()
    if not existing.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Adopción no encontrada")
    if existing.data["owner_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el dueño de esta publicación")
    supabase.table("adoptions").delete().eq("id", str(adoption_id)).execute()
