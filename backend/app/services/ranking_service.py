from app.core.supabase import get_supabase
from app.schemas.ranking import RankingEntry


async def get_ranking(limit: int) -> list[dict]:
    supabase = get_supabase()
    result = supabase.table("weekly_ranking").select("*").order("rank").limit(limit).execute()
    return [RankingEntry.model_validate(r).model_dump(mode="json") for r in result.data]
