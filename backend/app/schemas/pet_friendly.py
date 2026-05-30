from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from enum import Enum


class PetFriendlyCategory(str, Enum):
    cafeteria = "cafeteria"
    bar_restaurante = "bar_restaurante"
    hotel = "hotel"
    experiencia = "experiencia"


class PetFriendlyPlaceCreate(BaseModel):
    nombre: str
    categoria: PetFriendlyCategory
    lat: float
    lng: float
    descripcion: str | None = None
    foto_url: str | None = None


class PetFriendlyPlace(BaseModel):
    id: UUID
    nombre: str
    categoria: PetFriendlyCategory
    lat: float
    lng: float
    descripcion: str | None = None
    foto_url: str | None = None
    fuente: str
    verificado: bool
    created_by: UUID | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
