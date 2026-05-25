import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/endpoints'
import type { Profile } from '../types'

interface AuthState {
  token: string | null
  profile: Profile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  setProfile: (profile: Profile) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await authApi.login({ email, password })
          set({ token: res.data.access_token, profile: res.data.profile })
        } finally {
          set({ isLoading: false })
        }
      },
      register: async (email, password, username) => {
        set({ isLoading: true })
        try {
          const res = await authApi.register({ email, password, username })
          set({ token: res.data.access_token, profile: res.data.profile })
        } finally {
          set({ isLoading: false })
        }
      },
      logout: () => set({ token: null, profile: null }),
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'auth-storage' },
  ),
)
