import math


class PaginatedResponse:
    def __init__(self, items: list, total: int, page: int, limit: int):
        self.items = items
        self.total = total
        self.page = page
        self.pages = max(1, math.ceil(total / limit)) if total > 0 else 0


def paginate(items: list, total: int, page: int, limit: int) -> dict:
    return {
        "items": items,
        "total": total,
        "page": page,
        "pages": max(1, math.ceil(total / limit)) if total > 0 else 0,
    }
