import { useState, useEffect } from 'react'
import { X, Search } from 'lucide-react'
import { usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import FollowButton from './FollowButton'
import type { Profile } from '../types'

interface Props {
  userId: string
  open: boolean
  onClose: () => void
}

interface FollowerItem {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  is_following: boolean
}

export default function FollowersModal({ userId, open, onClose }: Props) {
  const currentProfile = useAuthStore((s) => s.profile)
  const [items, setItems] = useState<FollowerItem[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    usersApi.getFollowers(userId, { limit: 100 }).then((res) => {
      setItems((res.data as { items: FollowerItem[] }).items ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [userId, open])

  if (!open) return null

  const filtered = search
    ? items.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          (u.full_name ?? '').toLowerCase().includes(search.toLowerCase()),
      )
    : items

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <div
        className="bg-[#1a1a1d] border border-white/10 rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold text-white">Seguidores</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar seguidores"
              className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {loading ? (
            <p className="text-gray-400 text-center py-8 text-sm">Cargando...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-8 text-sm">
              {search ? 'Sin resultados' : 'No tiene seguidores todavía'}
            </p>
          ) : (
            filtered.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-3 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 overflow-hidden flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/60 text-sm font-bold">
                        {user.username[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">@{user.username}</p>
                    {user.full_name && (
                      <p className="text-gray-400 text-xs truncate">{user.full_name}</p>
                    )}
                  </div>
                </div>
                {currentProfile?.id !== user.id && (
                  <FollowButton
                    userId={user.id}
                    initialIsFollowing={user.is_following}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
