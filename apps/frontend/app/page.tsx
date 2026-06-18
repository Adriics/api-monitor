import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* NAV */}
      <header className="w-full flex justify-between items-center px-8 py-6 border-b border-zinc-900">
        <h1 className="text-lg font-semibold">api-monitor</h1>

        <div className="flex gap-4 text-sm">
          <Link href="/login" className="text-zinc-300 hover:text-white">
            Login
          </Link>
          <Link
            href="/register"
            className="px-3 py-1 bg-white text-black rounded-md font-medium"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold">
          Monitoriza tus APIs en tiempo real
        </h2>

        <p className="text-zinc-400 mt-4 max-w-xl">
          Detecta caídas, mide uptime y recibe alertas cuando tus servicios fallen.
          Todo desde un dashboard simple y rápido.
        </p>

        <div className="mt-8 flex gap-3">
          <Link
            href="/register"
            className="px-5 py-3 bg-white text-black rounded-lg font-medium"
          >
            Empezar gratis
          </Link>

          <Link
            href="/login"
            className="px-5 py-3 border border-zinc-700 rounded-lg text-white"
          >
            Ya tengo cuenta
          </Link>
        </div>

        {/* MOCK STATS */}
        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold">99.9%</p>
            <p className="text-zinc-500 text-sm">Uptime tracking</p>
          </div>

          <div>
            <p className="text-2xl font-bold">1 min</p>
            <p className="text-zinc-500 text-sm">Check interval</p>
          </div>

          <div>
            <p className="text-2xl font-bold">Alerts</p>
            <p className="text-zinc-500 text-sm">Email notifications</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="text-center text-xs text-zinc-600 py-6 border-t border-zinc-900">
        api-monitor © {new Date().getFullYear()}
      </footer>
    </div>
  )
}