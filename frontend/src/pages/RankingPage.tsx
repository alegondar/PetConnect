import { useQuery } from '@tanstack/react-query'
import { rankingApi } from '../api/endpoints'

export default function RankingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['ranking'],
    queryFn: async () => { const res = await rankingApi.get(20); return res.data },
  })

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-2xl font-bold" style={{ fontFamily: "'Fredoka', sans-serif" }}>🏆 Ranking Semanal</h2>
        <p className="text-sm text-text-muted mt-0.5">Las mascotas más queridas de la semana</p>
      </div>
      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        </div>
      )}
      <div className="space-y-3">
        {data?.items?.map((entry: any, i: number) => (
          <a
            key={entry.pet_id}
            href={`/instapet/${entry.pet_id}`}
            className="card-pet flex items-center gap-4 p-4"
            style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.5s ease forwards', opacity: 0 }}
          >
            <div className={`text-2xl font-bold min-w-[2.5rem] text-center ${entry.rank <= 3 ? 'text-accent' : 'text-text-muted'}`} style={{ fontFamily: "'Fredoka', sans-serif" }}>
              {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : `#${entry.rank}`}
            </div>
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/15 to-secondary/20 flex items-center justify-center text-xl overflow-hidden shadow-inner">
              {entry.pet_photo_url ? (
                <img src={entry.pet_photo_url} className="w-12 h-12 object-cover" alt="" />
              ) : (
                <span className="text-2xl">🐾</span>
              )}
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ fontFamily: "'Fredoka', sans-serif" }}>{entry.pet_name}</p>
              <p className="text-xs text-text-muted">@{entry.owner_username}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-accent text-lg" style={{ fontFamily: "'Fredoka', sans-serif" }}>{entry.likes_this_week}</p>
              <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">likes</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
