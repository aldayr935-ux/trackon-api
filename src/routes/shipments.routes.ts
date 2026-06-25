import { Router } from 'express'
import {
  getShipments,
  getShipmentById,
  createShipment,
  updateShipment,
  deleteShipment,
} from '../controllers/shipments.controller'
import { validate, shipmentRules } from '../middlewares/validate.middleware'

const router = Router()

router.get('/', getShipments)
router.get('/:id', getShipmentById)
router.post('/', shipmentRules, validate, createShipment)
router.put('/:id', updateShipment)
router.delete('/:id', deleteShipment)

export default router