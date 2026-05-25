from fastapi import APIRouter, Depends, Query
from uuid import UUID

from app.core.auth import get_current_user
from app.schemas.social import Post, PostDetail, Comment, CreatePostRequest, UpdatePostRequest, CreateCommentRequest
from app.services import social_service

router = APIRouter(prefix="/feed", tags=["Feed"])


@router.get("")
async def list_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await social_service.list_posts(page, limit)


@router.get("/{post_id}", response_model=PostDetail)
async def get_post(post_id: UUID, user: dict = Depends(get_current_user)):
    return await social_service.get_post(post_id, user["id"])


@router.post("", response_model=Post, status_code=201)
async def create_post(data: CreatePostRequest, user: dict = Depends(get_current_user)):
    return await social_service.create_post(user["id"], data)


@router.delete("/{post_id}", status_code=204)
async def delete_post(post_id: UUID, user: dict = Depends(get_current_user)):
    await social_service.delete_post(post_id, user["id"])


@router.put("/{post_id}", response_model=Post)
async def update_post(post_id: UUID, data: UpdatePostRequest, user: dict = Depends(get_current_user)):
    return await social_service.update_post(post_id, user["id"], data)


@router.post("/{post_id}/like", status_code=201)
async def like_post(post_id: UUID, user: dict = Depends(get_current_user)):
    await social_service.like_post(post_id, user["id"])


@router.delete("/{post_id}/like", status_code=204)
async def unlike_post(post_id: UUID, user: dict = Depends(get_current_user)):
    await social_service.unlike_post(post_id, user["id"])


@router.get("/{post_id}/comments")
async def list_comments(
    post_id: UUID,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
):
    return await social_service.list_comments(post_id, page, limit)


@router.post("/{post_id}/comments", response_model=Comment, status_code=201)
async def create_comment(post_id: UUID, data: CreateCommentRequest, user: dict = Depends(get_current_user)):
    return await social_service.create_comment(post_id, user["id"], data)


@router.delete("/{post_id}/comments/{comment_id}", status_code=204)
async def delete_comment(comment_id: UUID, user: dict = Depends(get_current_user)):
    await social_service.delete_comment(comment_id, user["id"])
