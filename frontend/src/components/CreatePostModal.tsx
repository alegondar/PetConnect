import { useState, useRef } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { feedApi, petsApi } from '../api/endpoints'

export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [petId, setPetId] = useState('')
  const [content, setContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: petsData } = useQuery({
    queryKey: ['my-pets'],
    queryFn: async () => { const res = await petsApi.list({ page: 1, limit: 100 }); return res.data },
  })

  const createMut = useMutation({
    mutationFn: async () => {
      setError(null)
      let photo_url: string | undefined

      if (selectedFile) {
        setUploading(true)
        try {
          const uploadRes = await petsApi.uploadPhoto(selectedFile)
          photo_url = uploadRes.data.url
        } catch {
          setError('Error al subir la foto. Intentá de nuevo.')
          setUploading(false)
          throw new Error('Upload failed')
        }
        setUploading(false)
      }

      return feedApi.create({ pet_id: petId, content, photo_url })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['feed'] }); onClose() },
    onError: () => {
      if (!error) setError('Error al publicar. Intentá de nuevo.')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl shadow-primary/10 border border-primary/10 animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-5" style={{ fontFamily: "'Fredoka', sans-serif" }}>🐾 Nuevo Post</h3>

        <select
          value={petId}
          onChange={(e) => setPetId(e.target.value)}
          className="input-pet w-full mb-3"
        >
          <option value="">Selecciona una mascota</option>
          {petsData?.items?.map((p: any) => (
            <option key={p.id} value={p.id}>{p.name} ({p.species})</option>
          ))}
        </select>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué está haciendo tu mascota?"
          className="input-pet w-full resize-none h-24 mb-3"
        />

        <div className="mb-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative rounded-xl overflow-hidden mb-2">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover" />
              <button
                onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-black/70"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl py-8 px-4 flex flex-col items-center gap-2 text-text-muted hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span className="text-sm font-medium">Agregar foto</span>
            </button>
          )}
        </div>

        {error && (
          <p className="text-danger text-sm mb-3 text-center">{error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button
            onClick={() => petId && createMut.mutate()}
            disabled={!petId || createMut.isPending}
            className="btn-primary disabled:opacity-40 disabled:shadow-none"
          >
            {createMut.isPending ? (uploading ? 'Subiendo...' : 'Publicando...') : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  )
}
