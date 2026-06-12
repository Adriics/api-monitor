import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
    getMonitors,
    createMonitor,
    updateMonitor,
    deleteMonitor
} from '../controllers/monitors.controller'

const router = Router()

router.use(authMiddleware)

router.get('/', getMonitors)
router.post('/', createMonitor)
router.put('/:id', updateMonitor)
router.delete('/:id', deleteMonitor)

export default router