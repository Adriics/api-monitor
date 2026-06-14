import { Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as incidentsService from '../services/incidents.service'

export async function getIncidents(req: AuthRequest, res: Response) {
    try {
        const incidents = await incidentsService.getIncidents(req.userId!)
        res.json(incidents)
    } catch (error) {
        res.status(500).json({ error: 'Error interno' })
    }
}