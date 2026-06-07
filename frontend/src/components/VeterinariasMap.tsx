import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { veterinariasApi } from "../api/endpoints/veterinarias";

const BA_CENTER: [number, number] = [-34.6037, -58.3816];

const vetIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ZONA_FILTERS = [
  { value: "", label: "Todos" },
  { value: "CABA", label: "CABA" },
  { value: "GBA", label: "GBA" },
];

function MapView({ items }: { items: any[] }) {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100);
  }, [map]);

  return (
    <>
      {items.map((v: any) => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={vetIcon}
        >
          <Popup>
            <div className="text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              <p className="font-bold">{v.nombre}</p>
              {v.descripcion && (
                <p className="text-xs text-gray-500 mt-0.5">{v.descripcion}</p>
              )}
              {v.telefono && (
                <p className="text-xs mt-0.5">
                  📞 {v.telefono}
                </p>
              )}
              <p className="text-xs text-gray-400 mt-0.5">{v.zona}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

export default function VeterinariasMap() {
  const [zonaFilter, setZonaFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["veterinarias", zonaFilter],
    queryFn: async () => {
      const res = await veterinariasApi.getVeterinarias(
        zonaFilter || undefined
      );
      return res.data;
    },
  });

  const items: any[] = data ?? [];

  return (
    <div className="mt-4">
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {ZONA_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setZonaFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              zonaFilter === f.value
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-text-muted hover:bg-gray-200"
            }`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={{ height: 400 }}>
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-red-300 border-t-red-500 animate-spin" />
          </div>
        ) : (
          <MapContainer
            center={BA_CENTER}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapView items={items} />
          </MapContainer>
        )}
      </div>
    </div>
  );
}
