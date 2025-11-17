import { useEffect, useMemo, useState } from 'react'

export default function BookingWidget({ businessId }) {
  const [services, setServices] = useState([])
  const [serviceName, setServiceName] = useState('Consultation')
  const [duration, setDuration] = useState(30)
  const [createdServiceId, setCreatedServiceId] = useState('')

  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10))
  const [slots, setSlots] = useState([])
  const [selectedStart, setSelectedStart] = useState('')
  const [booking, setBooking] = useState(false)
  const [email, setEmail] = useState('john@example.com')
  const [name, setName] = useState('John Doe')

  // create a default service if none exists
  useEffect(() => {
    let ignore = false
    const run = async () => {
      if (!businessId) return
      // Check if any service exists
      try {
        // No listing endpoint; create a default service for demo
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/service`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ business_id: businessId, name: serviceName, duration_minutes: Number(duration) })
        })
        const data = await res.json()
        if (!ignore && res.ok) setCreatedServiceId(data.id)
      } catch {}
    }
    run()
    return () => { ignore = true }
  }, [businessId])

  const dayIso = useMemo(() => new Date(date + 'T00:00:00Z').toISOString(), [date])

  useEffect(() => {
    const load = async () => {
      if (!businessId || !createdServiceId) return
      const url = `${import.meta.env.VITE_BACKEND_URL}/availability?business_id=${businessId}&service_id=${createdServiceId}&day_iso=${encodeURIComponent(dayIso)}`
      const res = await fetch(url)
      const data = await res.json()
      if (res.ok) setSlots(data.slots)
    }
    load()
  }, [businessId, createdServiceId, dayIso])

  const book = async () => {
    if (!selectedStart) return
    setBooking(true)
    try {
      const start = new Date(selectedStart)
      const end = new Date(start.getTime() + duration * 60000)
      const payload = {
        business_id: businessId,
        service_id: createdServiceId,
        customer: { name, email },
        start_iso: start.toISOString(),
        end_iso: end.toISOString(),
        status: 'booked'
      }
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (res.ok) {
        alert('Booked! ID: ' + data.id)
        setSelectedStart('')
      } else {
        alert(data.detail || 'Failed to book')
      }
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 sm:p-6 space-y-4">
      <h2 className="text-lg font-semibold">Book an appointment</h2>
      <div className="grid sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Service name</label>
            <input className="w-full border rounded px-3 py-2" value={serviceName} onChange={e=>setServiceName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Duration (min)</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={duration} onChange={e=>setDuration(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={date} onChange={e=>setDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Your name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-1">Available times</div>
          <div className="flex flex-wrap gap-2">
            {slots.length === 0 && <div className="text-gray-500 text-sm">No slots</div>}
            {slots.map(s => (
              <button key={s} onClick={()=>setSelectedStart(s)} className={`px-3 py-2 rounded border text-sm ${selectedStart===s? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-50'}`}>
                {new Date(s).toUTCString().slice(17,22)} UTC
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button disabled={!selectedStart || booking} onClick={book} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">{booking? 'Booking...' : 'Book appointment'}</button>
      </div>
    </div>
  )
}
