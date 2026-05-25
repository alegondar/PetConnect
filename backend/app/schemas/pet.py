from pydantic import BaseModel, Field
from datetime import datetime, date
from uuid import UUID
from app.schemas.profile import Profile


class Pet(BaseModel):
    id: UUID
    owner_id: UUID
    name: str
    species: str
    breed: str | None = None
    age: int | None = None
    weight: float | None = None
    photo_url: str | None = None
    bio: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreatePetRequest(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    species: str = Field(min_length=1, max_length=30)
    breed: str | None = None
    age: int | None = None
    weight: float | None = None
    photo_url: str | None = None
    bio: str | None = None


class UpdatePetRequest(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=50)
    species: str | None = Field(None, min_length=1, max_length=30)
    breed: str | None = None
    age: int | None = None
    weight: float | None = None
    photo_url: str | None = None
    bio: str | None = None


class VetVisit(BaseModel):
    id: UUID
    pet_id: UUID
    vet_name: str
    visit_date: date
    reason: str
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreateVetVisitRequest(BaseModel):
    vet_name: str = Field(min_length=1, max_length=100)
    visit_date: date
    reason: str = Field(min_length=1)
    notes: str | None = None


class PetEvent(BaseModel):
    id: UUID
    pet_id: UUID
    event_type: str
    event_date: date
    value: str | None = None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreatePetEventRequest(BaseModel):
    event_type: str = Field(min_length=1)
    event_date: date
    value: str | None = None
    notes: str | None = None
