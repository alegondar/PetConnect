"""
Seed script: Inserta paseadores desde paseadores_con_perfiles.json
en service_offers, creando auth users y profiles automáticamente.

Uso:
  cd backend
  python scripts/seed_paseadores.py
"""
import json
import sys
import os
from uuid import uuid4

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv

load_dotenv()

from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
    print("ERROR: SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar en .env")
    sys.exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Cargar datos
data_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "docs",
    "paseadores_con_perfiles.json",
)

with open(data_path) as f:
    data = json.load(f)

paseadores = data["paseadores"]
print(f"Cargados {len(paseadores)} paseadores del JSON")

# Tomar una muestra (primeros 50)
muestra = paseadores[:50]
# Filtrar solo los que tienen coordenadas válidas
validos = [
    p
    for p in muestra
    if p.get("lat")
    and p.get("lng")
    and p.get("nombre")
    and float(p["lat"]) != 0
    and float(p["lng"]) != 0
]
print(f"Válidos con coordenadas: {len(validos)}/{len(muestra)}")

insertados = 0
errores = 0

for i, p in enumerate(validos):
    try:
        paseador_id = p["id"]
        nombre = p["nombre"].strip()
        email = f"paseador_{paseador_id}@seed.petconnect.local"
        password = f"Seed{paseador_id}!"
        lat = float(p["lat"])
        lng = float(p["lng"])
        precio = p.get("precio", "0").replace(".", "")
        try:
            price_from = int(precio)
        except ValueError:
            price_from = 0

        zonas = p.get("zonas", [])
        location = zonas[0] if zonas else "Capital Federal, Argentina"
        description = p.get("descripcion", f"Paseador de perros - {nombre}")
        if len(description) < 20:
            description = f"{description}. Servicio profesional de paseo de perros en la zona."

        # 1. Crear auth user (el trigger handle_new_user crea el profile automático)
        # Verificar si ya existe
        existing = supabase.table("profiles").select("id").eq(
            "username", f"paseador_{paseador_id}"
        ).execute()

        if existing.data and len(existing.data) > 0:
            profile_id = existing.data[0]["id"]
            print(
                f"  [{i+1}/{len(validos)}] ⏭ {nombre} ya existe (profile {profile_id[:8]}...)"
            )
        else:
            try:
                auth_resp = supabase.auth.admin.create_user({
                    "email": email,
                    "password": password,
                    "email_confirm": True,
                    "user_metadata": {"username": f"paseador_{paseador_id}"},
                })
            except Exception as e:
                if "already been registered" in str(e) or "already exists" in str(e):
                    # Ya existe el auth user, buscar su profile
                    pass
                else:
                    raise e

            # 2. Buscar el profile creado por el trigger
            profile_resp = (
                supabase.table("profiles")
                .select("id")
                .eq("username", f"paseador_{paseador_id}")
                .single()
                .execute()
            )

            if not profile_resp.data:
                print(
                    f"  [{i+1}/{len(validos)}] ❌ {nombre}: no se encontró profile"
                )
                errores += 1
                continue

            profile_id = profile_resp.data["id"]
            print(
                f"  [{i+1}/{len(validos)}] ✓ {nombre} creado (profile {profile_id[:8]}...)"
            )

        # 3. Verificar si ya tiene service_offer
        existing_offer = (
            supabase.table("service_offers")
            .select("id")
            .eq("provider_id", profile_id)
            .eq("title", f"Paseador - {nombre}")
            .execute()
        )

        if existing_offer.data and len(existing_offer.data) > 0:
            print(f"    ⏭ ya tiene oferta, saltando")
            continue

        # 4. Insertar service_offer
        supabase.table("service_offers").insert({
            "provider_id": profile_id,
            "service_type": "paseador",
            "title": f"Paseador - {nombre}",
            "description": description,
            "price_from": price_from,
            "price_unit": "por visita",
            "location": location,
            "lat": lat,
            "lng": lng,
            "status": "activo",
        }).execute()

        print(f"    ✓ service_offer creado (${price_from} - {location})")
        insertados += 1

    except Exception as e:
        print(f"  [{i+1}/{len(validos)}] ❌ {p.get('nombre', '?')}: {e}")
        errores += 1

print(f"\n{'='*50}")
print(f"Resultado: {insertados} insertados, {errores} errores")
print(f"Total en muestra: {len(validos)}")
