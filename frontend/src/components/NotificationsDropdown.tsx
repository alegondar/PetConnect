import { useState, useEffect, useRef } from 'react'
import { Bell } from 'lucide-react'
import { notificationsApi, usersApi } from '../api/endpoints'

interface Notification {
  id: string
  type: 'new_follower' | 'new_like' | 'new_comment'
  data: { follower_id?: string; liker_id?: string; commenter_id?: string; post_id?: string }
  read_at: string | null
  created_at: string
}

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await notificationsApi.list()
      const items = (res.data as { items: Notification[] }).items ?? []
      setNotifications(items.slice(0, 10))
      setUnreadCount(items.filter((n) => !n.read_at).length)
    } catch {
      // ignore
    }
  }

  const handleOpen = async () => {
    setOpen(!open)
    if (!open) {
      await fetchNotifications()
      try {
        await notificationsApi.markRead()
        setUnreadCount(0)
      } catch {
        // ignore
      }
    }
  }

  const getMessage = (n: Notification) => {
    switch (n.type) {
      case 'new_follower':
        return 'empezó a seguirte'
      case 'new_like':
        return 'le dio like a tu post'
      case 'new_comment':
        return 'comentó tu post'
      default:
        return ''
    }
  }

  const getUsername = async (n: Notification): Promise<string> => {
    const userId =
      n.data.follower_id ?? n.data.liker_id ?? n.data.commenter_id
    if (!userId) return 'Alguien'
    try {
      const res = await usersApi.getProfile(userId)
      const profile = res.data as { username: string }
      return profile.username ?? 'Alguien'
    } catch {
      return 'Alguien'
    }
  }

  const [usernames, setUsernames] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!open || notifications.length === 0) return
    notifications.forEach(async (n) => {
      const userId =
        n.data.follower_id ?? n.data.liker_id ?? n.data.commenter_id
      if (!userId || usernames[userId]) return
      const name = await getUsername(n)
      setUsernames((prev) => ({ ...prev, [userId]: name }))
    })
  }, [open, notifications.length])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleOpen}
        className="relative text-text-muted hover:text-primary transition-colors"
        title="Notificaciones"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-72 bg-[#1a1a1d] border border-white/10 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <h3 className="text-white text-sm font-bold">Notificaciones</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">
                No tenés notificaciones todavía
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                    !n.read_at ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-primary text-xs font-bold">
                      {usernames[
                        n.data.follower_id ??
                        n.data.liker_id ??
                        n.data.commenter_id ??
                        ''
                      ]?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm">
                      <span className="font-semibold text-white">
                        @
                        {usernames[
                          n.data.follower_id ??
                          n.data.liker_id ??
                          n.data.commenter_id ??
                          ''
                        ] ?? '...'}
                      </span>{' '}
                      {getMessage(n)}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(n.created_at).toLocaleDateString('es', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
