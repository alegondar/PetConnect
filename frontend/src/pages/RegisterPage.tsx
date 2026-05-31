import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  username: z.string().min(3, 'Mínimo 3 caracteres').max(30),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const registerUser = useAuthStore((s) => s.register)
  const token = useAuthStore((s) => s.token)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  if (token) {
    navigate('/feed', { replace: true })
    return null
  }

  const onSubmit = async (data: FormData) => {
    try {
      queryClient.clear()
      await registerUser(data.email, data.password, data.username)
      navigate('/feed')
    } catch {
      alert('Error al registrarse. ¿El email ya existe?')
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl animate-float inline-block mb-4">🐣</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Únete a PetConnect
          </h2>
          <p className="text-text-muted mt-2">Crea tu cuenta y empieza a compartir</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register('username')}
              placeholder="Nombre de usuario"
              className="input-pet w-full"
            />
            {errors.username && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.username.message}</p>}
          </div>
          <div>
            <input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="input-pet w-full"
            />
            {errors.email && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Contraseña (mín 6 caracteres)"
              className="input-pet w-full"
            />
            {errors.password && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-center"
          >
            {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
