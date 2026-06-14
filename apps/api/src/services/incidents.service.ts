import prisma from '../lib/prisma'

export async function getIncidents(userId: string) {
    const incidents = await prisma.incident.findMany({
        where: {
            monitor: {
                userId,
            },
        },
        orderBy: {
            startedAt: 'desc',
        },
        include: {
            monitor: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    })

    return incidents.map((incident) => {
        const duration =
            new Date(incident.resolvedAt ?? new Date()).getTime() -
            new Date(incident.startedAt).getTime()

        return {
            id: incident.id,
            status: incident.status,
            startedAt: incident.startedAt,
            resolvedAt: incident.resolvedAt,
            monitor: incident.monitor,
            durationMs: duration,
            durationMin: Math.floor(duration / 60000),
        }
    })
}