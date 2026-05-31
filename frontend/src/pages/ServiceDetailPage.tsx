import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { servicesApi } from "../api/endpoints";
import { useAuthStore } from "../stores/authStore";
import { useState } from "react";
import ContactServiceModal from "../components/services/ContactServiceModal";

const typeColors: Record<string, string> = {
  paseador: "bg-green-100 text-green-700",
  cuidador: "bg-blue-100 text-blue-700",
  veterinario: "bg-red-100 text-red-700",
  peluqueria: "bg-purple-100 text-purple-700",
};

export default function ServiceDetailPage() {
  const { requestId, offerId } = useParams<{ requestId?: string; offerId?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const currentProfile = useAuthStore((s) => s.profile);
  const [showContact, setShowContact] = useState(false);

  const isRequest = !!requestId;
  const id = requestId || offerId || "";

  const { data, isLoading } = useQuery({
    queryKey: ["service-detail", id, isRequest ? "request" : "offer"],
    queryFn: async () => {
      if (isRequest) {
        const res = await servicesApi.getRequest(id);
        return { ...res.data, _type: "request" as const };
      }
      const res = await servicesApi.getOffer(id);
      return { ...res.data, _type: "offer" as const };
    },
    enabled: !!id,
  });

  const isOwner = isRequest
    ? data?.requester_id === currentProfile?.id
    : data?.provider_id === currentProfile?.id;

  const deleteMut = useMutation({
    mutationFn: async () => {
      if (isRequest) {
        return servicesApi.deleteRequest(id);
      }
      return servicesApi.deleteOffer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-requests"] });
      queryClient.invalidateQueries({ queryKey: ["services-offers"] });
      navigate("/services");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-lg">Publicación no encontrada</p>
      </div>
    );
  }

  const type = data.service_type || "";
  const typeIcon =
    type === "paseador" ? "🐾" :
    type === "cuidador" ? "🏠" :
    type === "veterinario" ? "🩺" : "✂️";

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 text-sm font-medium"
      >
        ← Volver
      </button>

      <div className="card-pet p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center text-3xl">
            {data.photo_url ? (
              <img src={data.photo_url} className="w-full h-full object-cover" alt="" />
            ) : (
              typeIcon
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {data.title}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${typeColors[type] || ""}`}>
                {typeIcon} {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
              {isRequest && data.requester && (
                <span className="text-sm text-text-muted">
                  por @{data.requester.username}
                </span>
              )}
              {!isRequest && data.provider && (
                <span className="text-sm text-text-muted">
                  por @{data.provider.username}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="text-sm mb-4 whitespace-pre-wrap">{data.description}</p>

        {data.price_from != null && (
          <div className="mb-3">
            <span className="text-lg font-bold text-primary">
              ${data.price_from}
              {data.price_to ? ` - $${data.price_to}` : ""}
            </span>
            {data.price_unit && (
              <span className="text-sm text-text-muted ml-1">{data.price_unit}</span>
            )}
          </div>
        )}

        {data.available_days && data.available_days.length > 0 && (
          <div className="flex gap-1 mb-3 flex-wrap">
            {data.available_days.map((d: string) => (
              <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-text-muted">
                {d.charAt(0).toUpperCase() + d.slice(1, 3)}
              </span>
            ))}
          </div>
        )}

        {data.pet && (
          <div className="flex items-center gap-2 mb-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center">
              {data.pet.photo_url ? (
                <img src={data.pet.photo_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-xs">🐾</span>
              )}
            </div>
            <span>{data.pet.name} ({data.pet.species})</span>
          </div>
        )}

        {data.frequency_per_week && (
          <p className="text-sm text-text-muted mb-3">
            🐾 {data.frequency_per_week} paseos por semana
          </p>
        )}

        {(data.start_date || data.end_date) && (
          <p className="text-sm text-text-muted mb-3">
            📅 {data.start_date || "?"} → {data.end_date || "?"}
          </p>
        )}

        <p className="text-sm text-text-muted mb-4">📍 {data.location}</p>

        <p className="text-xs text-text-muted mb-4">
          Publicado el {new Date(data.created_at).toLocaleDateString()}
        </p>

        <div className="flex gap-3">
          {isOwner ? (
            <>
              <button
                onClick={() => {
                  if (confirm("¿Eliminar esta publicación?")) deleteMut.mutate();
                }}
                className="btn-secondary text-sm px-4 py-2 text-red-600"
              >
                Eliminar
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowContact(true)}
              className="btn-primary text-sm px-6 py-2.5"
            >
              Contactar
            </button>
          )}
        </div>
      </div>

      {showContact && data && (
        <ContactServiceModal
          mode={isRequest ? "request" : "offer"}
          id={id}
          title={data.title}
          subtitle={
            isRequest
              ? `@${data.requester?.username || "usuario"}`
              : `@${data.provider?.username || "usuario"}`
          }
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
}
