import { Request, Response } from 'express'
import { z } from 'zod'
import * as authService from '../services/auth.service'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export async function register(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() })
    }

    try {
        const user = await authService.register(result.data)
        res.status(201).json(user)
    } catch (error: any) {
        if (error.message === 'EMAIL_TAKEN') {
            return res.status(409).json({ error: 'Email ya registrado' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}

export async function login(req: Request, res: Response) {
    const result = registerSchema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() })
    }

    try {
        const token = await authService.login(result.data)
        res.json({ token })
    } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ error: 'Credenciales incorrectas' })
        }
        res.status(500).json({ error: 'Error interno' })
    }
}