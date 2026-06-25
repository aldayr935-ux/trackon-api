import { Request, Response } from 'express'
import prisma from '../prisma/client'

// GET /shipments
export const getShipments = async (req: Request, res: Response) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        vehicle: true,
        route: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    res.json(shipments)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envíos' })
  }
}

// GET /shipments/:id
export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const shipment = await prisma.shipment.findUnique({
      where: { id },
      include: {
        vehicle: true,
        route: true,
        alerts: true,
      },
    })

    if (!shipment) {
      res.status(404).json({ error: 'Envío no encontrado' })
      return
    }

    res.json(shipment)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener envío' })
  }
}

// POST /shipments
export const createShipment = async (req: Request, res: Response) => {
  try {
    const { trackingCode, origin, destination, weight, vehicleId, routeId } = req.body

    if (!trackingCode || !origin || !destination || !weight) {
      res.status(400).json({ error: 'Faltan campos requeridos: trackingCode, origin, destination, weight' })
      return
    }

    const shipment = await prisma.shipment.create({
      data: {
        trackingCode,
        origin,
        destination,
        weight: parseFloat(weight),
        vehicleId: vehicleId || null,
        routeId: routeId || null,
      },
    })

    res.status(201).json(shipment)
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'El trackingCode ya existe' })
      return
    }
    res.status(500).json({ error: 'Error al crear envío' })
  }
}

// PUT /shipments/:id
export const updateShipment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const { status, vehicleId, routeId } = req.body

    const shipment = await prisma.shipment.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(vehicleId !== undefined && { vehicleId }),
        ...(routeId !== undefined && { routeId }),
      },
    })

    res.json(shipment)
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Envío no encontrado' })
      return
    }
    res.status(500).json({ error: 'Error al actualizar envío' })
  }
}

// DELETE /shipments/:id
export const deleteShipment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    await prisma.shipment.delete({ where: { id } })

    res.json({ message: 'Envío eliminado correctamente' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Envío no encontrado' })
      return
    }
    res.status(500).json({ error: 'Error al eliminar envío' })
  }
}