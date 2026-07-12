import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { usersApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import LoginPromptModal from './LoginPromptModal'

interface Props {
  userId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export default function FollowButton({ userId, initialIsFollowing, onFollowChange }: Props) {
  const token = useAuthStore((s) => s.token)
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [loading, setLoading] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleClick = async () => {
    if (!token) {
      setShowLoginModal(true)
      return
    }
    setLoading(true)
    try {
      if (isFollowing) {
        await usersApi.unfollow(userId)
        setIsFollowing(false)
        onFollowChange?.(false)
      } else {
        await usersApi.follow(userId)
        setIsFollowing(true)
        onFollowChange?.(true)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <button
      disabled
      className="px-6 py-2 rounded-xl bg-white/10 text-white/50 flex items-center gap-2 text-sm font-semibold"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
    </button>
  }

  if (isFollowing) {
    return (
      <>
        <button
          onClick={handleClick}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className={`px-6 py-2 rounded-xl border text-sm font-semibold transition-colors ${
            hovering
              ? 'border-red-500/30 text-red-400 bg-red-500/10'
              : 'border-white/20 text-white/80 hover:border-white/40'
          }`}
        >
          {hovering ? 'Dejar de seguir' : 'Siguiendo'}
        </button>
        <LoginPromptModal
          open={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          action="seguir a esta mascota"
        />
      </>
    )
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="px-6 py-2 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-semibold transition-colors"
      >
        Seguir
      </button>
      <LoginPromptModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="seguir a esta mascota"
      />
    </>
  )
}
