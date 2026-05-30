import "dotenv/config";
import { supabaseAdmin } from "./lib/supabase.js";

const { error } = await supabaseAdmin
  .from("pet_friendly_places")
  .insert({
    nombre: "_test_migration",
    categoria: "cafeteria",
    lat: -34.6037,
    lng: -58.3816,
    direccion: "Test Address 123",
    fuente: "usuario",
  })
  .select("*")
  .single();

if (error) {
  if (error.message.includes("direccion")) {
    console.log("La columna 'direccion' NO existe en la DB.");
    console.log("Ejecutá este SQL en Supabase Dashboard → SQL Editor:");
    console.log("  ALTER TABLE pet_friendly_places ADD COLUMN IF NOT EXISTS direccion TEXT;");
  } else {
    console.log("Error:", error.message);
  }
} else {
  console.log("La columna 'direccion' YA existe. Limpiando fila de test...");
  await supabaseAdmin.from("pet_friendly_places").delete().eq("nombre", "_test_migration");
  console.log("OK - listo para usar.");
}
