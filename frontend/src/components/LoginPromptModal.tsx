import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  open: boolean
  onClose: () => void
  action?: string
}

export default function LoginPromptModal({ open, onClose, action }: Props) {
  const navigate = useNavigate()

  if (!open) return null

  const message = action
    ? `Creá tu cuenta gratis para ${action}`
    : 'Creá tu cuenta gratis para disfrutar todas las funciones'

  const handleLogin = () => {
    navigate('/login')
    onClose()
  }

  const handleRegister = () => {
    navigate('/register')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-in text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <span className="text-5xl block mb-4">🐾</span>

        <h3
          className="text-lg font-bold mb-2"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          ¡Únete a PetConnect!
        </h3>

        <p className="text-sm text-text-muted mb-6 px-2">{message}</p>

        <div className="flex flex-col gap-2.5">
          <button onClick={handleRegister} className="btn-primary w-full py-2.5 text-sm font-semibold">
            Crear cuenta
          </button>
          <button
            onClick={handleLogin}
            className="w-full py-2.5 text-sm font-semibold rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  )
}
