import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from "../../api/endpoints";

interface Props {
  mode: "request" | "offer";
  id: string;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export default function ContactServiceModal({ mode, id, title, subtitle, onClose }: Props) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const contactMut = useMutation({
    mutationFn: async () => {
      if (mode === "request") {
        return servicesApi.contactRequest(id, message);
      }
      return servicesApi.contactOffer(id, message);
    },
    onSuccess: () => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["my-contacts"] });
    },
    onError: (err: unknown) => {
      const detail = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
      setError(detail || "Error al enviar");
    },
  });

  if (success) {
    return (
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="text-4xl block mb-3">📨</span>
          <h3
            className="text-lg font-bold mb-2"
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            ¡Mensaje enviado!
          </h3>
          <p className="text-sm text-text-muted mb-4">
            El usuario recibirá una notificación con tu mensaje.
          </p>
          <button onClick={onClose} className="btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-lg font-bold mb-1"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Contactar
        </h3>
        <p className="text-sm text-text-muted mb-4">
          {title}
          {subtitle && <span className="block text-xs mt-0.5">{subtitle}</span>}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
        )}

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Escribí tu mensaje (mín. 10 caracteres)"
          className="input-pet w-full resize-none h-32"
          maxLength={500}
          minLength={10}
        />
        <p className="text-xs text-text-muted mt-1 text-right">
          {message.length}/500
        </p>

        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="btn-secondary">
            Cancelar
          </button>
          <button
            onClick={() => contactMut.mutate()}
            disabled={message.length < 10 || contactMut.isPending}
            className="btn-primary disabled:opacity-40"
          >
            {contactMut.isPending ? "Enviando..." : "Enviar mensaje"}
          </button>
        </div>
      </div>
    </div>
  );
}
