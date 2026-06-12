import prisma from '../lib/prisma'

export async function getMonitors(userId: string) {
    return prisma.monitor.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
            _count: { select: { checks: true } }
        }
    })
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

    await prisma.monitor.delete({ where: { id } })
}