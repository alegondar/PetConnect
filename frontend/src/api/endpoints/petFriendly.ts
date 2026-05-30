import api from '../client'

export const petFriendlyApi = {
  listPlaces: (params?: Record<string, string | number>) =>
    api.get('/pet-friendly', { params }),

  createPlace: (data: {
    nombre: string
    categoria: string
    lat: number
    lng: number
    direccion?: string
    descripcion?: string
    foto_url?: string
  }) => api.post('/pet-friendly', data),
}
