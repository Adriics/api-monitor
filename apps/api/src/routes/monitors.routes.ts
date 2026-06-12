import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import {
    getMonitors,
    getMonitorChecks,
    getMonitorStats,
    createMonitor,
    updateMonitor,
    getMonitor,
    deleteMonitor
} from '../controllers/monitors.controller'

const router = Router()

router.use(authMiddleware)

router.get('/', getMonitors)
router.get("/:id/checks", getMonitorChecks)
router.get("/:id/stats", getMonitorStats)
router.get('/:id', getMonitor)
router.post('/', createMonitor)
router.put('/:id', updateMonitor)
router.delete('/:id', deleteMonitor)

export default router