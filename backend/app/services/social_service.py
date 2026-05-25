from fastapi import HTTPException, status
from uuid import UUID

from app.core.supabase import get_supabase
from app.core.pagination import paginate
from app.schemas.social import Post, PostDetail, Like, Comment, CreatePostRequest, UpdatePostRequest, CreateCommentRequest


async def list_posts(page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("posts").select("*, author:profiles(*), pet:pets(*)", count="exact").order("created_at", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [Post.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def get_post(post_id: UUID, user_id: str) -> PostDetail:
    supabase = get_supabase()
    result = supabase.table("posts").select("*, author:profiles(*), pet:pets(*)").eq("id", str(post_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")

    post = Post.model_validate(result.data)
    like_result = supabase.table("likes").select("id").eq("post_id", str(post_id)).eq("user_id", user_id).execute()
    liked_by_me = len(like_result.data) > 0
    return PostDetail(**post.model_dump(), liked_by_me=liked_by_me)


async def create_post(author_id: str, data: CreatePostRequest) -> Post:
    supabase = get_supabase()
    insert_data = {"author_id": author_id, **data.model_dump()}
    insert_data["pet_id"] = str(insert_data["pet_id"])
    result = supabase.table("posts").insert(insert_data).execute()
    post_id = result.data[0]["id"]
    result = supabase.table("posts").select("*, author:profiles(*), pet:pets(*)").eq("id", post_id).single().execute()
    return Post.model_validate(result.data)


async def delete_post(post_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    result = supabase.table("posts").select("author_id").eq("id", str(post_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    if result.data["author_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este post")
    supabase.table("posts").delete().eq("id", str(post_id)).execute()


async def update_post(post_id: UUID, user_id: str, data: UpdatePostRequest) -> Post:
    supabase = get_supabase()
    result = supabase.table("posts").select("author_id").eq("id", str(post_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    if result.data["author_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este post")
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay campos para actualizar")
    supabase.table("posts").update(update_data).eq("id", str(post_id)).execute()
    result = supabase.table("posts").select("*, author:profiles(*), pet:pets(*)").eq("id", str(post_id)).single().execute()
    return Post.model_validate(result.data)


async def like_post(post_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    existing = supabase.table("likes").select("id").eq("post_id", str(post_id)).eq("user_id", user_id).execute()
    if existing.data:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya le diste like a este post")
    supabase.table("likes").insert({"user_id": user_id, "post_id": str(post_id)}).execute()


async def unlike_post(post_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    supabase.table("likes").delete().eq("post_id", str(post_id)).eq("user_id", user_id).execute()


async def list_comments(post_id: UUID, page: int, limit: int) -> dict:
    supabase = get_supabase()
    query = supabase.table("comments").select("*, author:profiles(*)", count="exact").eq("post_id", str(post_id)).order("created_at", desc=True)
    start = (page - 1) * limit
    result = query.range(start, start + limit - 1).execute()
    total = result.count or 0
    items = [Comment.model_validate(r).model_dump(mode="json") for r in result.data]
    return paginate(items, total, page, limit)


async def create_comment(post_id: UUID, user_id: str, data: CreateCommentRequest) -> Comment:
    supabase = get_supabase()
    result = supabase.table("comments").insert({"user_id": user_id, "post_id": str(post_id), "content": data.content}).execute()
    comment_id = result.data[0]["id"]
    result = supabase.table("comments").select("*, author:profiles(*)").eq("id", comment_id).single().execute()
    return Comment.model_validate(result.data)


async def delete_comment(comment_id: UUID, user_id: str) -> None:
    supabase = get_supabase()
    result = supabase.table("comments").select("user_id").eq("id", str(comment_id)).single().execute()
    if not result.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comentario no encontrado")
    if result.data["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No eres el autor de este comentario")
    supabase.table("comments").delete().eq("id", str(comment_id)).execute()
