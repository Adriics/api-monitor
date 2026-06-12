import { Response } from 'express'
import { z } from 'zod'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as monitorsService from '../services/monitors.service'

const monitorSchema = z.object({
    name: z.string().min(1),
    url: z.string().url(),
    intervalMins: z.number().int().min(1).max(60).optional(),
    alertEmail: z.string().email().optional(),
})

export async function getMonitors(req: AuthRequest, res: Response) {
    try {
        const monitors = await monitorsService.getMonitors(req.userId!)
        res.json(monitors)
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}


export async function getMonitor(req: AuthRequest, res: Response) {
    try {
        const monitor = await monitorsService.getMonitor(req.userId!, req.params['id'] as string)
        if (!monitor) return res.status(404).json({ error: 'Monitor no encontrado' })
        res.json(monitor)
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function getMonitorChecks(req: AuthRequest, res: Response) {
    try {
        const checks = await monitorsService.getMonitorChecks(req.userId!, req.params['id'] as string)
        res.json(checks)
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function getMonitorStats(req: AuthRequest, res: Response) {
    try {
        const stats = await monitorsService.getMonitorStats(req.userId!, req.params['id'] as string)
        res.json(stats)
    } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Monitor no encontrado' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function createMonitor(req: AuthRequest, res: Response) {
    const result = monitorSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() })
    }

    try {
        const monitor = await monitorsService.createMonitor(req.userId!, result.data)
        res.status(201).json(monitor)
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function updateMonitor(req: AuthRequest, res: Response) {
    const result = monitorSchema.partial().safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() })
    }

    try {
        const monitor = await monitorsService.updateMonitor(req.userId!, req.params['id'] as string, result.data)
        res.json(monitor)
    } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Monitor no encontrado' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function deleteMonitor(req: AuthRequest, res: Response) {
    try {
        await monitorsService.deleteMonitor(req.userId!, req.params['id'] as string)
        res.status(204).send()
    } catch (error: any) {
        if (error.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Monitor no encontrado' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}