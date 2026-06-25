import { Router } from 'express'
import {
  getAlerts,
  getUnreadAlerts,
  createAlert,
  markAsRead,
  markAllAsRead,
  deleteAlert,
} from '../controllers/alerts.controller'

const router = Router()

router.get('/', getAlerts)
router.get('/unread', getUnreadAlerts)
router.post('/', createAlert)
router.put('/read-all', markAllAsRead)
router.put('/:id/read', markAsRead)
router.delete('/:id', deleteAlert)

export default router