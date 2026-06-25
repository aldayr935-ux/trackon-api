import { Request, Response } from 'express'
import prisma from '../prisma/client'

// GET /alerts
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        shipment: true,
        user: {
          select: { id: true, name: true, email: true }
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas' })
  }
}

// GET /alerts/unread
export const getUnreadAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { read: false },
      include: { shipment: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(alerts)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener alertas no leídas' })
  }
}

// POST /alerts
export const createAlert = async (req: Request, res: Response) => {
  try {
    const { message, type, shipmentId, userId } = req.body

    if (!message || !type) {
      res.status(400).json({ error: 'Faltan campos requeridos: message, type' })
      return
    }

    const validTypes = ['INFO', 'WARNING', 'ERROR']
    if (!validTypes.includes(type)) {
      res.status(400).json({ error: `Tipo inválido. Debe ser: ${validTypes.join(', ')}` })
      return
    }

    const alert = await prisma.alert.create({
      data: {
        message,
        type,
        shipmentId: shipmentId || null,
        userId: userId || null,
      },
    })

    res.status(201).json(alert)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear alerta' })
  }
}

// PUT /alerts/:id/read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const alert = await prisma.alert.update({
      where: { id },
      data: { read: true },
    })

    res.json(alert)
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Alerta no encontrada' })
      return
    }
    res.status(500).json({ error: 'Error al marcar alerta' })
  }
}

// PUT /alerts/read-all
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const result = await prisma.alert.updateMany({
      where: { read: false },
      data: { read: true },
    })

    res.json({ message: `${result.count} alertas marcadas como leídas` })
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar alertas' })
  }
}

// DELETE /alerts/:id
export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    await prisma.alert.delete({ where: { id } })

    res.json({ message: 'Alerta eliminada' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Alerta no encontrada' })
      return
    }
    res.status(500).json({ error: 'Error al eliminar alerta' })
  }
}