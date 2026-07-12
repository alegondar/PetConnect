import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { servicesApi, petsApi } from "../../api/endpoints";
import { useAuthStore } from "../../stores/authStore";
import MapLocationPicker from "../MapLocationPicker";
import LoginPromptModal from "../LoginPromptModal";

const serviceTypes = [
  { value: "paseador", label: "Paseador", icon: "🐾" },
  { value: "cuidador", label: "Cuidador", icon: "🏠" },
  { value: "veterinario", label: "Veterinario", icon: "🩺" },
  { value: "peluqueria", label: "Peluquería", icon: "✂️" },
];

interface Props {
  onClose: () => void;
}

export default function CreateRequestModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [petId, setPetId] = useState("");
  const [frequency, setFrequency] = useState(7);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location_, setLocation_] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: petsData } = useQuery({
    queryKey: ["my-pets"],
    queryFn: async () => {
      const res = await petsApi.myPets({ page: 1, limit: 100 });
      return res.data;
    },
  });

  const createMut = useMutation({
    mutationFn: async () => {
      const data: Record<string, unknown> = {
        service_type: type,
        title,
        description,
        location: location_,
      };
      if (petId) data.pet_id = petId;
      if (type === "paseador") data.frequency_per_week = frequency;
      if (type === "cuidador" && startDate) {
        data.start_date = startDate;
        if (endDate) data.end_date = endDate;
      }
      if (lat !== undefined) data.lat = lat;
      if (lng !== undefined) data.lng = lng;
      return servicesApi.createRequest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-requests"] });
      onClose();
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Error al publicar");
    },
  });

  const markTouch = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

  const titleValid = title.length >= 5;
  const descValid = description.length >= 20;
  const locValid = location_.length >= 3;
  const isStep1Valid = !!type;
  const isStep2Valid = titleValid && descValid && locValid;

  const inputClass = (field: string, valid: boolean) =>
    `input-pet w-full ${touched[field] && !valid ? "border-red-400 focus:border-red-400" : ""}`;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          {step === 1 ? "¿Qué necesitás?" : step === 2 ? "Contanos más" : "Revisá y publicá"}
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
        )}

        {/* Step 1: Tipo de servicio */}
        {step === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {serviceTypes.map((st) => (
              <button
                key={st.value}
                onClick={() => { setType(st.value); markTouch("type"); }}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  type === st.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-3xl block mb-1">{st.icon}</span>
                <span className="text-sm font-semibold">{st.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Detalles */}
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => markTouch("title")}
                placeholder="Título (ej: Busco paseador para mi perro)"
                className={inputClass("title", titleValid)}
                maxLength={100}
              />
              <p className={`text-xs mt-1 text-right ${title.length < 5 ? "text-text-muted" : "text-green-600"}`}>
                {title.length}/5 mínimo
              </p>
            </div>

            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={() => markTouch("description")}
                placeholder="Describí lo que necesitás (mín. 20 caracteres)"
                className={`${inputClass("description", descValid)} resize-none h-28`}
                maxLength={1000}
              />
              <p className={`text-xs mt-1 text-right ${description.length < 20 ? "text-text-muted" : "text-green-600"}`}>
                {description.length}/20 mínimo · {description.length}/1000
              </p>
            </div>

            <select
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              className="input-pet w-full"
            >
              <option value="">Seleccioná tu mascota (opcional)</option>
              {petsData?.items?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.species})
                </option>
              ))}
            </select>

            {type === "paseador" && (
              <div>
                <label className="text-sm text-text-muted block mb-1">
                  Paseos por semana: {frequency}
                </label>
                <input
                  type="range"
                  min={1}
                  max={21}
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-text-muted">
                  <span>1</span>
                  <span>21</span>
                </div>
              </div>
            )}

            {type === "cuidador" && (
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-text-muted block">Desde</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="input-pet w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-text-muted block">Hasta</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="input-pet w-full"
                  />
                </div>
              </div>
            )}

            <div>
              <input
                value={location_}
                onChange={(e) => setLocation_(e.target.value)}
                onBlur={() => markTouch("location")}
                placeholder="Ubicación (barrio, localidad)"
                className={inputClass("location", locValid)}
              />
              {touched.location && !locValid && (
                <p className="text-xs text-red-500 mt-1">Mínimo 3 caracteres</p>
              )}
            </div>

            {/* Mapa */}
            <div>
              <label className="text-sm text-text-muted block mb-2">Ubicá en el mapa (opcional)</label>
              <MapLocationPicker
                onLocationChange={(newLat, newLng) => {
                  setLat(newLat);
                  setLng(newLng);
                }}
              />
            </div>
          </div>
        )}

        {/* Step 3: Resumen */}
        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p><strong>Tipo:</strong> {serviceTypes.find((s) => s.value === type)?.icon} {serviceTypes.find((s) => s.value === type)?.label}</p>
              <p><strong>Título:</strong> {title}</p>
              <p><strong>Descripción:</strong> {description}</p>
              {petId && <p><strong>Mascota:</strong> {petsData?.items?.find((p: any) => p.id === petId)?.name || petId}</p>}
              {type === "paseador" && <p><strong>Paseos por semana:</strong> {frequency}</p>}
              {type === "cuidador" && (startDate || endDate) && (
                <p><strong>Fechas:</strong> {startDate || "?"} → {endDate || "?"}</p>
              )}
              <p><strong>Ubicación:</strong> {location_}</p>
              {lat !== undefined && <p className="text-xs text-text-muted">📍 {lat.toFixed(4)}, {lng?.toFixed(4)}</p>}
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 justify-between mt-6">
          {step > 1 ? (
            <button onClick={() => setStep(step - 1)} className="btn-secondary">
              Atrás
            </button>
          ) : (
            <button onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
              className="btn-primary disabled:opacity-40"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={() => {
                if (!token) {
                  setShowLoginModal(true);
                  return;
                }
                createMut.mutate();
              }}
              disabled={createMut.isPending}
              className="btn-primary"
            >
              {createMut.isPending ? "Publicando..." : "Publicar búsqueda"}
            </button>
          )}
        </div>
        {step === 1 && !isStep1Valid && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <p className="font-semibold">⚠️ Seleccioná un tipo de servicio</p>
          </div>
        )}
        {step === 2 && !isStep2Valid && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-0.5">
            <p className="font-semibold mb-1">⚠️ Completá para continuar:</p>
            {!titleValid && <p>• Título: {title.length}/5 caracteres mínimo</p>}
            {!descValid && <p>• Descripción: {description.length}/20 caracteres mínimo</p>}
            {!locValid && <p>• Ubicación: {location_.length}/3 caracteres mínimo</p>}
          </div>
        )}
      </div>

      <LoginPromptModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="publicar un servicio"
      />
    </div>
  );
}
