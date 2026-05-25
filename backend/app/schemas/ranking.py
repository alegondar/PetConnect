from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class RankingEntry(BaseModel):
    rank: int
    pet_id: UUID
    pet_name: str
    pet_photo_url: str | None = None
    owner_username: str
    likes_this_week: int
    updated_at: datetime

    class Config:
        from_attributes = True
