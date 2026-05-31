import api from '../client'

export const authApi = {
  register: (data: { email: string; password: string; username: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateMe: (data: { username?: string; full_name?: string; avatar_url?: string; bio?: string }) =>
    api.put('/auth/me', data),
  changePassword: (password: string) =>
    api.put('/auth/password', { password }),
  changeEmail: (email: string) =>
    api.put('/auth/email', { email }),
  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/auth/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  deleteMe: () => api.delete('/auth/me'),
}

export const petsApi = {
  list: (params?: Record<string, string | number>) =>
    api.get('/pets', { params }),
  myPets: (params?: Record<string, number>) =>
    api.get('/my-pets', { params }),
  get: (petId: string) => api.get(`/pets/${petId}`),
  create: (data: Record<string, unknown>) => api.post('/pets', data),
  update: (petId: string, data: Record<string, unknown>) =>
    api.put(`/pets/${petId}`, data),
  delete: (petId: string) => api.delete(`/pets/${petId}`),
  uploadPhoto: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/pets/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  listVetVisits: (petId: string, params?: Record<string, number>) =>
    api.get(`/pets/${petId}/vet-visits`, { params }),
  createVetVisit: (petId: string, data: Record<string, unknown>) =>
    api.post(`/pets/${petId}/vet-visits`, data),
  deleteVetVisit: (petId: string, visitId: string) =>
    api.delete(`/pets/${petId}/vet-visits/${visitId}`),
  listEvents: (petId: string, params?: Record<string, number>) =>
    api.get(`/pets/${petId}/events`, { params }),
  createEvent: (petId: string, data: Record<string, unknown>) =>
    api.post(`/pets/${petId}/events`, data),
  deleteEvent: (petId: string, eventId: string) =>
    api.delete(`/pets/${petId}/events/${eventId}`),
}

export const feedApi = {
  list: (params?: Record<string, number | string>) =>
    api.get('/feed', { params }),
  get: (postId: string) => api.get(`/feed/${postId}`),
  create: (data: { pet_id: string; content?: string; photo_url?: string }) =>
    api.post('/feed', data),
  delete: (postId: string) => api.delete(`/feed/${postId}`),
  update: (postId: string, data: { content?: string; photo_url?: string }) =>
    api.put(`/feed/${postId}`, data),
  like: (postId: string) => api.post(`/feed/${postId}/like`),
  unlike: (postId: string) => api.delete(`/feed/${postId}/like`),
  listComments: (postId: string, params?: Record<string, number>) =>
    api.get(`/feed/${postId}/comments`, { params }),
  createComment: (postId: string, content: string) =>
    api.post(`/feed/${postId}/comments`, { content }),
  deleteComment: (postId: string, commentId: string) =>
    api.delete(`/feed/${postId}/comments/${commentId}`),
}

export const rankingApi = {
  get: (limit = 20) => api.get('/ranking', { params: { limit } }),
}

export const communityApi = {
  listLostPets: (params?: Record<string, string | number>) =>
    api.get('/lost-pets', { params }),
  getLostPet: (id: string) => api.get(`/lost-pets/${id}`),
  createLostPet: (data: Record<string, unknown>) =>
    api.post('/lost-pets', data),
  updateLostPet: (id: string, data: Record<string, unknown>) =>
    api.put(`/lost-pets/${id}`, data),
  deleteLostPet: (id: string) => api.delete(`/lost-pets/${id}`),
  listAdoptions: (params?: Record<string, string | number>) =>
    api.get('/adoptions', { params }),
  getAdoption: (id: string) => api.get(`/adoptions/${id}`),
  createAdoption: (data: { pet_id: string; description?: string }) =>
    api.post('/adoptions', data),
  updateAdoption: (id: string, data: Record<string, unknown>) =>
    api.put(`/adoptions/${id}`, data),
  deleteAdoption: (id: string) => api.delete(`/adoptions/${id}`),
}

export const instapetApi = {
  listPosts: (petId: string, params?: Record<string, number>) =>
    api.get(`/pets/${petId}/instapet/posts`, { params }),
  getPost: (petId: string, postId: string) =>
    api.get(`/pets/${petId}/instapet/posts/${postId}`),
  createPost: (petId: string, data: Record<string, unknown>) =>
    api.post(`/pets/${petId}/instapet/posts`, data),
  deletePost: (petId: string, postId: string) =>
    api.delete(`/pets/${petId}/instapet/posts/${postId}`),
  listFollowers: (petId: string, params?: Record<string, number>) =>
    api.get(`/pets/${petId}/followers`, { params }),
  follow: (petId: string) => api.post(`/pets/${petId}/follow`),
  unfollow: (petId: string) => api.delete(`/pets/${petId}/follow`),
  listFollowing: (params?: Record<string, number>) =>
    api.get('/me/following', { params }),
  listMilestones: (petId: string, params?: Record<string, number>) =>
    api.get(`/pets/${petId}/milestones`, { params }),
  createMilestone: (petId: string, data: Record<string, unknown>) =>
    api.post(`/pets/${petId}/milestones`, data),
}

export const usersApi = {
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  getUserPosts: (userId: string, params?: Record<string, number>) =>
    api.get(`/users/${userId}/posts`, { params }),
  getFollowers: (userId: string, params?: Record<string, number>) =>
    api.get(`/users/${userId}/followers`, { params }),
  getFollowing: (userId: string, params?: Record<string, number>) =>
    api.get(`/users/${userId}/following`, { params }),
  follow: (userId: string) => api.post(`/users/${userId}/follow`),
  unfollow: (userId: string) => api.delete(`/users/${userId}/follow`),
  search: (q: string, limit = 10) => api.get('/users', { params: { q, limit } }),
}

export const notificationsApi = {
  list: () => api.get('/notifications'),
  markRead: () => api.patch('/notifications/read'),
}

export const servicesApi = {
  // Offers
  listOffers: (params?: Record<string, string | number>) =>
    api.get('/services/offers', { params }),
  getOffer: (id: string) => api.get(`/services/offers/${id}`),
  createOffer: (data: Record<string, unknown>) =>
    api.post('/services/offers', data),
  updateOffer: (id: string, data: Record<string, unknown>) =>
    api.put(`/services/offers/${id}`, data),
  deleteOffer: (id: string) => api.delete(`/services/offers/${id}`),
  // Requests
  listRequests: (params?: Record<string, string | number>) =>
    api.get('/services/requests', { params }),
  getRequest: (id: string) => api.get(`/services/requests/${id}`),
  createRequest: (data: Record<string, unknown>) =>
    api.post('/services/requests', data),
  updateRequest: (id: string, data: Record<string, unknown>) =>
    api.put(`/services/requests/${id}`, data),
  deleteRequest: (id: string) => api.delete(`/services/requests/${id}`),
  // Contact
  contactRequest: (id: string, message: string) =>
    api.post(`/services/requests/${id}/contact`, { message }),
  contactOffer: (id: string, message: string) =>
    api.post(`/services/offers/${id}/contact`, { message }),
  // My contacts
  myContacts: (params?: Record<string, number>) =>
    api.get('/services/my-contacts', { params }),
}
