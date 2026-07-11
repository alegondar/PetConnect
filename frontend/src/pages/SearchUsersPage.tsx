import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import FollowButton from '../components/FollowButton'

interface UserItem {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  followers_count?: number
  is_following: boolean
}

export default function SearchUsersPage() {
  const navigate = useNavigate()
  const currentProfile = useAuthStore((s) => s.profile)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UserItem[]>([])
  const [suggestions, setSuggestions] = useState<UserItem[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    usersApi.search('', 10).then((res) => {
      const all = (res.data as { items: UserItem[] }).items ?? []
      setSuggestions(all.filter((u) => u.id !== currentProfile?.id).slice(0, 10))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!query.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      usersApi.search(query, 20)
        .then((res) => {
          const all = (res.data as { items: UserItem[] }).items ?? []
          setResults(all.filter((u) => u.id !== currentProfile?.id))
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const showSuggestions = !query.trim() && suggestions.length > 0
  const showResults = query.trim().length > 0
  const noResults = showResults && !loading && results.length === 0

  return (
    <div className="min-h-screen bg-[#0a0a0b]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Buscar usuarios</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nombre de usuario..."
            className="w-full bg-white/10 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
            autoFocus
          />
        </div>

        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          </div>
        )}

        {noResults && (
          <p className="text-gray-400 text-center py-8 text-sm">
            No encontramos usuarios con ese nombre
          </p>
        )}

        {showSuggestions && (
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wide mb-3">Sugerencias</p>
            <div className="space-y-1">
              {suggestions.map((user) => (
              <UserRow key={user.id} user={user} />
              ))}
            </div>
          </div>
        )}

        {showResults && !loading && (
          <div className="space-y-1">
            {results.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function UserRow({ user }: { user: UserItem }) {
  return (
    <div className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-white/5 transition-colors">
      <Link to={`/profile/${user.id}`} className="flex items-center gap-3 min-w-0 flex-1">
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
          <div className="flex items-center gap-2">
            {user.full_name && (
              <p className="text-gray-400 text-xs truncate">{user.full_name}</p>
            )}
          </div>
        </div>
      </Link>
      <FollowButton userId={user.id} initialIsFollowing={user.is_following} />
    </div>
  )
}
