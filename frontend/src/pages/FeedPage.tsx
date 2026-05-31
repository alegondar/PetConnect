import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedApi, petsApi, instapetApi, usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'

function PetStories() {
  const currentProfile = useAuthStore((s) => s.profile)

  const { data: myPets } = useQuery({
    queryKey: ['my-pets-stories'],
    queryFn: async () => {
      const res = await petsApi.myPets({ page: 1, limit: 50 })
      return res.data
    },
    staleTime: 120_000,
  })

  const { data: followingPets } = useQuery({
    queryKey: ['following-pets-stories'],
    queryFn: async () => {
      const res = await instapetApi.listFollowing({ page: 1, limit: 50 })
      return res.data
    },
    staleTime: 120_000,
  })

  const { data: followingUsers } = useQuery({
    queryKey: ['following-users-stories', currentProfile?.id],
    queryFn: async () => {
      if (!currentProfile) return { items: [] }
      const res = await usersApi.getFollowing(currentProfile.id, { limit: 50 })
      return res.data as { items: { id: string; username: string; full_name: string | null; avatar_url: string | null; is_following: boolean }[] }
    },
    staleTime: 120_000,
    enabled: !!currentProfile,
  })

  const stories = [
    ...(myPets?.items || []).map((p: any) => ({ ...p, type: 'pet' as const })),
    ...((followingPets as { items: any[] })?.items || []).map((fp: any) => ({
      id: fp.pet_id,
      name: fp.pet_name,
      photo_url: fp.pet_photo_url,
      type: 'instapet-following' as const,
    })),
    ...(followingUsers?.items || []).map((u: any) => ({
      id: u.id,
      name: u.username,
      photo_url: u.avatar_url,
      type: 'user' as const,
    })),
  ]

  return (
    <div className="mb-5">
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        {stories.map((story: any) => (
          <a
            key={`${story.type}-${story.id}`}
            href={story.type === 'user' ? `/profile/${story.id}` : `/instapet/${story.id}`}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {story.photo_url ? (
                  <img
                    src={story.photo_url}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">{story.type === 'user' ? '👤' : '🐾'}</span>
                )}
              </div>
            </div>
            <p className="text-[10px] font-medium text-text-muted text-center leading-tight max-w-[64px] truncate">
              {story.type === 'user' ? `@${story.name}` : story.name}
            </p>
          </a>
        ))}
      </div>
      <div className="border-b border-gray-200" />
    </div>
  )
}

export default function FeedPage() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [feedMode, setFeedMode] = useState<'global' | 'following'>('global')

  const { data, isLoading } = useQuery({
    queryKey: ['feed', feedMode],
    queryFn: async () => {
      const params: Record<string, string | number> = { page: 1, limit: 20 }
      if (feedMode === 'following') params.mode = 'following'
      const res = await feedApi.list(params)
      return res.data
    },
  })

  const items = data?.items ?? []
  const isEmptyFollowing = feedMode === 'following' && !isLoading && items.length === 0

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            🐾 Feed
          </h2>
          <p className="text-sm text-text-muted mt-0.5">Lo último de tus mascotas favoritas</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary text-sm px-4 py-2.5"
        >
          + Post
        </button>
      </div>

      {/* Toggle Para vos / Siguiendo */}
      <div className="flex gap-1 mb-4 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setFeedMode('global')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            feedMode === 'global'
              ? 'bg-white text-primary shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Para vos
        </button>
        <button
          onClick={() => setFeedMode('following')}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            feedMode === 'following'
              ? 'bg-white text-primary shadow-sm'
              : 'text-text-muted hover:text-text'
          }`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Siguiendo
        </button>
      </div>

      <PetStories />

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-text-muted text-sm font-medium">Cargando publicaciones...</p>
        </div>
      )}

      {isEmptyFollowing && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            Todavía no seguís a nadie
          </p>
          <p className="text-text-muted text-sm mt-1 mb-4">
            ¡Explorá usuarios y empezá a seguir!
          </p>
          <button
            onClick={() => navigate('/search')}
            className="btn-primary text-sm px-6 py-2.5"
          >
            Buscar usuarios
          </button>
        </div>
      )}

      {!isEmptyFollowing && (
        <div className="space-y-4">
          {items.map((post: any, i: number) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}

      {!isLoading && feedMode === 'global' && items.length === 0 && (
        <div className="text-center py-16">
          <p className="text-text-muted text-lg font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            No hay posts aún
          </p>
          <p className="text-text-muted text-sm mt-1">Sé el primero en publicar!</p>
        </div>
      )}

      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}
