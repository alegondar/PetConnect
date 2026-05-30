import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { communityApi } from '../api/endpoints'
import MapLocationPicker from '../components/MapLocationPicker'

export default function LostPetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['lost-pet', id],
    queryFn: async () => {
      const res = await communityApi.getLostPet(id!)
      return res.data
    },
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
      </div>
    )
  }

  const lp = data

  if (!lp) {
    return (
      <div className="text-center py-16">
        <p className="text-text-muted text-lg font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Reporte no encontrado
        </p>
      </div>
    )
  }

  return (
    <div className="pb-6">
      <button
        onClick={() => navigate('/lost-pets')}
        className="text-sm text-primary font-semibold mb-4 flex items-center gap-1 hover:underline"
      >
        ← Volver a Perdidos
      </button>

      {lp.photo_url && (
        <div className="rounded-xl overflow-hidden mb-4">
          <img src={lp.photo_url} alt={lp.name} className="w-full object-cover max-h-80" />
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {lp.name}
        </h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${lp.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {lp.status === 'lost' ? 'Perdido' : 'Encontrado'}
        </span>
      </div>

      <p className="text-sm text-text-muted mb-4">
        {lp.species}{lp.breed ? ` · ${lp.breed}` : ''}
      </p>

      {lp.description && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-text mb-1">Descripcion</h3>
          <p className="text-sm text-text-muted">{lp.description}</p>
        </div>
      )}

      {lp.last_seen_lat && lp.last_seen_lng && (
        <div className="mb-4">
          <h3 className="text-sm font-bold text-text mb-2">Ultima ubicacion</h3>
          <MapLocationPicker
            onLocationChange={() => {}}
            initialLat={lp.last_seen_lat}
            initialLng={lp.last_seen_lng}
            readOnly
          />
          {lp.last_seen_address && (
            <p className="text-sm text-text-muted mt-2">{lp.last_seen_address}</p>
          )}
        </div>
      )}

      <p className="text-xs text-text-muted mt-4">
        Reportado el {new Date(lp.created_at).toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
    </div>
  )
}
