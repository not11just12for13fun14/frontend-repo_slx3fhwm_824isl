import { useState } from 'react'
import Header from './components/Header'
import BusinessSetup from './components/BusinessSetup'
import BookingWidget from './components/BookingWidget'

function App() {
  const [businessId, setBusinessId] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        <section className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">AI Appointment Booking for Small Business</h1>
          <p className="text-gray-600">Create your business, generate available times, and let customers book, reschedule, or cancel with ease.</p>
        </section>

        {!businessId && (
          <BusinessSetup onCreated={setBusinessId} />
        )}

        {businessId && (
          <div className="grid md:grid-cols-2 gap-6">
            <BookingWidget businessId={businessId} />
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h2 className="text-lg font-semibold mb-2">Manage appointments</h2>
              <p className="text-sm text-gray-600">Use the booking panel to create appointments. In a follow-up, we can add a full management table with reschedule and cancel controls.</p>
              <div className="mt-3 p-3 rounded border bg-gray-50 text-sm text-gray-700">Business ID: {businessId}</div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
