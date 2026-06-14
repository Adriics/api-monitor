'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

type Incident = {
    id: string
    monitor: {
        id: string
        name: string
    }
    status: 'OPEN' | 'RESOLVED'
    startedAt: string
    resolvedAt: string | null
}

export default function IncidentsPage() {
    const { data, isLoading, error } = useQuery<Incident[]>({
        queryKey: ['incidents'],
        queryFn: () => api.get('/incidents').then(res => res.data),
        refetchInterval: 30000,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Cargando incidents...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-red-400 text-sm">Error al cargar incidents</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white px-6 py-8 max-w-4xl mx-auto">
            <h1 className="text-lg font-semibold mb-6">Incidents</h1>

            <div className="space-y-3">
                {data?.length === 0 && (
                    <p className="text-zinc-500 text-sm">
                        No hay incidents 🎉
                    </p>
                )}

                {data?.map((incident) => {
                    const isOpen = incident.status === 'OPEN'

                    const duration =
                        new Date(
                            incident.resolvedAt ?? new Date()
                        ).getTime() -
                        new Date(incident.startedAt).getTime()

                    const minutes = Math.floor(duration / 60000)

                    return (
                        <div
                            key={incident.id}
                            className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
                        >
                            {/* Left */}
                            <div>
                                <p className="text-white text-sm font-medium">
                                    {incident.monitor.name}
                                </p>

                                <p className="text-zinc-500 text-xs mt-1">
                                    Started:{' '}
                                    {new Date(
                                        incident.startedAt
                                    ).toLocaleString()}
                                </p>

                                {!isOpen && (
                                    <p className="text-zinc-500 text-xs">
                                        Resolved:{' '}
                                        {new Date(
                                            incident.resolvedAt!
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>

                            {/* Right */}
                            <div className="text-right">
                                <span
                                    className={`text-xs font-medium ${isOpen
                                        ? 'text-red-400'
                                        : 'text-emerald-400'
                                        }`}
                                >
                                    {incident.status}
                                </span>

                                <p className="text-zinc-400 text-xs mt-1">
                                    {minutes} min
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}