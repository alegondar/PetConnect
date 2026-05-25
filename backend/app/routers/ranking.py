from fastapi import APIRouter, Query

from app.services import ranking_service

router = APIRouter(prefix="/ranking", tags=["Ranking"])


@router.get("")
async def get_ranking(limit: int = Query(20, ge=1, le=100)):
    items = await ranking_service.get_ranking(limit)
    return {"items": items, "updated_at": items[0]["updated_at"] if items else None}
