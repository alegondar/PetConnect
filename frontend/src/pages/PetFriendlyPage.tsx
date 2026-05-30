import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { petFriendlyApi } from '../api/endpoints/petFriendly'
import MapLocationPicker from '../components/MapLocationPicker'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const BA_CENTER: [number, number] = [-34.6037, -58.3816]

const CATEGORY_LABELS: Record<string, string> = {
  cafeteria: 'Cafeteria',
  bar_restaurante: 'Bar / Restaurante',
  hotel: 'Hotel',
  experiencia: 'Experiencia',
}

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lng], 15, { duration: 1 })
  }, [map, lat, lng])
  return null
}

function MapView({ places, onMarkerClick }: { places: any[]; onMarkerClick: (place: any) => void }) {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return (
    <>
      {places.map((place: any) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={defaultIcon}
          eventHandlers={{ click: () => onMarkerClick(place) }}
        >
          <Popup>
            <div className="text-sm">
              <p className="font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>{place.nombre}</p>
              <p className="text-gray-500 text-xs">{CATEGORY_LABELS[place.categoria] || place.categoria}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  )
}

export default function PetFriendlyPage() {
  const token = useAuthStore((s) => s.token)
  const navigate = useNavigate()
  const [categoriaFilter, setCategoriaFilter] = useState<string | undefined>()
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState<any>(null)
  const [flyTo, setFlyTo] = useState<{ lat: number; lng: number } | null>(null)

  const handleSelectPlace = useCallback((place: any) => {
    setSelectedPlace(place)
  }, [])

  const handleViewOnMap = useCallback(() => {
    if (selectedPlace) {
      setFlyTo({ lat: selectedPlace.lat, lng: selectedPlace.lng })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [selectedPlace])

  const { data, isLoading } = useQuery({
    queryKey: ['pet-friendly', categoriaFilter],
    queryFn: async () => {
      const params: any = { page: 1, limit: 200 }
      if (categoriaFilter) params.categoria = categoriaFilter
      const res = await petFriendlyApi.listPlaces(params)
      return res.data
    },
  })

  const categories = ['cafeteria', 'bar_restaurante', 'hotel', 'experiencia']

  const filteredItems = (data?.items || []).filter((place: any) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    return (
      place.nombre?.toLowerCase().includes(q) ||
      place.direccion?.toLowerCase().includes(q) ||
      (CATEGORY_LABELS[place.categoria] || place.categoria)?.toLowerCase().includes(q)
    )
  })

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Pet Friendly
        </h2>
        <p className="text-sm text-text-muted mt-0.5">Lugares que aceptan mascotas en Buenos Aires</p>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setCategoriaFilter(undefined)}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${!categoriaFilter ? 'badge-pet' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Todas
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${categoriaFilter === cat ? 'badge-pet' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
            style={{ fontFamily: "'Fredoka', sans-serif" }}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="sticky top-16 z-20 rounded-xl overflow-hidden mb-4 shadow-lg" style={{ height: 220 }}>
        {isLoading ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          </div>
        ) : (
          <MapContainer
            center={BA_CENTER}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapView places={filteredItems} onMarkerClick={handleSelectPlace} />
            {flyTo && <FlyTo lat={flyTo.lat} lng={flyTo.lng} />}
          </MapContainer>
        )}
      </div>

      <div className="relative mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre, barrio o dirección..."
          className="input-pet w-full pl-10 pr-4"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">🔍</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-text-muted font-medium">
          {data?.total || 0} lugares encontrados
        </p>
        <button
          onClick={() => {
            if (!token) { navigate('/login'); return }
            setShowForm(true)
          }}
          className="btn-primary text-sm px-4 py-2"
        >
          + Agregar lugar
        </button>
      </div>

      <div className="space-y-2">
        {filteredItems.map((place: any) => (
          <div
            key={place.id}
            onClick={() => handleSelectPlace(place)}
            className={`card-pet p-3 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md ${selectedPlace?.id === place.id ? 'ring-2 ring-primary' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center text-lg shrink-0">
              {place.categoria === 'cafeteria' ? '☕' :
               place.categoria === 'bar_restaurante' ? '🍽️' :
               place.categoria === 'hotel' ? '🏨' : '⭐'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                {place.nombre}
              </p>
              <p className="text-xs text-text-muted">
                {CATEGORY_LABELS[place.categoria] || place.categoria}
              </p>
              {place.direccion && (
                <p className="text-xs text-text-muted truncate mt-0.5 flex items-center gap-1">
                  📍 {place.direccion}
                </p>
              )}
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${place.verificado ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-text-muted'}`}>
              {place.verificado ? 'Verificado' : place.fuente === 'openstreetmap' ? 'Mapa' : 'Usuario'}
            </span>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-text-muted text-lg font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            No se encontraron lugares
          </p>
        </div>
      )}

      {selectedPlace && (
        <div className="fixed bottom-20 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-[430px] mx-auto px-4 pointer-events-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>
                    {selectedPlace.nombre}
                  </p>
                  <p className="text-xs text-text-muted">
                    {CATEGORY_LABELS[selectedPlace.categoria] || selectedPlace.categoria}
                  </p>
                  {selectedPlace.direccion && (
                    <p className="text-xs text-text-muted mt-0.5">📍 {selectedPlace.direccion}</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs hover:bg-gray-200"
                >
                  ✕
                </button>
              </div>
              {selectedPlace.descripcion && (
                <p className="text-xs text-text-muted mb-3">{selectedPlace.descripcion}</p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={handleViewOnMap}
                  className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  Ver en mapa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <AddPlaceModal onClose={() => setShowForm(false)} />
      )}
    </div>
  )
}

function AddPlaceModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [nombre, setNombre] = useState('')
  const [categoria, setCategoria] = useState('cafeteria')
  const [direccion, setDireccion] = useState('')
  const [lat, setLat] = useState(BA_CENTER[0])
  const [lng, setLng] = useState(BA_CENTER[1])
  const [hasLocation, setHasLocation] = useState(false)
  const [descripcion, setDescripcion] = useState('')

  const createMut = useMutation({
    mutationFn: () => petFriendlyApi.createPlace({
      nombre,
      categoria,
      lat,
      lng,
      direccion: direccion || undefined,
      descripcion: descripcion || undefined,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pet-friendly'] })
      onClose()
    },
  })

  const canSubmit = nombre && hasLocation && !createMut.isPending

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Agregar lugar Pet Friendly</h3>

        <div className="space-y-3">
          <MapLocationPicker
            onLocationChange={(newLat, newLng) => { setLat(newLat); setLng(newLng); setHasLocation(true) }}
            initialLat={lat}
            initialLng={lng}
          />

          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre *" className="input-pet w-full" />
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Dirección (opcional)" className="input-pet w-full" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input-pet w-full">
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción (opcional)" className="input-pet w-full resize-none h-16" />

          {createMut.isError && (
            <p className="text-danger text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              {(createMut.error as Error)?.message || 'Error al guardar'}
            </p>
          )}

          <div className="flex gap-3 justify-end pt-2">
            <button onClick={onClose} className="btn-secondary">Cancelar</button>
            <button onClick={() => createMut.mutate()} disabled={!canSubmit} className="btn-primary disabled:opacity-40">
              {createMut.isPending ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
