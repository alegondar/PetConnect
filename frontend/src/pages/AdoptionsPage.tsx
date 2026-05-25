import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { communityApi, petsApi } from '../api/endpoints'

export default function AdoptionsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['adoptions', statusFilter],
    queryFn: async () => {
      const params: any = { page: 1, limit: 50 }
      if (statusFilter) params.status = statusFilter
      const res = await communityApi.listAdoptions(params)
      return res.data
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>🏠 Adopciones</h2>
          <p className="text-sm text-text-muted mt-0.5">Dale un hogar a una mascota</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2.5">+ Publicar</button>
      </div>
      <div className="flex gap-2 mb-5">
        {[{ label: 'Todas', value: undefined }, { label: 'Disponibles', value: 'available' }, { label: 'Adoptadas', value: 'adopted' }].map((f) => (
          <button
            key={f.label}
            onClick={() => setStatusFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${statusFilter === f.value || (!statusFilter && !f.value) ? 'badge-pet' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {isLoading && <div className="flex justify-center py-16"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>}
      <div className="space-y-3">
        {data?.items?.map((ad: any, i: number) => (
          <div key={ad.id} className="card-pet p-4 flex gap-3" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {ad.pet?.photo_url ? <img src={ad.pet.photo_url} className="w-full h-full object-cover" alt="" /> : '🐾'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>{ad.pet?.name || 'Mascota'}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${ad.status === 'available' ? 'bg-green-100 text-green-600' : ad.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-600'}`}>
                  {ad.status === 'available' ? 'Disponible' : ad.status === 'pending' ? 'En proceso' : 'Adoptada'}
                </span>
              </div>
              <p className="text-xs text-text-muted">{ad.pet?.species} {ad.pet?.breed && `· ${ad.pet.breed}`}</p>
              {ad.owner && <p className="text-xs">Por @{ad.owner.username}</p>}
              {ad.description && <p className="text-xs text-text-muted mt-1">{ad.description}</p>}
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Publicar en Adopción</h3>
            <AdoptionForm onClose={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['adoptions'] }) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function AdoptionForm({ onClose }: { onClose: () => void }) {
  const [petId, setPetId] = useState('')
  const [desc, setDesc] = useState('')
  const { data: petsData } = useQuery({ queryKey: ['my-pets'], queryFn: async () => { const res = await petsApi.list({ page: 1, limit: 100 }); return res.data } })
  const createMut = useMutation({ mutationFn: () => communityApi.createAdoption({ pet_id: petId, description: desc || undefined }), onSuccess: onClose })

  return (
    <div className="space-y-3">
      <select value={petId} onChange={(e) => setPetId(e.target.value)} className="input-pet w-full">
        <option value="">Selecciona una mascota</option>
        {petsData?.items?.map((p: any) => (<option key={p.id} value={p.id}>{p.name}</option>))}
      </select>
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="¿Por qué buscas adoptante?" className="input-pet w-full resize-none h-24" />
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button onClick={() => petId && createMut.mutate()} disabled={!petId} className="btn-primary disabled:opacity-40">Publicar</button>
      </div>
    </div>
  )
}
