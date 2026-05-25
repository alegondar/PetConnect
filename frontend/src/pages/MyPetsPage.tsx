import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { petsApi } from '../api/endpoints'
import api from '../api/client'
import { useState, useRef } from 'react'

export default function MyPetsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingPet, setEditingPet] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-pets'],
    queryFn: async () => { const res = await petsApi.list({ page: 1, limit: 100 }); return res.data },
  })

  const deleteMut = useMutation({
    mutationFn: (petId: string) => petsApi.delete(petId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-pets'] }),
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>🐶 Mis Mascotas</h2>
          <p className="text-sm text-text-muted mt-0.5">Gestiona tus compañeros peludos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-4 py-2.5">+ Nueva</button>
      </div>
      {isLoading && <div className="flex justify-center py-16"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>}
      <div className="grid grid-cols-2 gap-4">
        {data?.items?.map((pet: any, i: number) => (
          <div key={pet.id} className="card-pet p-3 relative" style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}>
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={(e) => { e.preventDefault(); setMenuOpen(menuOpen === pet.id ? null : pet.id) }}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/15 hover:bg-primary/25 active:scale-95 transition-all text-primary shadow-sm"
                title="Opciones"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="2.5"/>
                  <circle cx="12" cy="12" r="2.5"/>
                  <circle cx="12" cy="19" r="2.5"/>
                </svg>
              </button>
              {menuOpen === pet.id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(null)} />
                  <div className="absolute right-0 top-12 z-30 bg-white rounded-2xl shadow-sm border border-gray-100 py-1 min-w-[140px]">
                    <button
                      onClick={(e) => { e.preventDefault(); setMenuOpen(null); setEditingPet(pet) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-primary/5 flex items-center gap-2 font-medium"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); setMenuOpen(null); if (confirm('¿Eliminar esta mascota?')) deleteMut.mutate(pet.id) }}
                      className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
            <a href={`/pets/${pet.id}`}>
              <div className="w-full h-32 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/20 mb-3 flex items-center justify-center text-5xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {pet.photo_url ? <img src={pet.photo_url} className="w-full h-full object-cover" alt="" /> : '🐾'}
              </div>
              <p className="font-bold text-sm pr-6" style={{ fontFamily: "'Fredoka', sans-serif" }}>{pet.name}</p>
              <p className="text-xs text-text-muted">{pet.species} {pet.breed && `· ${pet.breed}`}</p>
              <p className="text-primary text-xs mt-1 font-semibold">Ver detalle →</p>
            </a>
          </div>
        ))}
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Nueva Mascota</h3>
            <PetFormInline onClose={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['my-pets'] }) }} />
          </div>
        </div>
      )}
      {editingPet && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditingPet(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Editar Mascota</h3>
            <PetFormInline pet={editingPet} onClose={() => { setEditingPet(null); queryClient.invalidateQueries({ queryKey: ['my-pets'] }) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function PetFormInline({ pet, onClose }: { pet?: any; onClose: () => void }) {
  const [name, setName] = useState(pet?.name || '')
  const [species, setSpecies] = useState(pet?.species || '')
  const [breed, setBreed] = useState(pet?.breed || '')
  const [age, setAge] = useState(pet?.age?.toString() || '')
  const [weight, setWeight] = useState(pet?.weight?.toString() || '')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isEditing = !!pet

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const preview = URL.createObjectURL(file)
    setPhotoPreview(preview)
  }

  const createMut = useMutation({
    mutationFn: async () => {
      setError(null)
      let photoUrl = pet?.photo_url || ''
      if (photoFile) {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', photoFile)
        const res = await api.post('/pets/upload-photo', formData)
        photoUrl = res.data.url
      }
      const data = {
        name,
        species,
        breed: breed || undefined,
        age: Number(age) || undefined,
        weight: Number(weight) || undefined,
        photo_url: photoUrl || undefined,
      }
      if (isEditing) {
        return petsApi.update(pet.id, data)
      }
      return petsApi.create(data)
    },
    onSuccess: onClose,
    onError: (err: any) => {
      setUploading(false)
      setError(err?.message || 'Error al guardar la mascota')
    },
  })

  const handleSubmit = () => {
    if (!name || !species) return
    createMut.mutate()
  }

  return (
    <div className="space-y-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre *" className="input-pet w-full" />
      <input value={species} onChange={(e) => setSpecies(e.target.value)} placeholder="Especie * (Perro, Gato...)" className="input-pet w-full" />
      <input value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="Raza (opcional)" className="input-pet w-full" />
      <div className="flex gap-3">
        <input value={age} onChange={(e) => setAge(e.target.value)} type="number" placeholder="Edad (meses)" className="input-pet w-1/2" />
        <input value={weight} onChange={(e) => setWeight(e.target.value)} type="number" step="0.1" placeholder="Peso (kg)" className="input-pet w-1/2" />
      </div>
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {(photoPreview || pet?.photo_url) && !photoPreview ? (
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 flex-shrink-0">
              <img src={pet.photo_url} alt="" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Cambiar foto
            </button>
          </div>
        ) : photoPreview ? (
          <div className="flex items-center gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 flex-shrink-0">
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-primary font-semibold hover:underline"
            >
              Cambiar foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="input-pet w-full text-left text-text-muted flex items-center gap-2 justify-center py-4 border-dashed"
          >
            <span className="text-lg">📷</span>
            <span className="text-sm">Seleccionar foto</span>
          </button>
        )}
      </div>
      {error && (
        <p className="text-danger text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
      )}
      <div className="flex gap-3 justify-end pt-2">
        <button onClick={onClose} className="btn-secondary">Cancelar</button>
        <button
          onClick={handleSubmit}
          disabled={!name || !species || uploading || createMut.isPending}
          className="btn-primary disabled:opacity-40"
        >
          {uploading || createMut.isPending ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </div>
  )
}
