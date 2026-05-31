import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const schema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirm: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirm, {
  message: 'Las contraseñas no coinciden',
  path: ['confirm'],
})

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // token is in the URL hash, supabase handles it automatically
      }
    })
  }, [])

  const onSubmit = async (data: { password: string }) => {
    setError(null)
    const { error: updateError } = await supabase.auth.updateUser({
      password: data.password,
    })
    if (updateError) {
      setError(updateError.message)
      return
    }
    setSuccess(true)
    setTimeout(() => navigate('/feed'), 2000)
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl inline-block mb-4">🔒</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Nueva contraseña
          </h2>
          <p className="text-text-muted mt-2">
            {success ? 'Contraseña actualizada' : 'Ingresa tu nueva contraseña'}
          </p>
        </div>

        {success ? (
          <p className="text-center text-success font-medium">
            Contraseña actualizada correctamente. Redirigiendo al feed...
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('password')}
                type="password"
                placeholder="Nueva contraseña"
                className="input-pet w-full"
              />
              {errors.password && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>}
            </div>
            <div>
              <input
                {...register('confirm')}
                type="password"
                placeholder="Confirmar contraseña"
                className="input-pet w-full"
              />
              {errors.confirm && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.confirm.message}</p>}
            </div>
            {error && <p className="text-danger text-sm">{error}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full text-center"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
