import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import JSZip from "jszip";
import { XMLParser } from "fast-xml-parser";
import { supabaseAdmin } from "../src/lib/supabase.js";

interface VetRecord {
  nombre: string;
  direccion: string;
  telefono: string;
  zona: string;
  lat: number;
  lng: number;
  descripcion: string;
}

const KMZ_PATH = resolve(import.meta.dirname, "../../docs/Veterinarias 24hs CABA y GBA.kmz");

function extractTelefono(description: string): { telefono: string; descripcion: string } {
  const clean = description.replace(/<!\[CDATA\[(.*?)\]\]>/g, "$1").trim();
  const phoneMatch = clean.match(
    /Tel[ée]fono[\s\u00A0]*(.*?)(?:$|\.|\))/i
  );
  if (phoneMatch && phoneMatch[1]) {
    const telefono = phoneMatch[1].trim();
    const desc = clean.replace(phoneMatch[0], "").trim();
    return { telefono, descripcion: desc };
  }
  return { telefono: "", descripcion: clean };
}

function detectZona(points: string, parentFolder: string): string {
  const normalizedParent = parentFolder.toLowerCase();
  if (normalizedParent.includes("gba")) return "GBA";
  return "CABA";
}

function parseCoords(coordText: string): { lat: number; lng: number } {
  const trimmed = coordText.trim();
  const parts = trimmed.split(",");
  const lng = parseFloat(parts[0].trim());
  const lat = parseFloat(parts[1].trim());
  return { lat, lng };
}

async function main() {
  const buffer = readFileSync(KMZ_PATH);
  const zip = await JSZip.loadAsync(buffer);
  const kmlFile = zip.file("doc.kml");

  if (!kmlFile) {
    console.error("ERROR: doc.kml not found inside KMZ");
    process.exit(1);
  }

  const kmlText = await kmlFile.async("string");

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    textNodeName: "valor",
    isArray: (name) =>
      ["Folder", "Placemark", "Style", "StyleMap", "Pair"].includes(name),
  });

  const parsed = parser.parse(kmlText);
  const kml = parsed.kml;
  const document = kml?.Document;

  if (!document) {
    console.error("ERROR: Invalid KML structure - no Document found");
    process.exit(1);
  }

  const folders = document.Folder;
  if (!folders || !Array.isArray(folders)) {
    console.error("ERROR: No folders found in KML");
    process.exit(1);
  }

  const records: VetRecord[] = [];

  for (const folder of folders) {
    const parentName: string = folder.name?.valor || folder.name || "";
    const placemarks = folder.Placemark;
    if (!placemarks || !Array.isArray(placemarks)) continue;

    for (const pm of placemarks) {
      try {
        const name: string = pm.name?.valor || pm.name || "";
        const descRaw: string =
          pm.description?.valor || pm.description || "";

        const { telefono, descripcion } = extractTelefono(descRaw);

        const coords =
          pm.Point?.coordinates?.valor ||
          pm.Point?.coordinates ||
          "";

        if (!coords || !name) {
          console.warn(`WARN: Skipping placemark - missing coords or name: "${name}"`);
          continue;
        }

        const { lat, lng } = parseCoords(
          typeof coords === "string" ? coords : String(coords)
        );

        const zona = detectZona(
          typeof coords === "string" ? coords : String(coords),
          parentName
        );

        records.push({
          nombre: name.trim(),
          direccion: name.trim(),
          telefono,
          zona,
          lat,
          lng,
          descripcion,
        });
      } catch (err) {
        console.warn(
          `WARN: Error processing placemark "${pm.name?.valor || pm.name || "?"}" - skipping`
        );
      }
    }
  }

  console.log(`Parsed ${records.length} veterinarias from KMZ`);

  if (records.length === 0) {
    console.error("ERROR: No records parsed from KMZ");
    process.exit(1);
  }

  const { error } = await supabaseAdmin
    .from("veterinarias_24hs")
    .insert(records);

  if (error) {
    console.error("ERROR inserting into Supabase:", error.message);
    process.exit(1);
  }

  console.log(`Successfully imported ${records.length} records`);

  const { data, error: countError } = await supabaseAdmin
    .from("veterinarias_24hs")
    .select("zona", { count: "exact", head: true });

  if (!countError) {
    const { data: zones } = await supabaseAdmin
      .from("veterinarias_24hs")
      .select("zona");

    if (zones) {
      const cabaCount = zones.filter((r) => r.zona === "CABA").length;
      const gbaCount = zones.filter((r) => r.zona === "GBA").length;
      console.log(`  CABA: ${cabaCount} | GBA: ${gbaCount}`);
    }
  }
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
