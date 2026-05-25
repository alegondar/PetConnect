import { useQuery } from '@tanstack/react-query'
import { instapetApi } from '../api/endpoints'

export default function FollowingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['following'],
    queryFn: async () => { const res = await instapetApi.listFollowing({ page: 1, limit: 50 }); return res.data },
  })

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mascotas que sigo</h2>
      {isLoading && <p className="text-gray-400">Cargando...</p>}
      <div className="space-y-3">
        {data?.items?.map((p: any) => (
          <a key={p.pet_id} href={`/instapet/${p.pet_id}`} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center text-xl">
              {p.pet_photo_url ? <img src={p.pet_photo_url} className="w-12 h-12 rounded-full object-cover" alt="" /> : '🐾'}
            </div>
            <div>
              <p className="font-semibold text-sm">{p.pet_name}</p>
              <p className="text-xs text-gray-400">{p.species}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
