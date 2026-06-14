'use client'

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'

type Check = {
    id: string
    latencyMs: number | null
    checkedAt: string
    status: string
}

export default function LatencyChart({ checks }: { checks: Check[] }) {
    const data = [...checks]
        .reverse()
        .map((check) => ({
            time: new Date(check.checkedAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            }),
            latency: check.latencyMs ?? 0,
        }))

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4" >
            <h3 className="text-white text-sm font-medium mb-4" >
                Latencia(ms)
            </h3>

            < div className="h-72" >
                <ResponsiveContainer width="100%" height="100%" >
                    <LineChart data={data}>
                        <CartesianGrid stroke="#27272a" />
                        <XAxis dataKey="time" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip />
                        < Line
                            type="monotone"
                            dataKey="latency"
                            stroke="#34d399"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}