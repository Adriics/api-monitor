'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import api from '@/lib/api'
import { Monitor, Check } from '@/lib/types'
import LatencyChart from '@/components/LatencyChart'

type MonitorDetail = Monitor & {
    checks: Check[]
}

export default function MonitorDetailPage() {
    const params = useParams()
    const id = params.id as string

    const { data, isLoading, error } = useQuery<MonitorDetail>({
        queryKey: ['monitor', id],
        queryFn: () =>
            api.get(`/monitors/${id}`).then(res => res.data),
        refetchInterval: 30000,
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-zinc-500 text-sm">Cargando monitor...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <p className="text-red-400 text-sm">
                    Error al cargar el monitor
                </p>
            </div>
        )
    }

    const status = data.checks?.[0]?.status ?? 'NO_DATA'

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Header */}
            <div className="border-b border-zinc-800 px-6 py-4">
                <h1 className="text-lg font-semibold">{data.name}</h1>
                <p className="text-zinc-500 text-sm">{data.url}</p>

                <div className="mt-2">
                    <span
                        className={`text-sm font-medium ${status === 'UP'
                            ? 'text-emerald-400'
                            : status === 'DOWN'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            }`}
                    >
                        {status}
                    </span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <p className="text-zinc-500 text-xs">Total checks</p>
                        <p className="text-white text-lg font-semibold">
                            {data._count.checks}
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <p className="text-zinc-500 text-xs">Intervalo</p>
                        <p className="text-white text-lg font-semibold">
                            {data.intervalMins} min
                        </p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                        <p className="text-zinc-500 text-xs">Estado actual</p>
                        <p className="text-white text-lg font-semibold">
                            {status}
                        </p>
                    </div>
                </div>

                {data.checks?.length > 0 && (
                    <LatencyChart checks={data.checks} />
                )}

                {/* Checks list */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
                    <div className="px-4 py-3 border-b border-zinc-800">
                        <p className="text-sm font-medium">Últimos checks</p>
                    </div>

                    <div className="divide-y divide-zinc-800">
                        {data.checks?.slice(0, 20).map(check => (
                            <div
                                key={check.id}
                                className="flex items-center justify-between px-4 py-3"
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-2 h-2 rounded-full ${check.status === 'UP'
                                            ? 'bg-emerald-400'
                                            : check.status === 'DOWN'
                                                ? 'bg-red-500'
                                                : 'bg-yellow-400'
                                            }`}
                                    />

                                    <span className="text-sm text-white">
                                        {check.status}
                                    </span>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-zinc-400">
                                        {check.latencyMs} ms
                                    </p>
                                    <p className="text-xs text-zinc-600">
                                        {new Date(
                                            check.checkedAt
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}