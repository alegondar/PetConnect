from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.schemas.auth import RegisterRequest, LoginRequest, UpdateProfileRequest
from app.schemas.profile import Profile
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register", status_code=201)
async def register(data: RegisterRequest):
    return await auth_service.register(data)


@router.post("/login")
async def login(data: LoginRequest):
    return await auth_service.login(data)


@router.get("/me", response_model=Profile)
async def get_me(user: dict = Depends(get_current_user)):
    return await auth_service.get_profile(user)


@router.put("/me", response_model=Profile)
async def update_me(data: UpdateProfileRequest, user: dict = Depends(get_current_user)):
    return await auth_service.update_profile(user["id"], data)
