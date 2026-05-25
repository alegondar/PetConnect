from fastapi import APIRouter, Depends, Query
from uuid import UUID

from app.core.auth import get_current_user
from app.schemas.instapet import (
    InstaPetPost, InstaPetPostDetail, CreateInstaPetPostRequest,
    InstaPetMilestone, CreateMilestoneRequest,
)
from app.services import instapet_service
from app.services import pet_service

router = APIRouter(tags=["InstaPet"])

# InstaPet posts
instapet_posts_router = APIRouter(prefix="/{pet_id}/instapet/posts")


@instapet_posts_router.get("")
async def list_posts(
    pet_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await instapet_service.list_instapet_posts(pet_id, page, limit)


@instapet_posts_router.get("/{post_id}", response_model=InstaPetPostDetail)
async def get_post(post_id: UUID):
    return await instapet_service.get_instapet_post(post_id)


@instapet_posts_router.post("", response_model=InstaPetPost, status_code=201)
async def create_post(pet_id: UUID, data: CreateInstaPetPostRequest, user: dict = Depends(get_current_user)):
    await pet_service.verify_pet_owner(pet_id, user["id"])
    return await instapet_service.create_instapet_post(user["id"], pet_id, data)


@instapet_posts_router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: UUID, user: dict = Depends(get_current_user)):
    await instapet_service.delete_instapet_post(post_id, user["id"])


# Followers
followers_router = APIRouter(prefix="/{pet_id}")


@followers_router.get("/followers")
async def list_followers(
    pet_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await instapet_service.list_followers(pet_id, page, limit)


@followers_router.post("/follow", status_code=201)
async def follow_pet(pet_id: UUID, user: dict = Depends(get_current_user)):
    await instapet_service.follow_pet(user["id"], pet_id)
    return {"detail": "Ahora sigues a esta mascota"}


@followers_router.delete("/follow", status_code=204)
async def unfollow_pet(pet_id: UUID, user: dict = Depends(get_current_user)):
    await instapet_service.unfollow_pet(user["id"], pet_id)


# Following (current user's followed pets)
following_router = APIRouter()


@following_router.get("/me/following")
async def list_following(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    user: dict = Depends(get_current_user),
):
    return await instapet_service.list_following(user["id"], page, limit)


# Milestones
milestones_router = APIRouter(prefix="/{pet_id}/milestones")


@milestones_router.get("")
async def list_milestones(
    pet_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await instapet_service.list_milestones(pet_id, page, limit)


@milestones_router.post("", response_model=InstaPetMilestone, status_code=201)
async def create_milestone(pet_id: UUID, data: CreateMilestoneRequest, user: dict = Depends(get_current_user)):
    await pet_service.verify_pet_owner(pet_id, user["id"])
    return await instapet_service.create_milestone(pet_id, data)


router.include_router(instapet_posts_router)
router.include_router(followers_router)
router.include_router(following_router)
router.include_router(milestones_router)
