#!/usr/bin/env python3
"""
Importa lugares pet-friendly desde un archivo KMZ (Google My Maps) a Supabase.

Fuente: Mapa Dog Friendly Buenos Aires - Pet Friendly BA
Formato: KMZ con doc.kml interno, Placemarks agrupados por Folder.

Uso:
    cd backend
    python scripts/import_kmz.py
"""

import sys
import zipfile
import os
import xml.etree.ElementTree as ET
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

KMZ_PATH = Path("../docs/Mapa_Dog_Friendly_Buenos_Aires_-_Pet_Friendly_BA.kmz")

FOLDER_CATEGORY_MAP = {
    "Cafeterías": "cafeteria",
    "Bares y restaurantes": "bar_restaurante",
    "Hoteles": "hotel",
    "Experiencias": "experiencia",
}

KML_NS = {"kml": "http://www.opengis.net/kml/2.2"}


def extract_kml(kmz_path: Path) -> str:
    """Descomprime el KMZ y devuelve el contenido de doc.kml."""
    with zipfile.ZipFile(kmz_path, "r") as zf:
        if "doc.kml" not in zf.namelist():
            raise FileNotFoundError("doc.kml no encontrado dentro del KMZ")
        return zf.read("doc.kml").decode("utf-8")


def parse_placemarks(kml_xml: str) -> list[dict]:
    """Parsea el KML y extrae los Placemarks agrupados por Folder."""
    root = ET.fromstring(kml_xml)
    places = []

    for folder in root.findall(".//kml:Folder", KML_NS):
        folder_name = folder.findtext("kml:name", namespaces=KML_NS) or ""
        category = FOLDER_CATEGORY_MAP.get(folder_name)
        if not category:
            continue

        for pm in folder.findall(".//kml:Placemark", KML_NS):
            name = pm.findtext("kml:name", namespaces=KML_NS) or ""
            if not name:
                continue

            coords_text = ""
            coords_el = pm.find(".//kml:coordinates", KML_NS)
            if coords_el is not None and coords_el.text:
                coords_text = coords_el.text.strip()

            if not coords_text:
                continue

            parts = coords_text.split(",")
            if len(parts) < 2:
                continue

            try:
                lng = float(parts[0])
                lat = float(parts[1])
            except ValueError:
                continue

            places.append({
                "nombre": name,
                "categoria": category,
                "lat": lat,
                "lng": lng,
                "fuente": "openstreetmap",
                "verificado": False,
            })

    return places


def insert_places(supabase: Client, places: list[dict]) -> int:
    """Inserta los lugares en Supabase en lotes, saltando duplicados."""
    inserted = 0
    batch = []
    batch_size = 50

    for place in places:
        existing = (
            supabase.table("pet_friendly_places")
            .select("id")
            .eq("nombre", place["nombre"])
            .eq("lat", place["lat"])
            .eq("lng", place["lng"])
            .execute()
        )
        if existing.data:
            continue

        batch.append(place)
        if len(batch) >= batch_size:
            supabase.table("pet_friendly_places").insert(batch).execute()
            inserted += len(batch)
            batch = []
            print(f"  Insertados {inserted} lugares...")

    if batch:
        supabase.table("pet_friendly_places").insert(batch).execute()
        inserted += len(batch)

    return inserted


def main():
    if not SUPABASE_URL or not SUPABASE_SERVICE_KEY:
        print("ERROR: SUPABASE_URL y SUPABASE_SERVICE_KEY deben estar en backend/.env")
        sys.exit(1)

    if not KMZ_PATH.exists():
        print(f"ERROR: Archivo KMZ no encontrado en {KMZ_PATH}")
        print("Descargalo del Google My Maps de @PetFriendlyBA:")
        print("  https://www.google.com/maps/d/u/0/viewer?mid=1QH5V0dMu2pE3Ct0b6XqPWDfYJ9o")
        print("Exportar → Descargar KML (guardar como .kmz)")
        sys.exit(1)

    print(f"Leyendo {KMZ_PATH}...")
    kml_xml = extract_kml(KMZ_PATH)
    places = parse_placemarks(kml_xml)
    print(f"Parseados {len(places)} lugares de {len(set(p['categoria'] for p in places))} categorias")

    print("Conectando a Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    print("Insertando lugares (saltando duplicados)...")
    inserted = insert_places(supabase, places)
    print(f"Listo. {inserted} lugares nuevos insertados (total parseados: {len(places)})")


if __name__ == "__main__":
    main()
