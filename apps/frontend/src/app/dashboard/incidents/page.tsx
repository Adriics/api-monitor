'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export default function IncidentsPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['incidents'],
        queryFn: () => api.get('/incidents').then(res => res.data),
        refetchInterval: 30000,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500">Cargando incidents...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-red-400">Error cargando incidents</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-6">
            <h1 className="text-lg font-semibold mb-6">Incidents</h1>

            <div className="space-y-3">
                {data?.map((i: any) => (
                    <div
                        key={i.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl p-4"
                    >
                        <div className="flex justify-between">
                            <div>
                                <p className="font-medium">{i.monitorName}</p>
                                <p className="text-xs text-zinc-500">{i.url}</p>

                                <p
                                    className={`text-xs mt-1 ${i.status === 'OPEN'
                                        ? 'text-red-400'
                                        : 'text-yellow-400'
                                        }`}
                                >
                                    {i.status}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="text-xs text-zinc-400">
                                    {(i.durationMs / 1000 / 60).toFixed(1)} min
                                </p>
                                <p className="text-xs text-zinc-600">
                                    {new Date(i.startedAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}