import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
})

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        ;(config as any)._hadToken = true
      }
    }
  } catch {
    // localStorage corrupto o vacío, continuar sin token
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && (error.config as any)?._hadToken) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
