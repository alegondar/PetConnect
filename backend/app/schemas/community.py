from pydantic import BaseModel, Field
from datetime import datetime, date
from uuid import UUID
from app.schemas.profile import Profile
from app.schemas.pet import Pet


class LostPet(BaseModel):
    id: UUID
    reporter_id: UUID
    name: str
    species: str
    breed: str | None = None
    photo_url: str | None = None
    last_seen_lat: float
    last_seen_lng: float
    last_seen_address: str | None = None
    description: str | None = None
    status: str = "lost"
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LostPetDetail(LostPet):
    reporter: Profile | None = None


class CreateLostPetRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    species: str = Field(min_length=1, max_length=30)
    breed: str | None = None
    photo_url: str | None = None
    last_seen_lat: float
    last_seen_lng: float
    last_seen_address: str | None = None
    description: str | None = None


class UpdateLostPetRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    species: str | None = None
    breed: str | None = None
    photo_url: str | None = None
    last_seen_lat: float | None = None
    last_seen_lng: float | None = None
    last_seen_address: str | None = None
    description: str | None = None
    status: str | None = None


class Adoption(BaseModel):
    id: UUID
    pet_id: UUID
    owner_id: UUID
    adopter_id: UUID | None = None
    status: str = "available"
    description: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class AdoptionDetail(Adoption):
    pet: Pet | None = None
    owner: Profile | None = None
    adopter: Profile | None = None


class CreateAdoptionRequest(BaseModel):
    pet_id: UUID
    description: str | None = None


class UpdateAdoptionRequest(BaseModel):
    status: str | None = None
    adopter_id: UUID | None = None
    description: str | None = None
