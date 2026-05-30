from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import FRONTEND_ORIGIN
from app.routers import auth, pets, social, ranking, community, instapet, pet_friendly

app = FastAPI(title="PetConnect API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(pets.router, prefix="/api/v1")
app.include_router(social.router, prefix="/api/v1")
app.include_router(ranking.router, prefix="/api/v1")
app.include_router(community.router, prefix="/api/v1")
app.include_router(instapet.router, prefix="/api/v1/pets")
app.include_router(pet_friendly.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {"message": "PetConnect API is running"}
