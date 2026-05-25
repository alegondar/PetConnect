import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { instapetApi, petsApi } from '../api/endpoints'
import { useState } from 'react'

export default function InstaPetPage() {
  const { petId } = useParams<{ petId: string }>()
  const queryClient = useQueryClient()

  const { data: pet } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => { const res = await petsApi.get(petId!); return res.data },
    enabled: !!petId,
  })

  const { data: posts } = useQuery({
    queryKey: ['instapet-posts', petId],
    queryFn: async () => { const res = await instapetApi.listPosts(petId!, { page: 1, limit: 50 }); return res.data },
    enabled: !!petId,
  })

  const { data: followers } = useQuery({
    queryKey: ['followers', petId],
    queryFn: async () => { const res = await instapetApi.listFollowers(petId!, { page: 1, limit: 1 }); return res.data },
    enabled: !!petId,
  })

  const { data: milestones } = useQuery({
    queryKey: ['milestones', petId],
    queryFn: async () => { const res = await instapetApi.listMilestones(petId!, { page: 1, limit: 50 }); return res.data },
    enabled: !!petId,
  })

  const followMut = useMutation({
    mutationFn: () => instapetApi.follow(petId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['followers', petId] }),
  })

  const [showPost, setShowPost] = useState(false)
  const [showMilestone, setShowMilestone] = useState(false)

  if (!pet) return (
    <div className="flex justify-center py-16"><div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" /></div>
  )

  return (
    <div>
      <div className="card-pet p-6 mb-6 text-center">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 to-secondary/30 mx-auto mb-4 flex items-center justify-center text-6xl shadow-lg shadow-primary/10 overflow-hidden">
          {pet.photo_url ? <img src={pet.photo_url} className="w-full h-full object-cover" alt="" /> : '🐾'}
        </div>
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>{pet.name}</h2>
        <p className="text-text-muted text-sm">{pet.species} {pet.breed && `· ${pet.breed}`}</p>
        <p className="text-sm mt-1 font-semibold" style={{ fontFamily: "'Fredoka', sans-serif" }}>
          {followers?.total || 0} seguidores
        </p>
        <button onClick={() => followMut.mutate()} className="btn-primary mt-3 text-sm px-8">
          + Seguir
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>📸 Posts</h3>
        <button onClick={() => setShowPost(true)} className="text-primary font-bold text-sm">+ Post</button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {posts?.items?.map((p: any) => (
          <div key={p.id} className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden hover:scale-105 transition-transform duration-200">
            {p.photo_url ? <img src={p.photo_url} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>⭐ Hitos</h3>
        <button onClick={() => setShowMilestone(true)} className="text-primary font-bold text-sm">+ Hito</button>
      </div>
      <div className="space-y-3">
        {milestones?.items?.map((m: any) => (
          <div key={m.id} className="card-pet p-4 flex items-start gap-3">
            <div className="text-2xl">⭐</div>
            <div>
              <p className="font-bold text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>{m.title}</p>
              <p className="text-xs text-text-muted">{m.milestone_date}</p>
              {m.description && <p className="text-xs mt-1">{m.description}</p>}
            </div>
          </div>
        ))}
      </div>

      {showPost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowPost(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Nuevo Post InstaPet</h3>
            <InstaPostForm petId={petId!} onClose={() => { setShowPost(false); queryClient.invalidateQueries({ queryKey: ['instapet-posts', petId] }) }} />
          </div>
        </div>
      )}

      {showMilestone && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowMilestone(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Nuevo Hito</h3>
            <MilestoneForm petId={petId!} onClose={() => { setShowMilestone(false); queryClient.invalidateQueries({ queryKey: ['milestones', petId] }) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function InstaPostForm({ petId, onClose }: { petId: string; onClose: () => void }) {
  const [photoUrl, setPhotoUrl] = useState('')
  const [desc, setDesc] = useState('')
  const createMut = useMutation({ mutationFn: () => instapetApi.createPost(petId, { photo_url: photoUrl || undefined, description: desc || undefined }), onSuccess: onClose })
  return (
    <div className="space-y-3">
      <input value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} placeholder="URL de la foto" className="input-pet w-full" />
      <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción" className="input-pet w-full resize-none h-20" />
      <div className="flex gap-3 justify-end"><button onClick={onClose} className="btn-secondary">Cancelar</button><button onClick={() => createMut.mutate()} className="btn-primary">Publicar</button></div>
    </div>
  )
}

function MilestoneForm({ petId, onClose }: { petId: string; onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [desc, setDesc] = useState('')
  const createMut = useMutation({ mutationFn: () => instapetApi.createMilestone(petId, { title, milestone_date: date, description: desc || undefined }), onSuccess: onClose })
  return (
    <div className="space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título *" className="input-pet w-full" />
      <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="input-pet w-full" />
      <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción" className="input-pet w-full" />
      <div className="flex gap-3 justify-end"><button onClick={onClose} className="btn-secondary">Cancelar</button><button onClick={() => title && date && createMut.mutate()} disabled={!title || !date} className="btn-primary disabled:opacity-40">Guardar</button></div>
    </div>
  )
}
