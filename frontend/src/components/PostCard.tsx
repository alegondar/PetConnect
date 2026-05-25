import { useMutation, useQueryClient } from '@tanstack/react-query'
import { feedApi, petsApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import { useState, useRef } from 'react'
import CommentSection from './CommentSection'

export default function PostCard({ post, index = 0 }: { post: any; index?: number }) {
  const queryClient = useQueryClient()
  const profile = useAuthStore((s) => s.profile)
  const isAuthor = profile?.id === post.author_id

  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes_count)
  const [showMenu, setShowMenu] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content || '')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const likeMut = useMutation({
    mutationFn: () => (liked ? feedApi.unlike(post.id) : feedApi.like(post.id)),
    onMutate: () => {
      setLiked(!liked)
      setLikes((prev: number) => (liked ? prev - 1 : prev + 1))
    },
    onError: () => {
      setLiked(liked)
      setLikes(post.likes_count)
    },
  })

  const deleteMut = useMutation({
    mutationFn: () => feedApi.delete(post.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feed'] }),
  })

  const updateMut = useMutation({
    mutationFn: async () => {
      let photo_url: string | undefined
      if (selectedFile) {
        setUploading(true)
        const res = await petsApi.uploadPhoto(selectedFile)
        photo_url = res.data.url
        setUploading(false)
      }
      return feedApi.update(post.id, { content: editContent, photo_url })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      setEditing(false)
      setSelectedFile(null)
      setPreviewUrl(null)
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const pet = post.pet
  const petInitial = pet?.name?.charAt(0).toUpperCase() || '?'

  return (
    <div
      className="card-pet p-4 relative"
      style={{
        animationDelay: `${index * 0.08}s`,
        animation: 'fadeInUp 0.5s ease forwards',
        opacity: 0,
      }}
    >
      {isAuthor && (
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/15 hover:bg-primary/25 active:scale-95 transition-all text-primary shadow-sm"
            title="Opciones"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2.5"/>
              <circle cx="12" cy="12" r="2.5"/>
              <circle cx="12" cy="19" r="2.5"/>
            </svg>
          </button>
          {showMenu && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 z-30 bg-white rounded-2xl shadow-sm border border-gray-100 py-1 min-w-[140px]">
                <button
                  onClick={() => { setShowMenu(false); setEditing(true); setEditContent(post.content || '') }}
                  className="w-full text-left px-4 py-2.5 text-sm text-text hover:bg-primary/5 flex items-center gap-2 font-medium"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => { setShowMenu(false); deleteMut.mutate() }}
                  className="w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-red-50 flex items-center gap-2 font-medium"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 mb-3 pr-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-secondary/20 flex items-center justify-center overflow-hidden shadow-inner">
          {pet?.photo_url ? (
            <img src={pet.photo_url} alt={pet.name} className="w-10 h-10 object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">{petInitial}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-text" style={{ fontFamily: "'Fredoka', sans-serif" }}>
            {pet?.name || 'Mascota'}
          </p>
          {pet?.breed && (
            <p className="text-xs text-text-muted">{pet.breed}</p>
          )}
        </div>
        <span className="text-xs text-text-muted">
          {new Date(post.created_at).toLocaleDateString('es', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {post.photo_url && (
        <div className="rounded-xl overflow-hidden mb-3">
          <img
            src={post.photo_url}
            alt=""
            className="w-full object-cover max-h-96"
          />
        </div>
      )}

      {!post.photo_url && (
        <div className="w-full bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl flex items-center justify-center mb-3" style={{ height: '200px' }}>
          <span className="text-6xl opacity-25">🐾</span>
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={() => likeMut.mutate()}
          className="text-lg transition-transform hover:scale-110 active:scale-90"
        >
          {liked ? '❤️' : '🤍'}
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-lg transition-transform hover:scale-110"
        >
          💬
        </button>
        <span className="text-sm font-semibold text-text-muted ml-1">
          {likes} {likes === 1 ? 'like' : 'likes'}
        </span>
      </div>

      {post.content && (
        <p className="text-sm text-text mt-2">
          <span className="font-bold">{pet?.name || 'Mascota'}</span>{' '}
          {post.content}
        </p>
      )}

      {showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSection postId={post.id} />
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4" style={{ fontFamily: "'Fredoka', sans-serif" }}>Editar post</h3>

            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="input-pet w-full resize-none h-24 mb-3"
              placeholder="¿Qué está haciendo tu mascota?"
            />

            <div className="mb-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative rounded-xl overflow-hidden mb-2">
                  <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center gap-1 text-text-muted hover:border-primary hover:text-primary transition-colors text-sm"
                >
                  📷 Cambiar foto
                </button>
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => { setEditing(false); setSelectedFile(null); setPreviewUrl(null) }} className="btn-secondary text-sm">
                Cancelar
              </button>
              <button
                onClick={() => updateMut.mutate()}
                disabled={updateMut.isPending}
                className="btn-primary text-sm disabled:opacity-40"
              >
                {updateMut.isPending ? (uploading ? 'Subiendo...' : 'Guardando...') : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
