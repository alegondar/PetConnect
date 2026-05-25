from fastapi import APIRouter, Depends, Query, UploadFile, File
import uuid as _uuid
from uuid import UUID

from app.config import SUPABASE_URL
from app.core.auth import get_current_user
from app.core.supabase import get_supabase
from app.schemas.pet import (
    Pet, CreatePetRequest, UpdatePetRequest,
    VetVisit, CreateVetVisitRequest,
    PetEvent, CreatePetEventRequest,
)
from app.services import pet_service

router = APIRouter(prefix="/pets", tags=["Pets"])


@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...), user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    contents = await file.read()
    path = f"{user['id']}/{_uuid.uuid4().hex[:8]}-{file.filename or 'photo'}"
    supabase.storage.from_("pets").upload(
        path=path,
        file=contents,
        file_options={"content-type": file.content_type or "image/jpeg"},
    )
    public_url = f"{SUPABASE_URL}/storage/v1/object/public/pets/{path}"
    return {"url": public_url}


@router.get("")
async def list_pets(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    species: str | None = None,
    owner_id: str | None = None,
):
    return await pet_service.list_pets(page, limit, species, owner_id)


@router.get("/{pet_id}", response_model=Pet)
async def get_pet(pet_id: UUID):
    return await pet_service.get_pet(pet_id)


@router.post("", response_model=Pet, status_code=201)
async def create_pet(data: CreatePetRequest, user: dict = Depends(get_current_user)):
    return await pet_service.create_pet(user["id"], data)


@router.put("/{pet_id}", response_model=Pet)
async def update_pet(pet_id: UUID, data: UpdatePetRequest, user: dict = Depends(get_current_user)):
    return await pet_service.update_pet(pet_id, user["id"], data)


@router.delete("/{pet_id}", status_code=204)
async def delete_pet(pet_id: UUID, user: dict = Depends(get_current_user)):
    await pet_service.delete_pet(pet_id, user["id"])


# Vet visits (nested under pets)
vet_visits_router = APIRouter(prefix="/{pet_id}/vet-visits", tags=["VetVisits"])


@vet_visits_router.get("")
async def list_vet_visits(
    pet_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await pet_service.list_vet_visits(pet_id, page, limit)


@vet_visits_router.post("", response_model=VetVisit, status_code=201)
async def create_vet_visit(pet_id: UUID, data: CreateVetVisitRequest, user: dict = Depends(get_current_user)):
    await pet_service.verify_pet_owner(pet_id, user["id"])
    return await pet_service.create_vet_visit(pet_id, data)


@vet_visits_router.put("/{visit_id}", response_model=VetVisit)
async def update_vet_visit(visit_id: UUID, data: CreateVetVisitRequest, user: dict = Depends(get_current_user)):
    return await pet_service.update_vet_visit(visit_id, data)


@vet_visits_router.delete("/{visit_id}", status_code=204)
async def delete_vet_visit(visit_id: UUID, user: dict = Depends(get_current_user)):
    await pet_service.delete_vet_visit(visit_id)


# Pet events (nested under pets)
events_router = APIRouter(prefix="/{pet_id}/events", tags=["PetEvents"])


@events_router.get("")
async def list_events(
    pet_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await pet_service.list_pet_events(pet_id, page, limit)


@events_router.post("", response_model=PetEvent, status_code=201)
async def create_event(pet_id: UUID, data: CreatePetEventRequest, user: dict = Depends(get_current_user)):
    await pet_service.verify_pet_owner(pet_id, user["id"])
    return await pet_service.create_pet_event(pet_id, data)


@events_router.put("/{event_id}", response_model=PetEvent)
async def update_event(event_id: UUID, data: CreatePetEventRequest, user: dict = Depends(get_current_user)):
    return await pet_service.update_pet_event(event_id, data)


@events_router.delete("/{event_id}", status_code=204)
async def delete_event(event_id: UUID, user: dict = Depends(get_current_user)):
    await pet_service.delete_pet_event(event_id)


router.include_router(vet_visits_router)
router.include_router(events_router)
