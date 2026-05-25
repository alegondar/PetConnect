import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi } from '../api/endpoints'
import { useState } from 'react'

export default function LostPetsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>()
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['lost-pets', statusFilter],
    queryFn: async () => {
      const params: any = { page: 1, limit: 50 }
      if (statusFilter) params.status = statusFilter
      const res = await communityApi.listLostPets(params)
      return res.data
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>🔍 Mascotas Perdidas</h2>
          <p className="text-sm text-text-muted mt-0.5">Ayuda a encontrarlas</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2.5">+ Reportar</button>
      </div>
      <div className="flex gap-2 mb-5">
        {[{ label: 'Todas', value: undefined }, { label: 'Perdidas', value: 'lost' }, { label: 'Encontradas', value: 'found' }].map((f) => (
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
        {data?.items?.map((lp: any, i: number) => (
          <div key={lp.id} className="card-pet p-4 flex gap-3" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
              {lp.photo_url ? <img src={lp.photo_url} className="w-full h-full object-cover" alt="" /> : '🔍'}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>{lp.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${lp.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {lp.status === 'lost' ? 'Perdido' : 'Encontrado'}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">{lp.species} {lp.breed && `· ${lp.breed}`}</p>
              {lp.last_seen_address && <p className="text-xs mt-1">📍 {lp.last_seen_address}</p>}
            </div>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Reportar Mascota Perdida</h3>
            <LostPetForm onClose={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['lost-pets'] }) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function LostPetForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [address, setAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const createMut = useMutation({
    mutationFn: () => communityApi.createLostPet({ name, species, last_seen_lat: Number(lat), last_seen_lng: Number(lng), last_seen_address: address || undefined, description: desc || undefined, photo_url: photoUrl || undefined }),
    onSuccess: onClose,
  })

  return (
    <div className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *" className="input-pet w-full" />
      <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Especie *" className="input-pet w-full" />
      <div className="flex gap-3">
        <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitud *" type="number" step="any" className="input-pet w-1/2" />
        <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitud *" type="number" step="any" className="input-pet w-1/2" />
      </div>
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Última ubicación" className="input-pet w-full" />
      <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="URL de foto" className="input-pet w-full" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción" className="input-pet w-full resize-none h-20" />
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button onClick={() => name && species && lat && lng && createMut.mutate()} disabled={!name || !species || !lat || !lng} className="btn-primary disabled:opacity-40">Reportar</button>
      </div>
    </div>
  )
}
