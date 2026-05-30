import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { communityApi, petsApi } from '../api/endpoints'
import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import MapLocationPicker from '../components/MapLocationPicker'
import LostPetPoster, { type LostPetPosterData } from '../components/LostPetPoster'
import html2canvas from 'html2canvas'

export default function LostPetsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>()
  const [showForm, setShowForm] = useState(false)
  const [showPosterModal, setShowPosterModal] = useState(false)

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
      <div className="flex gap-2 mb-5 flex-wrap">
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
        <button
          onClick={() => setShowPosterModal(true)}
          className="px-4 py-1.5 rounded-full text-sm font-bold transition-all bg-red-500 text-white hover:bg-red-600"
          style={{ fontFamily: "'Fredoka', sans-serif" }}
        >
          Generar Cartel
        </button>
      </div>
      {isLoading && <div className="flex justify-center py-16"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>}
      <div className="space-y-3">
        {data?.items?.map((lp: any, i: number) => (
          <Link key={lp.id} to={`/lost-pets/${lp.id}`} className="card-pet p-4 flex gap-3" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
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
          </Link>
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
      {showPosterModal && (
        <PosterGeneratorModal
          lostPets={data?.items || []}
          onClose={() => setShowPosterModal(false)}
        />
      )}
    </div>
  )
}

function LostPetForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [lat, setLat] = useState(-34.6037)
  const [lng, setLng] = useState(-58.3816)
  const [hasLocation, setHasLocation] = useState(false)
  const [address, setAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLocationChange = (newLat: number, newLng: number) => {
    setLat(newLat)
    setLng(newLng)
    setHasLocation(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
    setUploadError(null)
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const createMut = useMutation({
    mutationFn: async () => {
      setUploadError(null)
      let photoUrl: string | undefined
      if (photoFile) {
        try {
          const res = await petsApi.uploadPhoto(photoFile)
          photoUrl = res.data.url
        } catch {
          throw new Error('Error al subir la foto')
        }
      }
      return communityApi.createLostPet({
        name,
        species,
        last_seen_lat: lat,
        last_seen_lng: lng,
        last_seen_address: address || undefined,
        description: desc || undefined,
        photo_url: photoUrl || undefined,
      })
    },
    onSuccess: onClose,
    onError: (err: Error) => {
      setUploadError(err?.message || 'Error al guardar el reporte')
    },
  })

  const canSubmit = name && species && hasLocation && !createMut.isPending

  return (
    <div className="space-y-3">
      <MapLocationPicker onLocationChange={handleLocationChange} initialLat={lat} initialLng={lng} />

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *" className="input-pet w-full" />
      <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Especie *" className="input-pet w-full" />
      <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Dirección de referencia" className="input-pet w-full" />

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {photoPreview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-black/70"
            >
              ✕
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-1 text-text-muted hover:border-primary hover:text-primary transition-colors text-sm"
          >
            <span className="text-lg">📷</span>
            <span>Seleccionar foto</span>
          </button>
        )}
      </div>

      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción" className="input-pet w-full resize-none h-20" />

      {uploadError && (
        <p className="text-danger text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{uploadError}</p>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button
          onClick={() => createMut.mutate()}
          disabled={!canSubmit}
          className="btn-primary disabled:opacity-40"
        >
          {createMut.isPending ? (photoFile ? 'Subiendo...' : 'Guardando...') : 'Reportar'}
        </button>
      </div>
    </div>
  )
}

function PosterGeneratorModal({
  lostPets,
  onClose,
}: {
  lostPets: any[]
  onClose: () => void
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [breed, setBreed] = useState('')
  const [address, setAddress] = useState('')
  const [desc, setDesc] = useState('')
  const [phone, setPhone] = useState('')
  const [generated, setGenerated] = useState(false)
  const posterRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectPet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    if (!id) return
    const lp = lostPets.find((p: any) => p.id === id)
    if (!lp) return
    setName(lp.name || '')
    setSpecies(lp.species || '')
    setBreed(lp.breed || '')
    setAddress(lp.last_seen_address || '')
    setDesc(lp.description || '')
    setPhotoPreview(lp.photo_url || null)
    setGenerated(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoPreview(URL.createObjectURL(file))
    setGenerated(false)
  }

  const handleGenerate = () => {
    if (!name || !species) return
    setGenerated(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = useCallback(async () => {
    if (!posterRef.current) return
    const canvas = await html2canvas(posterRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    })
    const link = document.createElement('a')
    link.download = `cartel-${name || 'mascota'}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [name])

  const posterData: LostPetPosterData = {
    photoUrl: photoPreview,
    name,
    species,
    breed: breed || undefined,
    lastSeenAddress: address || undefined,
    description: desc || undefined,
    phone: phone || undefined,
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl my-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          Generar Cartel de Busqueda
        </h3>

        {!generated ? (
          <div className="space-y-3">
            {lostPets.length > 0 && (
              <select
                onChange={handleSelectPet}
                defaultValue=""
                className="input-pet w-full text-sm"
              >
                <option value="">Seleccionar reporte existente...</option>
                {lostPets.map((lp: any) => (
                  <option key={lp.id} value={lp.id}>
                    {lp.name} ({lp.species})
                  </option>
                ))}
              </select>
            )}

            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *" className="input-pet w-full" />
            <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Especie *" className="input-pet w-full" />
            <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Raza" className="input-pet w-full" />
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ubicacion" className="input-pet w-full" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefono / WhatsApp" className="input-pet w-full" />
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripcion" className="input-pet w-full resize-none h-16" />

            <div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              {photoPreview ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={photoPreview} alt="Preview" className="w-full h-32 object-cover" />
                  <button
                    onClick={() => { setPhotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-4 flex flex-col items-center gap-1 text-text-muted hover:border-red-500 hover:text-red-500 transition-colors text-sm"
                >
                  <span className="text-lg">📷</span>
                  <span>Subir foto de la mascota</span>
                </button>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={onClose} className="btn-secondary">Cancelar</button>
              <button
                onClick={handleGenerate}
                disabled={!name || !species}
                className="btn-primary disabled:opacity-40"
              >
                Generar
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <LostPetPoster ref={posterRef} {...posterData} />
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button onClick={handlePrint} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors">
                Imprimir
              </button>
              <button onClick={handleDownload} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition-colors">
                Descargar imagen
              </button>
              <button onClick={() => setGenerated(false)} className="btn-secondary text-sm">
                Editar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
