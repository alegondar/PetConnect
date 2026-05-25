from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from app.schemas.profile import Profile
from app.schemas.pet import Pet


class Post(BaseModel):
    id: UUID
    author_id: UUID
    pet_id: UUID
    content: str | None = None
    photo_url: str | None = None
    likes_count: int = 0
    comments_count: int = 0
    created_at: datetime
    updated_at: datetime
    author: Profile | None = None
    pet: Pet | None = None

    class Config:
        from_attributes = True


class PostDetail(Post):
    liked_by_me: bool = False


class CreatePostRequest(BaseModel):
    pet_id: UUID
    content: str | None = None
    photo_url: str | None = None


class UpdatePostRequest(BaseModel):
    content: str | None = None
    photo_url: str | None = None


class Like(BaseModel):
    id: UUID
    user_id: UUID
    post_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True


class Comment(BaseModel):
    id: UUID
    user_id: UUID
    post_id: UUID
    content: str
    created_at: datetime
    updated_at: datetime
    author: Profile | None = None

    class Config:
        from_attributes = True


class CreateCommentRequest(BaseModel):
    content: str = Field(min_length=1, max_length=500)
