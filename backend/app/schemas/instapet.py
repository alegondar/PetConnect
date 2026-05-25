from pydantic import BaseModel, Field
from datetime import datetime, date
from uuid import UUID
from app.schemas.profile import Profile
from app.schemas.pet import Pet


class InstaPetPost(BaseModel):
    id: UUID
    pet_id: UUID
    author_id: UUID
    photo_url: str | None = None
    video_url: str | None = None
    description: str | None = None
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime
    updated_at: datetime
    author: Profile | None = None

    class Config:
        from_attributes = True


class InstaPetPostDetail(InstaPetPost):
    pet: Pet | None = None


class CreateInstaPetPostRequest(BaseModel):
    photo_url: str | None = None
    video_url: str | None = None
    description: str | None = None


class InstaPetFollower(BaseModel):
    id: UUID
    follower_id: UUID
    pet_id: UUID
    created_at: datetime
    follower: Profile | None = None

    class Config:
        from_attributes = True


class FollowingPet(BaseModel):
    pet_id: UUID
    pet_name: str
    pet_photo_url: str | None = None
    species: str
    followed_at: datetime


class InstaPetMilestone(BaseModel):
    id: UUID
    pet_id: UUID
    title: str
    description: str | None = None
    photo_url: str | None = None
    milestone_date: date
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CreateMilestoneRequest(BaseModel):
    title: str = Field(min_length=1, max_length=100)
    description: str | None = None
    photo_url: str | None = None
    milestone_date: date
