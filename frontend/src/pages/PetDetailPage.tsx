import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { petsApi } from '../api/endpoints'
import { useState } from 'react'

export default function PetDetailPage() {
  const { petId } = useParams<{ petId: string }>()
  const queryClient = useQueryClient()

  const { data: pet } = useQuery({
    queryKey: ['pet', petId],
    queryFn: async () => { const res = await petsApi.get(petId!); return res.data },
    enabled: !!petId,
  })

  const { data: visits } = useQuery({
    queryKey: ['vet-visits', petId],
    queryFn: async () => { const res = await petsApi.listVetVisits(petId!, { page: 1, limit: 50 }); return res.data },
    enabled: !!petId,
  })

  const { data: events } = useQuery({
    queryKey: ['pet-events', petId],
    queryFn: async () => { const res = await petsApi.listEvents(petId!, { page: 1, limit: 50 }); return res.data },
    enabled: !!petId,
  })

  if (!pet) return <p className="text-gray-400">Cargando mascota...</p>

  return (
    <div>
      <a href="/my-pets" className="text-primary text-sm mb-4 block">← Volver</a>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center text-4xl">
            {pet.photo_url ? <img src={pet.photo_url} className="w-20 h-20 rounded-full object-cover" alt="" /> : '🐾'}
          </div>
          <div>
            <h2 className="text-xl font-bold">{pet.name}</h2>
            <p className="text-sm text-gray-500">{pet.species} {pet.breed && `· ${pet.breed}`}</p>
            {pet.age && <p className="text-sm text-gray-400">{pet.age} meses · {pet.weight}kg</p>}
          </div>
        </div>
      </div>

      <Section title="Visitas al Veterinario" items={visits?.items} addLabel="+ Visita">
        {(_showForm, setShowForm) => (
          <VetVisitForm petId={petId!} onClose={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['vet-visits', petId] }) }} />
        )}
        {(item: any) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
            <p className="font-semibold text-sm">{item.vet_name}</p>
            <p className="text-xs text-gray-400">{item.visit_date} — {item.reason}</p>
            {item.notes && <p className="text-xs text-gray-500 mt-1">{item.notes}</p>}
          </div>
        )}
      </Section>

      <Section title="Health Tracking" items={events?.items} addLabel="+ Evento">
        {(_showForm, setShowForm) => (
          <EventForm petId={petId!} onClose={() => { setShowForm(false); queryClient.invalidateQueries({ queryKey: ['pet-events', petId] }) }} />
        )}
        {(item: any) => (
          <div key={item.id} className="p-3 bg-gray-50 rounded-xl">
            <p className="font-semibold text-sm capitalize">{item.event_type}</p>
            <p className="text-xs text-gray-400">{item.event_date} {item.value && `· ${item.value}`}</p>
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({ title, items, addLabel, children }: { title: string; items: any[]; addLabel: string; children: [(show: boolean, set: (v: boolean) => void) => React.ReactNode, (item: any) => React.ReactNode] }) {
  const [showForm, setShowForm] = useState(false)
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">{title}</h3>
        <button onClick={() => setShowForm(true)} className="text-primary text-sm">{addLabel}</button>
      </div>
      <div className="space-y-2">{items?.map((item: any) => children[1](item))}</div>
      {showForm && children[0](showForm, setShowForm)}
    </div>
  )
}

function VetVisitForm({ petId, onClose }: { petId: string; onClose: () => void }) {
  const [vetName, setVetName] = useState('')
  const [date, setDate] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')

  const createMut = useMutation({
    mutationFn: () => petsApi.createVetVisit(petId, { vet_name: vetName, visit_date: date, reason, notes: notes || undefined }),
    onSuccess: onClose,
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold mb-4">Nueva Visita</h3>
        <div className="space-y-3">
          <input value={vetName} onChange={(e) => setVetName(e.target.value)} placeholder="Veterinario/a *" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo *" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notas" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500">Cancelar</button>
          <button onClick={() => vetName && date && reason && createMut.mutate()} disabled={!vetName || !date || !reason} className="bg-primary text-white rounded-xl px-6 py-2 text-sm font-semibold disabled:opacity-50">Guardar</button>
        </div>
      </div>
    </div>
  )
}

function EventForm({ petId, onClose }: { petId: string; onClose: () => void }) {
  const [type, setType] = useState('vaccination')
  const [date, setDate] = useState('')
  const [value, setValue] = useState('')

  const createMut = useMutation({
    mutationFn: () => petsApi.createEvent(petId, { event_type: type, event_date: date, value: value || undefined }),
    onSuccess: onClose,
  })

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold mb-4">Nuevo Evento</h3>
        <div className="space-y-3">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary">
            <option value="vaccination">Vacuna</option>
            <option value="weight">Peso</option>
            <option value="deworming">Desparasitación</option>
            <option value="medication">Medicamento</option>
            <option value="other">Otro</option>
          </select>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Valor (ej: Rabia, 25.5kg)" className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex gap-3 justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500">Cancelar</button>
          <button onClick={() => date && createMut.mutate()} disabled={!date} className="bg-primary text-white rounded-xl px-6 py-2 text-sm font-semibold disabled:opacity-50">Guardar</button>
        </div>
      </div>
    </div>
  )
}
