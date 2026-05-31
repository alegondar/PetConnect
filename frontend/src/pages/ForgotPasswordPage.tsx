import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: { email: string }) => {
    setError(null)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      data.email,
      { redirectTo: `${window.location.origin}/settings/reset-password` }
    )
    if (resetError) {
      setError(resetError.message)
      return
    }
    setSent(true)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl inline-block mb-4">🔑</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Recuperar contraseña
          </h2>
          <p className="text-text-muted mt-2">
            {sent
              ? 'Te enviamos un enlace de recuperación a tu email'
              : 'Ingresa tu email y te enviaremos un enlace'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Email"
                className="input-pet w-full"
              />
              {errors.email && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
            </div>
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-center"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-text-muted text-sm mb-4">
              Revisa tu bandeja de entrada y sigue el enlace para restablecer tu contraseña.
            </p>
          </div>
        )}

        <p className="text-center text-sm text-text-muted mt-6">
          <Link to="/login" className="text-primary font-bold hover:underline" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Volver al inicio de sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
