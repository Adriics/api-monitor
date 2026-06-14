import prisma from '../lib/prisma'

export async function getMonitors(userId: string) {
    const monitors = await prisma.monitor.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { checks: true } },
            checks: {
                orderBy: { checkedAt: 'desc' },
                take: 1,
            },
        },
    })

    return monitors.map((m) => {
        const lastCheck = m.checks[0]

        return {
            ...m,
            currentStatus: lastCheck?.status ?? 'UP',
            lastLatency: lastCheck?.latencyMs ?? null,
            lastCheckedAt: lastCheck?.checkedAt ?? null,
        }
    })
}

export async function getMonitor(userId: string, id: string) {
    const monitor = await prisma.monitor.findFirst({
        where: { id, userId },
        include: {
            _count: { select: { checks: true } },
            checks: {
                orderBy: { checkedAt: 'desc' },
                take: 50,
            },
        },
    })

    if (!monitor) throw new Error('NOT_FOUND')

    return monitor
}

export async function getMonitorChecks(userId: string, monitorId: string) {
    const monitor = await prisma.monitor.findFirst({ where: { id: monitorId, userId } })
    if (!monitor) throw new Error('NOT_FOUND')

    return prisma.check.findMany({
        where: { monitorId },
        orderBy: { checkedAt: 'desc' },
        take: 50
    })
}

export async function getMonitorStats(userId: string, monitorId: string) {
    const monitor = await prisma.monitor.findFirst({ where: { id: monitorId, userId } })
    if (!monitor) throw new Error('NOT_FOUND')

    const checks = await prisma.check.findMany({ where: { monitorId } })

    const totalChecks = checks.length
    if (totalChecks === 0) return { totalChecks: 0, uptime: 0, avgLatency: 0 }

    const upChecks = checks.filter(c => c.status === 'UP').length
    const uptime = Math.round((upChecks / totalChecks) * 100)
    const latencies = checks.filter(c => c.latencyMs !== null).map(c => c.latencyMs!)
    const avgLatency = latencies.length > 0 ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0

    return { totalChecks, uptime, avgLatency }
}

export async function createMonitor(userId: string, data: {
    name: string
    url: string
    intervalMins?: number
    alertEmail?: string
}) {
    return prisma.monitor.create({
        data: { ...data, userId }
    })
}

export async function updateMonitor(userId: string, id: string, data: {
    name?: string
    url?: string
    intervalMins?: number
    alertEmail?: string
    active?: boolean
}) {
    const monitor = await prisma.monitor.findFirst({ where: { id, userId } })
    if (!monitor) throw new Error('NOT_FOUND')

    return prisma.monitor.update({
        where: { id },
        data
    })
}

export async function deleteMonitor(userId: string, id: string) {
    const monitor = await prisma.monitor.findFirst({ where: { id, userId } })
    if (!monitor) throw new Error('NOT_FOUND')

    await prisma.check.deleteMany({ where: { monitorId: id } })
    await prisma.monitor.delete({ where: { id } })
}