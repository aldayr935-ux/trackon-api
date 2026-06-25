import { Router } from 'express'
import {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} from '../controllers/routes.controller'

const router = Router()

router.get('/', getRoutes)
router.get('/:id', getRouteById)
router.post('/', createRoute)
router.put('/:id', updateRoute)
router.delete('/:id', deleteRoute)

export default router