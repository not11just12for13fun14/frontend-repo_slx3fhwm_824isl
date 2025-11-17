export default function Header() {
  return (
    <header className="w-full border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600" />
          <span className="font-semibold text-lg text-gray-800">Aptly AI</span>
        </div>
        <nav className="text-sm text-gray-600">Book • Reschedule • Cancel</nav>
      </div>
    </header>
  );
}
