import { forwardRef } from 'react'

export interface LostPetPosterData {
  photoUrl: string | null
  name: string
  species: string
  breed?: string
  lastSeenAddress?: string
  description?: string
  phone?: string
}

const LostPetPoster = forwardRef<HTMLDivElement, LostPetPosterData>(function LostPetPoster(
  { photoUrl, name, species, breed, lastSeenAddress, description, phone },
  ref
) {
  return (
    <div
      ref={ref}
      className="bg-white"
      style={{ width: 400, fontFamily: "'Fredoka', sans-serif" }}
    >
      <div className="bg-red-600 text-white text-center py-4">
        <h1 className="text-5xl font-extrabold tracking-widest uppercase m-0" style={{ letterSpacing: '0.3em' }}>
          Se Busca
        </h1>
      </div>

      <div className="border-x-4 border-b-4 border-red-600">
        {photoUrl ? (
          <div className="w-full" style={{ height: 320 }}>
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="w-full bg-gray-100 flex items-center justify-center" style={{ height: 320 }}>
            <span className="text-7xl opacity-30">🐾</span>
          </div>
        )}

        <div className="p-5">
          <h2 className="text-2xl font-bold text-red-600 mb-2 text-center uppercase tracking-wide">
            {name}
          </h2>

          <div className="space-y-1.5 text-sm text-gray-700 text-center mb-4">
            <p>
              <span className="font-semibold">Especie:</span> {species}
              {breed ? ` — ${breed}` : ''}
            </p>
            {lastSeenAddress && (
              <p>
                <span className="font-semibold">Visto por ultima vez en:</span> {lastSeenAddress}
              </p>
            )}
            {description && (
              <p className="italic text-gray-500 mt-2 px-2">{description}</p>
            )}
            {phone && (
              <p className="font-bold text-lg text-red-600 mt-2">
                {phone}
              </p>
            )}
          </div>

          {phone && (
            <div className="border-t-2 border-dashed border-gray-300 pt-3">
              <div className="flex justify-between gap-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="text-center flex-1 border-r border-dashed border-gray-300 last:border-r-0">
                    <p className="text-[8px] text-gray-600 font-bold leading-tight">{phone}</p>
                    <p className="text-[7px] text-gray-400 leading-tight">✂</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-red-600 text-white text-center py-4">
          <p className="text-xl font-extrabold tracking-widest uppercase" style={{ letterSpacing: '0.2em' }}>
            Si lo ves, llama ya
          </p>
        </div>
      </div>
    </div>
  )
})

export default LostPetPoster
