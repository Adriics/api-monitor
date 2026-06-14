'use client'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import { Monitor } from '@/lib/types'

export default function DashboardPage() {
    const router = useRouter()

    const { data: monitors, isLoading, error } = useQuery<Monitor[]>({
        queryKey: ['monitors'],
        queryFn: () => api.get('/monitors').then(res => res.data),
        refetchInterval: 30000,
    })

    function handleLogout() {
        localStorage.removeItem('token')
        router.push('/login')
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Cargando...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-red-400 text-sm">Error al cargar los monitores</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header */}
            <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <h1 className="text-white font-semibold">api-monitor</h1>

                <button
                    onClick={handleLogout}
                    className="text-zinc-400 hover:text-white text-sm transition-colors"
                >
                    Cerrar sesión
                </button>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                {/* Title row */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-medium text-lg">
                        Monitores
                    </h2>

                    <Link
                        href="/dashboard/monitors/new"
                        className="bg-white text-zinc-900 text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                        + Añadir monitor
                    </Link>
                </div>

                {/* Empty state */}
                {monitors?.length === 0 && (
                    <div className="border border-zinc-800 border-dashed rounded-xl p-12 text-center">
                        <p className="text-zinc-500 text-sm">
                            No tienes monitores todavía
                        </p>
                        <Link
                            href="/dashboard/monitors/new"
                            className="text-zinc-300 hover:text-white text-sm mt-2 inline-block transition-colors"
                        >
                            Crea el primero →
                        </Link>
                    </div>
                )}

                {/* Monitors list */}
                <div className="space-y-3">
                    {monitors?.map(monitor => {
                        const status = monitor.currentStatus

                        const dotColor =
                            status === 'UP'
                                ? 'bg-emerald-400'
                                : status === 'DOWN'
                                    ? 'bg-red-500'
                                    : 'bg-yellow-400'

                        const statusColor =
                            status === 'UP'
                                ? 'text-emerald-400'
                                : status === 'DOWN'
                                    ? 'text-red-400'
                                    : 'text-yellow-400'

                        const borderColor =
                            status === 'UP'
                                ? 'border-zinc-800 hover:border-emerald-700/40'
                                : status === 'DOWN'
                                    ? 'border-red-900/40 hover:border-red-700'
                                    : 'border-yellow-900/40 hover:border-yellow-700'

                        return (
                            <Link
                                key={monitor.id}
                                href={`/dashboard/monitors/${monitor.id}`}
                                className={`block bg-zinc-900 border rounded-xl px-5 py-4 transition-colors ${borderColor}`}
                            >
                                <div className="flex items-center justify-between">
                                    {/* Left */}
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-2 h-2 rounded-full ${dotColor}`}
                                        />

                                        <div>
                                            <p className="text-white text-sm font-medium">
                                                {monitor.name}
                                            </p>

                                            <p className="text-zinc-500 text-xs mt-0.5">
                                                {monitor.url}
                                            </p>

                                            <p
                                                className={`text-xs mt-1 font-medium ${statusColor}`}
                                            >
                                                {status}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right */}
                                    <div className="text-right">
                                        <p className="text-zinc-400 text-xs">
                                            {monitor._count.checks} checks
                                        </p>

                                        <p className="text-zinc-600 text-xs mt-0.5">
                                            cada {monitor.intervalMins} min
                                        </p>

                                        {monitor.lastLatency && (
                                            <p className="text-zinc-500 text-xs mt-1">
                                                {monitor.lastLatency} ms
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}