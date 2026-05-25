from fastapi import HTTPException, status
from uuid import UUID

from app.core.supabase import get_supabase
from app.core.pagination import paginate
from app.schemas.pet import (
    Pet, CreatePetRequest, UpdatePetRequest,
    VetVisit, CreateVetVisitRequest,
    PetEvent, CreatePetEventRequest,
)


async def list_pets(page: int, limit: int, species: str | None, owner_id: str | None) -> dict:
    supabase = get_supabase()
    query = supabase.table("pets").select("*", count="exact")
    if species:
        query = query.eq("species", species)
    if owner_id:
        query = query.eq("owner_id", owner_id)
    query = query.order("created_at", desc=True)
    start = (page - 1) * limit
    query = query.range(start, start + limit - 1)
    result = query.execute()
    total = result.count or 0
    items = [Pet.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def get_pet(pet_id: UUID) -> Pet:
    supabase = get_supabase()
    result = supabase.table("pets").select("*").eq("id", str(pet_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mascota no encontrada")
    return Pet.model_validate(result.data)


async def create_pet(owner_id: str, data: CreatePetRequest) -> Pet:
    supabase = get_supabase()
    result = supabase.table("pets").insert({**data.model_dump(), "owner_id": owner_id}).execute()
    return Pet.model_validate(result.data[0])


async def update_pet(pet_id: UUID, owner_id: str, data: UpdatePetRequest) -> Pet:
    supabase = get_supabase()
    pet = await get_pet(pet_id)
    if str(pet.owner_id) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el dueño de esta mascota")
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    result = supabase.table("pets").update(update_data).eq("id", str(pet_id)).execute()
    return Pet.model_validate(result.data[0])


async def delete_pet(pet_id: UUID, owner_id: str) -> None:
    supabase = get_supabase()
    pet = await get_pet(pet_id)
    if str(pet.owner_id) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el dueño de esta mascota")
    supabase.table("pets").delete().eq("id", str(pet_id)).execute()


async def verify_pet_owner(pet_id: UUID, owner_id: str) -> None:
    pet = await get_pet(pet_id)
    if str(pet.owner_id) != owner_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el dueño de esta mascota")


# Vet visits
async def list_vet_visits(pet_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("vet_visits").select("*", count="exact").eq("pet_id", str(pet_id)).order("visit_date", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [VetVisit.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def create_vet_visit(pet_id: UUID, data: CreateVetVisitRequest) -> VetVisit:
    supabase = get_supabase()
    result = supabase.table("vet_visits").insert({**data.model_dump(), "pet_id": str(pet_id)}).execute()
    return VetVisit.model_validate(result.data[0])


async def update_vet_visit(visit_id: UUID, data: CreateVetVisitRequest) -> VetVisit:
    supabase = get_supabase()
    result = supabase.table("vet_visits").update(data.model_dump()).eq("id", str(visit_id)).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visita no encontrada")
    return VetVisit.model_validate(result.data[0])


async def delete_vet_visit(visit_id: UUID) -> None:
    supabase = get_supabase()
    supabase.table("vet_visits").delete().eq("id", str(visit_id)).execute()


# Pet events
async def list_pet_events(pet_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("pet_events").select("*", count="exact").eq("pet_id", str(pet_id)).order("event_date", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [PetEvent.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def create_pet_event(pet_id: UUID, data: CreatePetEventRequest) -> PetEvent:
    supabase = get_supabase()
    result = supabase.table("pet_events").insert({**data.model_dump(), "pet_id": str(pet_id)}).execute()
    return PetEvent.model_validate(result.data[0])


async def update_pet_event(event_id: UUID, data: CreatePetEventRequest) -> PetEvent:
    supabase = get_supabase()
    result = supabase.table("pet_events").update(data.model_dump()).eq("id", str(event_id)).execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Evento no encontrado")
    return PetEvent.model_validate(result.data[0])


async def delete_pet_event(event_id: UUID) -> None:
    supabase = get_supabase()
    supabase.table("pet_events").delete().eq("id", str(event_id)).execute()
