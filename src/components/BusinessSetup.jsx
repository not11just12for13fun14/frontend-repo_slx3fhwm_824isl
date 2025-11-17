import { useState } from 'react'

export default function BusinessSetup({ onCreated }) {
  const [name, setName] = useState('My Small Business')
  const [description, setDescription] = useState('We provide awesome services')
  const [openHour, setOpenHour] = useState(9)
  const [closeHour, setCloseHour] = useState(17)
  const [slotMinutes, setSlotMinutes] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/business`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, open_hour: Number(openHour), close_hour: Number(closeHour), slot_minutes: Number(slotMinutes) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create')
      onCreated(data.id)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-3">Create your business</h2>
      <form onSubmit={submit} className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} required />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Description</label>
          <input className="w-full border rounded px-3 py-2" value={description} onChange={e=>setDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Open hour</label>
          <input type="number" min="0" max="23" className="w-full border rounded px-3 py-2" value={openHour} onChange={e=>setOpenHour(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Close hour</label>
          <input type="number" min="0" max="23" className="w-full border rounded px-3 py-2" value={closeHour} onChange={e=>setCloseHour(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Slot minutes</label>
          <input type="number" min="5" max="240" className="w-full border rounded px-3 py-2" value={slotMinutes} onChange={e=>setSlotMinutes(e.target.value)} />
        </div>
        {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
        <div className="sm:col-span-2 flex gap-2">
          <button disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{loading? 'Creating...' : 'Create business'}</button>
        </div>
      </form>
    </div>
  )
}
