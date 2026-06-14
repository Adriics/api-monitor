import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import { getIncidents } from '../controllers/incidents.controller'

const router = Router()

router.use(authMiddleware)

router.get('/', authMiddleware, getIncidents)

export default router