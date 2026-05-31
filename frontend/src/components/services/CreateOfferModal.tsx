import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi, petsApi } from "../../api/endpoints";
import MapLocationPicker from "../MapLocationPicker";

const serviceTypes = [
  { value: "paseador", label: "Paseador", icon: "🐾" },
  { value: "cuidador", label: "Cuidador", icon: "🏠" },
  { value: "veterinario", label: "Veterinario", icon: "🩺" },
  { value: "peluqueria", label: "Peluquería", icon: "✂️" },
];

const weekDays = [
  { value: "lunes", label: "Lun" },
  { value: "martes", label: "Mar" },
  { value: "miercoles", label: "Mié" },
  { value: "jueves", label: "Jue" },
  { value: "viernes", label: "Vie" },
  { value: "sabado", label: "Sáb" },
  { value: "domingo", label: "Dom" },
];

interface Props {
  onClose: () => void;
}

export default function CreateOfferModal({ onClose }: Props) {
  const queryClient = useQueryClient();
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [priceUnit, setPriceUnit] = useState("por visita");
  const [days, setDays] = useState<string[]>([]);
  const [location_, setLocation_] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await petsApi.uploadPhoto(file);
      setPhotoUrl(res.data.url);
    } catch {
      setError("Error al subir la foto");
    } finally {
      setUploading(false);
    }
  };

  const toggleDay = (day: string) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const createMut = useMutation({
    mutationFn: async () => {
      const data: Record<string, unknown> = {
        service_type: type,
        title,
        description,
        location: location_,
        available_days: days,
        price_unit: priceUnit,
      };
      if (priceFrom) data.price_from = Number(priceFrom);
      if (priceTo) data.price_to = Number(priceTo);
      if (lat !== undefined) data.lat = lat;
      if (lng !== undefined) data.lng = lng;
      if (photoUrl) data.photo_url = photoUrl;
      return servicesApi.createOffer(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services-offers"] });
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
  const isValid = !!type && titleValid && descValid && locValid;

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
          Ofrecer servicio
        </h3>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
        )}

        <div className="space-y-3">
          {/* Tipo */}
          <div className="grid grid-cols-4 gap-2">
            {serviceTypes.map((st) => (
              <button
                key={st.value}
                onClick={() => { setType(st.value); markTouch("type"); }}
                className={`p-2 rounded-xl border-2 transition-all text-center ${
                  type === st.value
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="text-xl block">{st.icon}</span>
                <span className="text-[10px] font-semibold">{st.label}</span>
              </button>
            ))}
          </div>

          <div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => markTouch("title")}
              placeholder="Título del servicio"
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
              placeholder="Describí tu servicio (mín. 20 caracteres)"
              className={`${inputClass("description", descValid)} resize-none h-28`}
              maxLength={1000}
            />
            <p className={`text-xs mt-1 text-right ${description.length < 20 ? "text-text-muted" : "text-green-600"}`}>
              {description.length}/20 mínimo · {description.length}/1000
            </p>
          </div>

          {/* Precios */}
          <div className="flex gap-2">
            <input
              value={priceFrom}
              onChange={(e) => setPriceFrom(e.target.value)}
              placeholder="$ Desde"
              type="number"
              className="input-pet w-full"
            />
            <input
              value={priceTo}
              onChange={(e) => setPriceTo(e.target.value)}
              placeholder="$ Hasta"
              type="number"
              className="input-pet w-full"
            />
          </div>
          <select
            value={priceUnit}
            onChange={(e) => setPriceUnit(e.target.value)}
            className="input-pet w-full"
          >
            <option value="por visita">por visita</option>
            <option value="por hora">por hora</option>
            <option value="por día">por día</option>
          </select>

          {/* Días disponibles */}
          <div>
            <label className="text-sm text-text-muted block mb-2">Días disponibles</label>
            <div className="flex gap-1 flex-wrap">
              {weekDays.map((d) => (
                <button
                  key={d.value}
                  onClick={() => toggleDay(d.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    days.includes(d.value)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-text-muted hover:bg-gray-200"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

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
            <label className="text-sm text-text-muted block mb-2">Ubicá tu servicio en el mapa (opcional)</label>
            <MapLocationPicker
              onLocationChange={(newLat, newLng) => {
                setLat(newLat);
                setLng(newLng);
              }}
            />
          </div>

          {/* Foto */}
          <div>
            <label className="text-sm text-text-muted block mb-2">Foto del servicio (opcional)</label>
            {photoUrl ? (
              <div className="relative inline-block">
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-xl"
                />
                <button
                  onClick={() => { setPhotoUrl(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-text-muted hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">📷</span>
                {uploading ? "Subiendo..." : "Subir foto"}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={uploading}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => createMut.mutate()}
            disabled={!isValid || createMut.isPending}
            className="btn-primary disabled:opacity-40"
          >
            {createMut.isPending ? "Publicando..." : "Publicar oferta"}
          </button>
        </div>
        {!isValid && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-0.5">
            <p className="font-semibold mb-1">⚠️ Completá para publicar:</p>
            {!type && <p>• Seleccioná un tipo de servicio</p>}
            {!titleValid && <p>• Título: {title.length}/5 caracteres mínimo</p>}
            {!descValid && <p>• Descripción: {description.length}/20 caracteres mínimo</p>}
            {!locValid && <p>• Ubicación: {location_.length}/3 caracteres mínimo</p>}
          </div>
        )}
      </div>
    </div>
  );
}
