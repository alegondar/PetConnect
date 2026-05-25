import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { feedApi, petsApi, instapetApi } from '../api/endpoints'
import PostCard from '../components/PostCard'
import CreatePostModal from '../components/CreatePostModal'

function PetStories() {
  const { data: myPets } = useQuery({
    queryKey: ['my-pets-stories'],
    queryFn: async () => {
      const res = await petsApi.list({ page: 1, limit: 50 })
      return res.data
    },
    staleTime: 120_000,
  })

  const { data: following } = useQuery({
    queryKey: ['following-pets-stories'],
    queryFn: async () => {
      const res = await instapetApi.listFollowing({ page: 1, limit: 50 })
      return res.data
    },
    staleTime: 120_000,
  })

  const pets = [
    ...(myPets?.items || []),
    ...(following?.items || []),
  ]

  return (
    <div className="mb-5">
      <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none">
        {pets.map((pet: any) => (
          <a
            key={pet.id}
            href={`/instapet/${pet.id}`}
            className="flex flex-col items-center gap-1 flex-shrink-0"
          >
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-primary to-accent">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                {pet.photo_url ? (
                  <img
                    src={pet.photo_url}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl">🐾</span>
                )}
              </div>
            </div>
            <p className="text-[10px] font-medium text-text-muted text-center leading-tight max-w-[64px] truncate">
              {pet.name}
            </p>
          </a>
        ))}
      </div>
      <div className="border-b border-gray-200" />
    </div>
  )
}

export default function FeedPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['feed'],
    queryFn: async () => {
      const res = await feedApi.list({ page: 1, limit: 20 })
      return res.data
    },
  })

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

      <PetStories />

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="w-10 h-10 rounded-full border-3 border-primary/20 border-t-primary animate-spin" />
          <p className="text-text-muted text-sm font-medium">Cargando publicaciones...</p>
        </div>
      )}

      <div className="space-y-4">
        {data?.items?.map((post: any, i: number) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {data?.items?.length === 0 && (
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
