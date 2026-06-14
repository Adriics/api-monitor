import prisma from '../lib/prisma'

export async function getIncidents(userId: string) {
    const incidents = await prisma.incident.findMany({
        where: {
            monitor: {
                userId,
            },
        },
        orderBy: { createdAt: 'desc' },
        include: {
            monitor: true,
        },
    })

    return incidents.map(i => {
        const duration =
            i.resolvedAt
                ? i.resolvedAt.getTime() - i.startedAt.getTime()
                : Date.now() - i.startedAt.getTime()

        return {
            id: i.id,
            monitorName: i.monitor.name,
            url: i.monitor.url,
            status: i.status,
            startedAt: i.startedAt,
            resolvedAt: i.resolvedAt,
            durationMs: duration,
        }
    })
}