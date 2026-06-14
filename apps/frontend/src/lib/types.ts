export type Monitor = {
    id: string
    name: string
    url: string
    intervalMins: number
    active: boolean
    alertEmail: string | null
    createdAt: string
    _count: { checks: number }
}

export type Check = {
    id: string
    monitorId: string
    status: 'UP' | 'DOWN' | 'TIMEOUT'
    latencyMs: number | null
    statusCode: number | null
    checkedAt: string
}

export type Stats = {
    totalChecks: number
    uptime: number
    avgLatency: number
}