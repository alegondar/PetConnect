from pydantic import BaseModel
from datetime import datetime
from uuid import UUID


class Profile(BaseModel):
    id: UUID
    user_id: UUID
    username: str
    avatar_url: str | None = None
    bio: str | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
