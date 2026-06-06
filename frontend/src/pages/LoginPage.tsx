import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import yorkieImage from '../assets/yorkiepared.webp'

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
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
      queryClient.clear()
      await login(data.email, data.password)
      navigate('/feed')
    } catch {
      alert('Credenciales inválidas')
    }
  }

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="wave-clip" clipPathUnits="objectBoundingBox">
            <path d="M 0,0
              C 0.08,0.08 0.14,0.16 0.02,0.25
              C -0.05,0.32 0.04,0.38 0,0.48
              C 0.11,0.56 0.15,0.65 0.03,0.75
              C -0.06,0.84 0.05,0.92 0,1
              L 1,1 L 1,0 Z" />
          </clipPath>
          <filter id="mist-blur" x="-50%" y="-10%" width="200%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" />
          </filter>
          <filter id="mist-edge" x="-80%" y="-10%" width="200%" height="120%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
          </filter>
        </defs>
      </svg>

      <div className="hidden md:block fixed top-0 right-0 w-[42%] h-full z-[1]" style={{ clipPath: 'url(#wave-clip)' }}>
        <img
          src={yorkieImage}
          alt="Mascota PetConnect"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        <div
          className="absolute top-0 left-0 w-32 h-full z-10 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(249,250,251,0.95) 0%, rgba(249,250,251,0.5) 30%, rgba(249,250,251,0.08) 60%, transparent 100%)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        />
      </div>

      <div className="min-h-[80vh] flex flex-col items-center justify-center relative z-[2] md:mr-[42%]">
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
    </>
  )
}
