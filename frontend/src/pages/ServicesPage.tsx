import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { servicesApi } from "../api/endpoints";
import { useAuthStore } from "../stores/authStore";
import CreateRequestModal from "../components/services/CreateRequestModal";
import CreateOfferModal from "../components/services/CreateOfferModal";
import ContactServiceModal from "../components/services/ContactServiceModal";
import VeterinariasMap from "../components/VeterinariasMap";

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const filterTypes = [
  { value: "", label: "Todos" },
  { value: "paseador", label: "🐾 Paseador" },
  { value: "cuidador", label: "🏠 Cuidador" },
  { value: "veterinario", label: "🩺 Veterinario" },
  { value: "peluqueria", label: "✂️ Peluquería" },
];

const typeColors: Record<string, string> = {
  paseador: "bg-green-100 text-green-700",
  cuidador: "bg-blue-100 text-blue-700",
  veterinario: "bg-red-100 text-red-700",
  peluqueria: "bg-purple-100 text-purple-700",
};

export default function ServicesPage() {
  const queryClient = useQueryClient();
  const currentProfile = useAuthStore((s) => s.profile);
  const [tab, setTab] = useState<"requests" | "offers">("requests");
  const [typeFilter, setTypeFilter] = useState("");
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [contactTarget, setContactTarget] = useState<{
    mode: "request" | "offer";
    id: string;
    title: string;
    subtitle?: string;
  } | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  const deleteRequestMut = useMutation({
    mutationFn: (id: string) => servicesApi.deleteRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-requests"] });
      setMenuOpen(null);
    },
  });

  const deleteOfferMut = useMutation({
    mutationFn: (id: string) => servicesApi.deleteOffer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-offers"] });
      setMenuOpen(null);
    },
  });

  const handleSearch = () => {
    setSearchedLocation(searchLocation.trim());
  };

  const reqParams: Record<string, string | number> = { page: 1, limit: 20 };
  if (typeFilter) reqParams.type = typeFilter;

  const offerParams: Record<string, string | number> = { page: 1, limit: 50 };
  if (typeFilter) offerParams.type = typeFilter;
  if (searchedLocation) offerParams.location = searchedLocation;

  const { data: requestsData, isLoading: loadingRequests, fetchNextPage: fetchMoreRequests, hasNextPage: hasMoreRequests, isFetchingNextPage: fetchingMoreRequests } = useQuery({
    queryKey: ["services-requests", typeFilter],
    queryFn: async () => {
      const res = await servicesApi.listRequests(reqParams);
      return res.data;
    },
    enabled: tab === "requests",
  });

  const { data: offersData, isLoading: loadingOffers, fetchNextPage: fetchMoreOffers, hasNextPage: hasMoreOffers, isFetchingNextPage: fetchingMoreOffers } = useQuery({
    queryKey: ["services-offers", typeFilter, searchedLocation],
    queryFn: async () => {
      const res = await servicesApi.listOffers(offerParams);
      return res.data;
    },
    enabled: tab === "offers" || (tab === "requests" && !!searchedLocation),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            🐕 Manada Libre
          </h2>
          <p className="text-sm text-text-muted mt-0.5">
            Conectá con paseadores, cuidadores y más
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTab("requests")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "requests"
              ? "bg-white text-primary shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          🔍 Busco servicio
        </button>
        <button
          onClick={() => setTab("offers")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "offers"
              ? "bg-white text-primary shadow-sm"
              : "text-text-muted hover:text-text"
          }`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          💼 Ofrezco servicio
        </button>
      </div>

      {/* Filter chips */}
      <div className="flex gap-1.5 flex-wrap pb-3 mb-1">
        {filterTypes.map((f) => (
          <button
            key={f.value}
            onClick={() => setTypeFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                typeFilter === f.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
            ))}
      </div>

      {/* Search bar — solo en tab "Busco servicio" */}
      {tab === "requests" && (
        <div className="mb-4 flex gap-2">
          <input
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar por barrio o ciudad..."
            className="input-pet flex-1"
          />
          <button
            onClick={handleSearch}
            disabled={!searchLocation.trim()}
            className="btn-primary text-sm px-4 py-2.5 disabled:opacity-40"
          >
            🔍 Buscar
          </button>
          {searchedLocation && (
            <button
              onClick={() => { setSearchLocation(""); setSearchedLocation(""); }}
              className="btn-secondary text-sm px-3 py-2.5"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* Action button */}
      <div className="mb-4">
        {tab === "requests" ? (
          <button
            onClick={() => setShowCreateRequest(true)}
            className="btn-primary text-sm px-4 py-2.5 w-full"
          >
            + Publicar búsqueda
          </button>
        ) : (
          <button
            onClick={() => setShowCreateOffer(true)}
            className="btn-primary text-sm px-4 py-2.5 w-full"
          >
            + Ofrecer servicio
          </button>
        )}
      </div>

      {/* Requests tab */}
      {tab === "requests" && !searchedLocation && (
        <div className="space-y-3">
          {loadingRequests && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          )}
          {!loadingRequests && (!requestsData?.items || requestsData.items.length === 0) && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg font-semibold">No hay solicitudes aún</p>
              <p className="text-text-muted text-sm mt-1">Sé el primero en publicar</p>
            </div>
          )}
          {requestsData?.items?.map((req: any) => (
            <div key={req.id} className="card-pet p-4 relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {req.requester?.avatar_url ? (
                    <img src={req.requester.avatar_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="text-primary/60 text-sm font-bold">👤</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    @{req.requester?.username || "usuario"}
                  </p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${typeColors[req.service_type] || "bg-gray-100 text-gray-600"}`}>
                    {req.service_type === "paseador" ? "🐾 Paseador" :
                     req.service_type === "cuidador" ? "🏠 Cuidador" :
                     req.service_type === "veterinario" ? "🩺 Veterinario" : "✂️ Peluquería"}
                  </span>
                </div>
                {req.requester_id === currentProfile?.id && (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === req.id ? null : req.id)}
                      className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-muted text-lg leading-none"
                    >
                      ⋮
                    </button>
                    {menuOpen === req.id && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={() => { if (confirm("¿Eliminar esta solicitud?")) deleteRequestMut.mutate(req.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="font-bold text-sm mb-1">{req.title}</p>
              <p className="text-sm text-text-muted line-clamp-2 mb-2">{req.description}</p>
              {req.pet && (
                <div className="flex items-center gap-2 mb-2 text-xs text-text-muted">
                  <span>🐾 {req.pet.name}</span>
                </div>
              )}
              {req.frequency_per_week && (
                <p className="text-xs text-text-muted mb-1">Paseos: {req.frequency_per_week} x semana</p>
              )}
              <p className="text-xs text-text-muted mb-3">📍 {req.location}</p>
              <button
                onClick={() =>
                  setContactTarget({
                    mode: "request",
                    id: req.id,
                    title: req.title,
                    subtitle: `@${req.requester?.username || "usuario"}`,
                  })
                }
                className="btn-primary text-xs px-4 py-2"
              >
                Contactar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Search results — cuando se busca una ubicación */}
      {tab === "requests" && searchedLocation && (
        <div className="space-y-3">
          <p className="text-sm text-text-muted mb-1">
            Resultados para "<strong>{searchedLocation}</strong>" ({offersData?.total || 0} paseadores)
          </p>
          {loadingOffers && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          )}
          {!loadingOffers && (!offersData?.items || offersData.items.length === 0) && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg font-semibold">No se encontraron paseadores</p>
              <p className="text-text-muted text-sm mt-1">Probá con otra ubicación</p>
            </div>
          )}
          {/* Mapa de resultados */}
          {offersData?.items && offersData.items.length > 0 && (
            <div className="rounded-xl overflow-hidden" style={{ height: 350 }}>
              <MapContainer
                center={[-34.6037, -58.3816]}
                zoom={12}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {offersData.items.map((o: any) =>
                  o.lat && o.lng ? (
                    <Marker key={o.id} position={[o.lat, o.lng]} icon={defaultIcon}>
                      <Popup>
                        <div className="text-sm">
                          <p className="font-bold">{o.title}</p>
                          {o.price_from && <p className="text-primary">${o.price_from} {o.price_unit || ""}</p>}
                          <p className="text-xs text-gray-500">{o.location}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ) : null
                )}
              </MapContainer>
            </div>
          )}
          {offersData?.items?.map((offer: any) => (
            <div key={offer.id} className="card-pet p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {offer.photo_url ? (
                    <img src={offer.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="text-2xl">🐾</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-0.5">{offer.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-text-muted">
                      @{offer.provider?.username || "usuario"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text-muted line-clamp-2 mb-2">{offer.description}</p>
              {offer.price_from && (
                <p className="text-sm font-bold text-primary mb-1">
                  ${offer.price_from}{offer.price_unit ? ` ${offer.price_unit}` : ""}
                </p>
              )}
              <p className="text-xs text-text-muted mb-3">📍 {offer.location}</p>
              <button
                onClick={() =>
                  setContactTarget({
                    mode: "offer",
                    id: offer.id,
                    title: offer.title,
                    subtitle: `@${offer.provider?.username || "usuario"}`,
                  })
                }
                className="btn-primary text-xs px-4 py-2"
              >
                Contactar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Offers tab */}
      {tab === "offers" && (
        <div className="space-y-3">
          {loadingOffers && (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            </div>
          )}
          {!loadingOffers && (!offersData?.items || offersData.items.length === 0) && (
            <div className="text-center py-16">
              <p className="text-text-muted text-lg font-semibold">No hay ofertas aún</p>
              <p className="text-text-muted text-sm mt-1">Sé el primero en ofrecer</p>
            </div>
          )}
          {offersData?.items?.map((offer: any) => (
            <div key={offer.id} className="card-pet p-4 relative">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {offer.photo_url ? (
                    <img src={offer.photo_url} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <span className="text-2xl">
                      {offer.service_type === "paseador" ? "🐾" :
                       offer.service_type === "cuidador" ? "🏠" :
                       offer.service_type === "veterinario" ? "🩺" : "✂️"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm mb-0.5">{offer.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${typeColors[offer.service_type] || "bg-gray-100 text-gray-600"}`}>
                      {offer.service_type === "paseador" ? "🐾 Paseador" :
                       offer.service_type === "cuidador" ? "🏠 Cuidador" :
                       offer.service_type === "veterinario" ? "🩺 Veterinario" : "✂️ Peluquería"}
                    </span>
                    <span className="text-xs text-text-muted">
                      @{offer.provider?.username || "usuario"}
                    </span>
                  </div>
                </div>
                {offer.provider_id === currentProfile?.id && (
                  <div className="relative">
                    <button
                      onClick={() => setMenuOpen(menuOpen === offer.id ? null : offer.id)}
                      className="w-7 h-7 rounded-full hover:bg-gray-100 flex items-center justify-center text-text-muted text-lg leading-none"
                    >
                      ⋮
                    </button>
                    {menuOpen === offer.id && (
                      <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[120px]">
                        <button
                          onClick={() => { if (confirm("¿Eliminar esta oferta?")) deleteOfferMut.mutate(offer.id); }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-text-muted line-clamp-2 mb-2">{offer.description}</p>
              {offer.price_from && (
                <p className="text-sm font-bold text-primary mb-1">
                  ${offer.price_from}{offer.price_to ? ` - $${offer.price_to}` : ""}{offer.price_unit ? ` ${offer.price_unit}` : ""}
                </p>
              )}
              {offer.available_days && offer.available_days.length > 0 && (
                <div className="flex gap-1 mb-2 flex-wrap">
                  {offer.available_days.map((d: string) => (
                    <span key={d} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">
                      {d.slice(0, 3)}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-text-muted mb-3">📍 {offer.location}</p>
              <button
                onClick={() =>
                  setContactTarget({
                    mode: "offer",
                    id: offer.id,
                    title: offer.title,
                    subtitle: `@${offer.provider?.username || "usuario"}`,
                  })
                }
                className="btn-primary text-xs px-4 py-2"
              >
                Contactar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Map — visible cuando hay resultados */}
      {offersData?.items && offersData.items.length > 0 && !searchedLocation && tab === "offers" && (
        <div className="rounded-xl overflow-hidden mt-4" style={{ height: 300 }}>
          <MapContainer
            center={[-34.6037, -58.3816]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {offersData.items.map((o: any) =>
              o.lat && o.lng ? (
                <Marker
                  key={o.id}
                  position={[o.lat, o.lng]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <p className="font-bold">{o.title}</p>
                      {o.price_from && <p className="text-primary">${o.price_from} {o.price_unit || ""}</p>}
                      <p className="text-xs text-gray-500">{o.location}</p>
                    </div>
                  </Popup>
                </Marker>
              ) : null
            )}
          </MapContainer>
        </div>
      )}

      {/* Veterinarias 24hs map */}
      {typeFilter === "veterinario" && (
        <VeterinariasMap />
      )}

      {/* Modals */}
      {showCreateRequest && (
        <CreateRequestModal onClose={() => setShowCreateRequest(false)} />
      )}
      {showCreateOffer && (
        <CreateOfferModal onClose={() => setShowCreateOffer(false)} />
      )}
      {contactTarget && (
        <ContactServiceModal
          mode={contactTarget.mode}
          id={contactTarget.id}
          title={contactTarget.title}
          subtitle={contactTarget.subtitle}
          onClose={() => setContactTarget(null)}
        />
      )}
    </div>
  );
}
