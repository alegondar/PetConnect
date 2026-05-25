from fastapi import HTTPException, status
from uuid import UUID

from app.core.supabase import get_supabase
from app.core.pagination import paginate
from app.schemas.instapet import (
    InstaPetPost, InstaPetPostDetail, CreateInstaPetPostRequest,
    InstaPetFollower, FollowingPet,
    InstaPetMilestone, CreateMilestoneRequest,
)


async def list_instapet_posts(pet_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("instapet_posts").select("*, author:profiles(*)", count="exact").eq("pet_id", str(pet_id)).order("created_at", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [InstaPetPost.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def get_instapet_post(post_id: UUID) -> InstaPetPostDetail:
    supabase = get_supabase()
    result = supabase.table("instapet_posts").select("*, author:profiles(*), pet:pets(*)").eq("id", str(post_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    return InstaPetPostDetail.model_validate(result.data)


async def create_instapet_post(author_id: str, pet_id: UUID, data: CreateInstaPetPostRequest) -> InstaPetPost:
    supabase = get_supabase()
    result = supabase.table("instapet_posts").insert({**data.model_dump(), "author_id": author_id, "pet_id": str(pet_id)}).execute()
    post_id = result.data[0]["id"]
    result = supabase.table("instapet_posts").select("*, author:profiles(*)").eq("id", post_id).single().execute()
    return InstaPetPost.model_validate(result.data)


async def delete_instapet_post(post_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    result = supabase.table("instapet_posts").select("author_id").eq("id", str(post_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    if result.data["author_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este post")
    supabase.table("instapet_posts").delete().eq("id", str(post_id)).execute()


async def follow_pet(follower_id: str, pet_id: UUID) -> None:
    supabase = get_supabase()
    existing = supabase.table("instapet_followers").select("id").eq("follower_id", follower_id).eq("pet_id", str(pet_id)).execute()
    if existing.data:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya sigues a esta mascota")
    supabase.table("instapet_followers").insert({"follower_id": follower_id, "pet_id": str(pet_id)}).execute()


async def unfollow_pet(follower_id: str, pet_id: UUID) -> None:
    supabase = get_supabase()
    supabase.table("instapet_followers").delete().eq("follower_id", follower_id).eq("pet_id", str(pet_id)).execute()


async def list_followers(pet_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("instapet_followers").select("*, follower:profiles(*)", count="exact").eq("pet_id", str(pet_id)).order("created_at", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [InstaPetFollower.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def list_following(user_id: str, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("instapet_followers").select("pet_id, created_at, pet:pets(name, photo_url, species)", count="exact").eq("follower_id", user_id).order("created_at", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = []
    for r in result.data:
        pet = r.get("pet", {})
        items.append({
            "pet_id": r["pet_id"],
            "pet_name": pet.get("name", ""),
            "pet_photo_url": pet.get("photo_url"),
            "species": pet.get("species", ""),
            "followed_at": r["created_at"],
        })
    return paginate(items, total, page, limit)


async def list_milestones(pet_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("instapet_milestones").select("*", count="exact").eq("pet_id", str(pet_id)).order("milestone_date", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [InstaPetMilestone.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def create_milestone(pet_id: UUID, data: CreateMilestoneRequest) -> InstaPetMilestone:
    supabase = get_supabase()
    result = supabase.table("instapet_milestones").insert({**data.model_dump(), "pet_id": str(pet_id)}).execute()
    return InstaPetMilestone.model_validate(result.data[0])
