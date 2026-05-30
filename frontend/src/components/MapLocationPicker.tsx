import { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import L from 'leaflet'

const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const DEFAULT_CENTER: [number, number] = [-34.6037, -58.3816]
const DEFAULT_ZOOM = 13

function FlyToWhenReady({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  map.flyTo([lat, lng], 16, { duration: 0.8 })
  return null
}

function InvalidateSize() {
  const map = useMap()
  const done = useRef(false)
  if (!done.current) {
    done.current = true
    setTimeout(() => map.invalidateSize(), 120)
  }
  return null
}

function DraggableMarker({
  position,
  onMove,
}: {
  position: [number, number]
  onMove: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng)
    },
    dragend(e) {
      const marker = e.target as L.Marker
      const { lat, lng } = marker.getLatLng()
      onMove(lat, lng)
    },
  })

  return (
    <Marker
      position={position}
      draggable
      icon={defaultIcon}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target as L.Marker
          const { lat, lng } = marker.getLatLng()
          onMove(lat, lng)
        },
      }}
    />
  )
}

interface MapLocationPickerProps {
  onLocationChange: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
  readOnly?: boolean
}

export default function MapLocationPicker({
  onLocationChange,
  initialLat,
  initialLng,
  readOnly = false,
}: MapLocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialLat && initialLng ? [initialLat, initialLng] : DEFAULT_CENTER
  )
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null)
  const [searchText, setSearchText] = useState('')
  const [searching, setSearching] = useState(false)

  const handleMove = (lat: number, lng: number) => {
    setPosition([lat, lng])
    onLocationChange(lat, lng)
  }

  const handleSearch = async () => {
    const query = searchText.trim()
    if (!query) return
    setSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`
      )
      const results = await res.json()
      if (results.length > 0) {
        const lat = parseFloat(results[0].lat)
        const lng = parseFloat(results[0].lon)
        setPosition([lat, lng])
        onLocationChange(lat, lng)
        setFlyTarget([lat, lng])
      }
    } catch {
      // ignore geocoding errors
    } finally {
      setSearching(false)
    }
  }

  return (
    <div>
      {!readOnly && (
        <div className="flex gap-2 mb-2">
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar ciudad o dirección..."
            className="input-pet flex-1 text-sm"
          />
          <button
            onClick={handleSearch}
            disabled={searching || !searchText.trim()}
            className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 disabled:opacity-40 transition-colors shrink-0"
          >
            {searching ? '...' : '🔍'}
          </button>
        </div>
      )}
      <div className="rounded-xl overflow-hidden" style={{ height: 200 }}>
        <MapContainer
          center={position}
          zoom={readOnly ? 15 : DEFAULT_ZOOM}
          style={{ height: '100%', width: '100%' }}
          key={`${position[0]}-${position[1]}`}
          scrollWheelZoom={!readOnly}
          attributionControl={false}
          dragging={!readOnly}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <DraggableMarker position={position} onMove={handleMove} />
          {flyTarget && <FlyToWhenReady lat={flyTarget[0]} lng={flyTarget[1]} />}
          <InvalidateSize />
        </MapContainer>
      </div>
      <p className="text-xs text-text-muted mt-1.5 text-center">
        {position[0].toFixed(4)}, {position[1].toFixed(4)}
      </p>
    </div>
  )
}
