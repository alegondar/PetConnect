import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
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
      await login(data.email, data.password)
      navigate('/feed')
    } catch {
      alert('Credenciales inválidas')
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-6xl animate-float inline-block mb-4">🐾</span>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            PetConnect
          </h2>
          <p className="text-text-muted mt-2">La red social de tus mascotas</p>
        </div>

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
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Contraseña"
              className="input-pet w-full"
            />
            {errors.password && <p className="text-danger text-xs mt-1.5 ml-1 font-medium">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full text-center"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Regístrate
          </Link>
        </p>

        <p className="text-center text-sm mt-3">
          <Link to="/forgot-password" className="text-text-muted hover:text-primary transition-colors underline underline-offset-2">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </div>
    </div>
  )
}
