import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ChevronRight, BellOff, Eye, EyeOff, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authApi } from '../api/endpoints'
import AvatarUpload from '../components/AvatarUpload'

const profileSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  full_name: z.string().optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const emailSchema = z.object({
  newEmail: z.string().email('Email inválido'),
})

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirma tu contraseña'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

export default function SettingsPage() {
  const navigate = useNavigate()
  const profile = useAuthStore((s) => s.profile)
  const setProfile = useAuthStore((s) => s.setProfile)
  const logoutStore = useAuthStore((s) => s.logout)
  const userEmail = profile?.email ?? ''
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [emailMsg, setEmailMsg] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteEmail, setDeleteEmail] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(true)

  useEffect(() => {
    authApi.getMe().then((res) => {
      setProfile(res.data)
    }).catch(() => {
      // si falla, usamos lo que haya en el store
    }).finally(() => {
      setLoadingEmail(false)
    })
  }, [])

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      username: profile?.username ?? '',
      full_name: profile?.full_name ?? '',
      bio: profile?.bio ?? '',
    },
  })

  const { register: registerEmail, handleSubmit: handleEmailSubmit, formState: { errors: emailErrors } } = useForm<{ newEmail: string }>({
    resolver: zodResolver(emailSchema),
  })

  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors } } = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(passwordSchema),
  })

  const onSaveProfile = async (data: ProfileFormData) => {
    setSavingProfile(true)
    setProfileMsg(null)
    setProfileError(null)
    try {
      const res = await authApi.updateMe({
        username: data.username,
        full_name: data.full_name || undefined,
        bio: data.bio || undefined,
      })
      setProfile(res.data)
      setProfileMsg('Perfil actualizado')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setProfileError(msg || 'Error al guardar')
    } finally {
      setSavingProfile(false)
    }
  }

  const onChangeEmail = async (data: { newEmail: string }) => {
    setSendingEmail(true)
    setEmailMsg(null)
    setEmailError(null)
    try {
      const res = await authApi.changeEmail(data.newEmail)
      setEmailMsg(
        (res.data as { detail: string }).detail
        ?? 'Te enviamos un email de confirmación a la nueva dirección.',
      )
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setEmailError(msg || 'Error al cambiar email')
    } finally {
      setSendingEmail(false)
    }
  }

  const onChangePassword = async (data: { newPassword: string }) => {
    setChangingPassword(true)
    setPasswordMsg(null)
    setPasswordError(null)
    try {
      await authApi.changePassword(data.newPassword)
      setPasswordMsg('Contraseña actualizada correctamente')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setPasswordError(msg || 'Error al cambiar contraseña')
    } finally {
      setChangingPassword(false)
    }
  }

  const handleLogout = () => {
    logoutStore()
    navigate('/login')
  }

  const handleLogoutAll = () => {
    logoutStore()
    navigate('/login')
  }

  const handleDeleteAccount = async () => {
    if (deleteEmail !== userEmail) return
    setDeleting(true)
    try {
      await authApi.deleteMe()
      logoutStore()
      navigate('/login', { state: { deleted: true } })
    } catch (err: unknown) {
      console.error(err)
    } finally {
      setDeleting(false)
    }
  }

  const sectionClass = "bg-white/5 border border-white/10 rounded-2xl p-5"
  const labelClass = "text-xs font-medium text-gray-400 uppercase tracking-wide mb-1"
  const inputClass = "w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none transition-colors"
  const btnPrimaryClass = "bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl px-6 py-3 transition-colors disabled:opacity-50"
  const btnGhostClass = "bg-white/10 hover:bg-white/15 text-white font-medium rounded-xl px-6 py-3 transition-colors"

  return (
    <div className="min-h-screen bg-[#0a0a0b]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Configuración</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sección Perfil */}
        <section className={`${sectionClass} mb-5`}>
          <h3 className="text-lg font-semibold text-primary mb-4">Perfil</h3>

          <AvatarUpload
            currentUrl={profile?.avatar_url}
            onUploaded={async (url) => {
              try {
                const res = await authApi.updateMe({ avatar_url: url })
                setProfile(res.data)
              } catch { /* fallback */ }
            }}
          />

          <form onSubmit={handleProfileSubmit(onSaveProfile)} className="mt-5 space-y-4">
            <div>
              <label className={labelClass}>Nombre de usuario</label>
              <input
                {...registerProfile('username')}
                className={inputClass}
                placeholder="Tu username"
              />
              {profileErrors.username && (
                <p className="text-red-400 text-xs mt-1">{profileErrors.username.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Nombre completo</label>
              <input
                {...registerProfile('full_name')}
                className={inputClass}
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className={labelClass}>Bio</label>
              <textarea
                {...registerProfile('bio')}
                className={`${inputClass} resize-none h-20`}
                placeholder="Cuéntanos sobre ti..."
              />
            </div>

            {profileMsg && <p className="text-green-400 text-sm">{profileMsg}</p>}
            {profileError && <p className="text-red-400 text-sm">{profileError}</p>}

            <button type="submit" disabled={savingProfile} className={btnPrimaryClass}>
              {savingProfile ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </section>

        {/* Sección Cuenta */}
        <section className={`${sectionClass} mb-5`}>
          <h3 className="text-lg font-semibold text-primary mb-4">Cuenta</h3>

          <div className="mb-5">
            <label className={labelClass}>Email actual</label>
            <p className="text-white/60 px-4 py-3 bg-white/5 rounded-xl">
              {loadingEmail ? 'Cargando...' : (userEmail || 'No disponible')}
            </p>
          </div>

          <div className="mb-5">
            <h4 className="text-sm font-semibold text-white mb-3">Cambiar email</h4>
            <form onSubmit={handleEmailSubmit(onChangeEmail)} className="space-y-3">
              <input
                {...registerEmail('newEmail')}
                className={inputClass}
                placeholder="Nuevo email"
                type="email"
              />
              {emailErrors.newEmail && <p className="text-red-400 text-xs">{emailErrors.newEmail.message}</p>}
              {emailMsg && <p className="text-blue-400 text-sm">{emailMsg}</p>}
              {emailError && <p className="text-red-400 text-sm">{emailError}</p>}
              <button type="submit" disabled={sendingEmail} className={btnGhostClass}>
                {sendingEmail ? 'Enviando...' : 'Cambiar email'}
              </button>
            </form>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Cambiar contraseña</h4>
            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-3">
              <div className="relative">
                <input
                  {...registerPassword('newPassword')}
                  className={inputClass}
                  placeholder="Nueva contraseña"
                  type={showNewPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.newPassword && <p className="text-red-400 text-xs">{passwordErrors.newPassword.message}</p>}
              <div className="relative">
                <input
                  {...registerPassword('confirmPassword')}
                  className={inputClass}
                  placeholder="Confirmar nueva contraseña"
                  type={showConfirmPassword ? 'text' : 'password'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {passwordErrors.confirmPassword && <p className="text-red-400 text-xs">{passwordErrors.confirmPassword.message}</p>}
              {passwordMsg && <p className="text-green-400 text-sm">{passwordMsg}</p>}
              {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
              <button type="submit" disabled={changingPassword} className={btnGhostClass}>
                {changingPassword ? 'Cambiando...' : 'Cambiar contraseña'}
              </button>
            </form>
          </div>
        </section>

        {/* Sección Notificaciones */}
        <section className={`${sectionClass} mb-5`}>
          <h3 className="text-lg font-semibold text-primary mb-4">Notificaciones</h3>
          <div className="space-y-3">
            {[
              { label: 'Nuevos likes', icon: <BellOff className="w-5 h-5" /> },
              { label: 'Nuevos comentarios', icon: <BellOff className="w-5 h-5" /> },
              { label: 'Nuevos seguidores', icon: <BellOff className="w-5 h-5" /> },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Próximamente</span>
                  <div className="w-10 h-6 rounded-full bg-white/10 flex items-center px-0.5 opacity-50">
                    <div className="w-5 h-5 rounded-full bg-gray-500 shadow-sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección Sesión */}
        <section className={`${sectionClass} mb-5`}>
          <h3 className="text-lg font-semibold text-primary mb-4">Sesión</h3>
          <div className="space-y-3">
            <button onClick={handleLogout} className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <span className="text-white/80 text-sm font-medium">Cerrar sesión</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
            <button onClick={handleLogoutAll} className="w-full flex items-center justify-between py-3 px-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <span className="text-white/80 text-sm font-medium">Cerrar sesión en todos los dispositivos</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </section>

        {/* Sección Zona de peligro */}
        <section className={`${sectionClass} border-red-500/20`}>
          <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5" />
            Zona de peligro
          </h3>
          <p className="text-white/50 text-sm mb-4">
            Eliminar tu cuenta es permanente. Se borrarán todos tus datos, posts y mascotas. Esta acción no se puede deshacer.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            Eliminar cuenta
          </button>
        </section>

        {/* Modal de eliminación */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="bg-[#1a1a1d] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
              <h3 className="text-xl font-bold text-white mb-2">Eliminar cuenta</h3>
              <p className="text-white/60 text-sm mb-4">
                Esta acción es permanente e irreversible. Escribe tu email para confirmar.
              </p>
              <input
                type="email"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                className={inputClass}
                placeholder="Escribe tu email para confirmar"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => { setShowDeleteModal(false); setDeleteEmail('') }}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white rounded-xl py-3 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteEmail !== userEmail || deleting}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-3 font-semibold transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
