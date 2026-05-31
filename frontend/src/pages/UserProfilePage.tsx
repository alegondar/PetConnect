import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Grid3X3, X } from 'lucide-react'
import { usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import FollowButton from '../components/FollowButton'
import FollowersModal from '../components/FollowersModal'
import FollowingModal from '../components/FollowingModal'

interface UserProfile {
  id: string
  username: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  followers_count: number
  following_count: number
  posts_count: number
  is_following: boolean
}

interface PostItem {
  id: string
  photo_url: string | null
  content: string | null
  likes_count: number
  comments_count: number
  created_at: string
  pet?: { name: string; photo_url: string | null } | null
  author?: { id: string; username: string; avatar_url: string | null } | null
}

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const currentProfile = useAuthStore((s) => s.profile)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    Promise.all([
      usersApi.getProfile(userId),
      usersApi.getUserPosts(userId, { limit: 50 }),
    ])
      .then(([profileRes, postsRes]) => {
        setProfile(profileRes.data as UserProfile)
        const postsData = postsRes.data as { items: PostItem[] }
        setPosts(postsData.items ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <p className="text-white/60">Usuario no encontrado</p>
      </div>
    )
  }

  const isOwnProfile = currentProfile?.id === profile.id

  return (
    <div className="min-h-screen bg-[#0a0a0b]" style={{ fontFamily: "'Fredoka', sans-serif" }}>
      <div className="max-w-lg mx-auto px-4 py-6 pb-24">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-6" />
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 overflow-hidden border-2 border-primary/30 mb-4">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary/40 text-3xl font-bold">
                {profile.username[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold text-white">@{profile.username}</h2>
          {profile.full_name && (
            <p className="text-white/70 text-sm mt-1">{profile.full_name}</p>
          )}
          {profile.bio && (
            <p className="text-white/50 text-sm mt-2 text-center max-w-xs">{profile.bio}</p>
          )}

          <div className="flex items-center gap-6 mt-4">
            <span className="text-white/70 text-sm">
              <span className="font-bold text-white">{profile.posts_count}</span> posts
            </span>
            <button
              onClick={() => setShowFollowers(true)}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              <span className="font-bold text-white">{profile.followers_count}</span> seguidores
            </button>
            <button
              onClick={() => setShowFollowing(true)}
              className="text-white/70 text-sm hover:text-white transition-colors"
            >
              <span className="font-bold text-white">{profile.following_count}</span> siguiendo
            </button>
          </div>

          <div className="mt-4">
            {isOwnProfile ? (
              <button
                onClick={() => navigate('/settings')}
                className="px-6 py-2 rounded-xl border border-white/20 text-white/80 text-sm font-semibold hover:border-white/40 transition-colors"
              >
                Editar perfil
              </button>
            ) : (
              <FollowButton
                userId={profile.id}
                initialIsFollowing={profile.is_following}
                onFollowChange={(following) => {
                  setProfile((prev) =>
                    prev
                      ? {
                          ...prev,
                          is_following: following,
                          followers_count: prev.followers_count + (following ? 1 : -1),
                        }
                      : prev,
                  )
                }}
              />
            )}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="border-t border-white/10 pt-4">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-white/40">
              <Grid3X3 className="w-10 h-10 mb-3" />
              <p className="text-sm">Todavía no hay publicaciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {posts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="aspect-square bg-white/5 overflow-hidden hover:opacity-80 transition-opacity"
                >
                  {post.photo_url ? (
                    <img
                      src={post.photo_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl">
                      🐾
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post Detail Modal */}
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4"
            onClick={() => setSelectedPost(null)}
          >
            <div
              className="bg-[#1a1a1d] border border-white/10 rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedPost.photo_url && (
                <img
                  src={selectedPost.photo_url}
                  alt=""
                  className="w-full aspect-square object-cover rounded-t-2xl"
                />
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white font-semibold text-sm">
                    @{selectedPost.author?.username ?? profile.username}
                  </span>
                  {selectedPost.pet?.name && (
                    <span className="text-white/50 text-sm">· {selectedPost.pet.name}</span>
                  )}
                </div>
                {selectedPost.content && (
                  <p className="text-white/80 text-sm mb-3">{selectedPost.content}</p>
                )}
                <div className="flex items-center gap-4 text-white/50 text-sm">
                  <span>{selectedPost.likes_count} likes</span>
                  <span>{selectedPost.comments_count} comentarios</span>
                </div>
              </div>
              <div className="p-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="w-full py-2 text-white/60 hover:text-white text-sm transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modals */}
        <FollowersModal userId={profile.id} open={showFollowers} onClose={() => setShowFollowers(false)} />
        <FollowingModal userId={profile.id} open={showFollowing} onClose={() => setShowFollowing(false)} />
      </div>
    </div>
  )
}
