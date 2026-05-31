import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { instapetApi, usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'

export default function FollowingPage() {
  const navigate = useNavigate()
  const currentProfile = useAuthStore((s) => s.profile)

  const { data: petsData, isLoading: loadingPets } = useQuery({
    queryKey: ['following-pets'],
    queryFn: async () => {
      const res = await instapetApi.listFollowing({ page: 1, limit: 50 })
      return res.data
    },
  })

  const { data: usersData, isLoading: loadingUsers } = useQuery({
    queryKey: ['following-users', currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return { items: [] }
      const res = await usersApi.getFollowing(currentProfile.id, { limit: 50 })
      return res.data as { items: { id: string; username: string; full_name: string | null; avatar_url: string | null; is_following: boolean }[] }
    },
    enabled: !!currentProfile,
  })

  const petItems = (petsData as { items: any[] })?.items ?? []
  const userItems = usersData?.items ?? []

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver atrás
      </button>
      <h2 className="text-xl font-bold mb-4">Siguiendo</h2>

      {/* Usuarios */}
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Usuarios</h3>
      {loadingUsers && <p className="text-gray-400 text-sm">Cargando...</p>}
      {!loadingUsers && userItems.length === 0 && (
        <p className="text-gray-400 text-sm mb-4">No seguís a ningún usuario todavía</p>
      )}
      <div className="space-y-2 mb-6">
        {userItems.map((u: any) => (
          <Link
            key={u.id}
            to={`/profile/${u.id}`}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden flex-shrink-0">
              {u.avatar_url ? (
                <img src={u.avatar_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-primary/60 text-sm font-bold">
                  {u.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">@{u.username}</p>
              {u.full_name && <p className="text-xs text-gray-400">{u.full_name}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* Mascotas */}
      <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">Mascotas</h3>
      {loadingPets && <p className="text-gray-400 text-sm">Cargando...</p>}
      {!loadingPets && petItems.length === 0 && (
        <p className="text-gray-400 text-sm">No seguís a ninguna mascota todavía</p>
      )}
      <div className="space-y-2">
        {petItems.map((p: any) => (
          <a
            key={p.pet_id}
            href={`/instapet/${p.pet_id}`}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
              {p.pet_photo_url ? (
                <img src={p.pet_photo_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <span className="text-xl">🐾</span>
              )}
            </div>
            <div>
              <p className="font-semibold text-sm">{p.pet_name}</p>
              <p className="text-xs text-gray-400">{p.species}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
