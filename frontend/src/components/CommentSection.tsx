import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { feedApi } from '../api/endpoints'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'
import LoginPromptModal from './LoginPromptModal'

export default function CommentSection({ postId }: { postId: string }) {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.token)
  const [text, setText] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => { const res = await feedApi.listComments(postId, { page: 1, limit: 50 }); return res.data },
  })

  const createMut = useMutation({
    mutationFn: () => feedApi.createComment(postId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      queryClient.invalidateQueries({ queryKey: ['feed'] })
      setText('')
    },
    onError: () => {
      alert('Error al publicar comentario')
    },
  })

  const handleSubmit = () => {
    if (!text) return
    if (!token) {
      setShowLoginModal(true)
      return
    }
    createMut.mutate()
  }

  return (
    <div>
      <div className="space-y-2.5 max-h-56 overflow-y-auto mb-3">
        {isLoading && <p className="text-xs text-text-muted">Cargando...</p>}
        {data?.items?.map((c: any) => (
          <div key={c.id} className="text-sm flex gap-2">
            <span className="font-bold text-primary-dark shrink-0" style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {c.author?.username}:
            </span>
            <span className="text-text/80">{c.content}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Comenta algo..."
          className="flex-1 input-pet py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={!text}
          className="btn-primary text-xs px-4 py-2 disabled:opacity-40 disabled:shadow-none"
        >
          Enviar
        </button>
      </div>

      <LoginPromptModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        action="comentar"
      />
    </div>
  )
}
