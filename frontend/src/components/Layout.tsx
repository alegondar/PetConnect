import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Settings, Search } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import NotificationsDropdown from './NotificationsDropdown'

const tabs = [
  { to: '/feed', label: '🐾 Feed' },
  { to: '/pet-friendly', label: 'PetFriendly' },
  { to: '/lost-pets', label: '🔍 Perdidos' },
  { to: '/my-pets', label: '🐶 Mis Pets' },
]

export default function Layout() {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)
  const hideNav = ['/login', '/register'].includes(location.pathname)

  return (
    <div className="min-h-screen relative z-[2]">
      {!hideNav && (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-lg mx-auto flex items-center justify-between px-4 py-3">
            <h1
              className="text-xl font-bold text-primary flex items-center gap-2"
              style={{ fontFamily: "'Fredoka', sans-serif" }}
            >
              <span aria-hidden className="text-2xl">🐾</span>
              PetConnect
            </h1>
            <div className="flex items-center gap-3">
              <NavLink
                to="/following"
                className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
              >
                Siguiendo
              </NavLink>
              {token && (
                <>
                  <NavLink
                    to="/search"
                    className="text-text-muted hover:text-primary transition-colors"
                    title="Buscar usuarios"
                  >
                    <Search className="w-5 h-5" />
                  </NavLink>
                  <NotificationsDropdown />
                  <NavLink
                    to="/settings"
                    className="text-text-muted hover:text-primary transition-colors"
                    title="Configuración"
                  >
                    <Settings className="w-5 h-5" />
                  </NavLink>
                </>
              )}
              <NavLink
                to="/my-pets"
                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                <span aria-hidden>🐾</span>
              </NavLink>
            </div>
          </div>
        </header>
      )}

      <main className="max-w-lg mx-auto px-4 py-5 pb-[130px]">
        <Outlet />
      </main>

      {!hideNav && (
        <>
          <div className="fixed bottom-14 left-0 right-0 z-10 pointer-events-none">
            <div className="overflow-hidden bg-primary/10 border-t border-b border-primary/20">
              <p
                className="text-sm font-bold text-primary py-1.5 tracking-wide"
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  animation: 'marquee 16s linear infinite',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                }}
              >
                🐾 vamos los perros dale rambo dale rambo 🐾 &nbsp;&nbsp; vamos los perros dale rambo dale rambo 🐾 &nbsp;&nbsp; vamos los perros dale rambo dale rambo 🐾
              </p>
            </div>
          </div>

          <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto flex justify-around items-center py-2">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.to
                return (
                  <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={`text-sm font-bold px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'text-primary bg-primary/10'
                        : 'text-text-muted hover:text-text'
                    }`}
                    style={{ fontFamily: "'Fredoka', sans-serif" }}
                  >
                    {tab.label}
                  </NavLink>
                )
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
