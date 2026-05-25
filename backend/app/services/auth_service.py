from fastapi import HTTPException, status

from app.core.supabase import get_supabase
from app.schemas.auth import RegisterRequest, LoginRequest, UpdateProfileRequest
from app.schemas.profile import Profile


async def register(data: RegisterRequest) -> dict:
    supabase = get_supabase()
    auth_response = supabase.auth.sign_up({
        "email": data.email,
        "password": data.password,
    })

    if not auth_response.user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El email ya está registrado",
        )

    user_id = auth_response.user.id
    supabase.table("profiles").update({"username": data.username}).eq("user_id", user_id).execute()

    result = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
    profile = Profile.model_validate(result.data)

    token = auth_response.session.access_token if auth_response.session else ""
    return {
        "access_token": token,
        "token_type": "bearer",
        "profile": profile.model_dump(mode="json"),
    }


async def login(data: LoginRequest) -> dict:
    supabase = get_supabase()
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password,
        })
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    if not auth_response.user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales inválidas",
        )

    result = supabase.table("profiles").select("*").eq("user_id", auth_response.user.id).single().execute()
    profile = Profile.model_validate(result.data)

    token = auth_response.session.access_token if auth_response.session else ""
    return {
        "access_token": token,
        "token_type": "bearer",
        "profile": profile.model_dump(mode="json"),
    }


async def get_profile(user: dict) -> Profile:
    return Profile.model_validate(user)


async def update_profile(user_id: str, data: UpdateProfileRequest) -> Profile:
    supabase = get_supabase()
    update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
    if not update_data:
        result = supabase.table("profiles").select("*").eq("user_id", user_id).single().execute()
        return Profile.model_validate(result.data)

    result = supabase.table("profiles").update(update_data).eq("user_id", user_id).execute()
    return Profile.model_validate(result.data[0])
