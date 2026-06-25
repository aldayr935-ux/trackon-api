import { Request, Response } from 'express'
import prisma from '../prisma/client'

// GET /dashboard
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Ejecutar todas las queries en paralelo con Promise.all
    const [
      totalShipments,
      shipmentsByStatus,
      totalVehicles,
      vehiclesByStatus,
      totalRoutes,
      unreadAlerts,
      recentShipments,
    ] = await Promise.all([
      // Total de envíos
      prisma.shipment.count(),

      // Envíos agrupados por status
      prisma.shipment.groupBy({
        by: ['status'],
        _count: { status: true },
      }),

      // Total de vehículos
      prisma.vehicle.count(),

      // Vehículos agrupados por status
      prisma.vehicle.groupBy({
        by: ['status'],
        _count: { status: true },
      }),

      // Total de rutas activas
      prisma.route.count({
        where: { status: 'ACTIVE' },
      }),

      // Alertas sin leer
      prisma.alert.count({
        where: { read: false },
      }),

      // Últimos 5 envíos
      prisma.shipment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { vehicle: true, route: true },
      }),
    ])

    res.json({
      shipments: {
        total: totalShipments,
        byStatus: shipmentsByStatus.map(s => ({
          status: s.status,
          count: s._count.status,
        })),
      },
      vehicles: {
        total: totalVehicles,
        byStatus: vehiclesByStatus.map(v => ({
          status: v.status,
          count: v._count.status,
        })),
      },
      routes: {
        active: totalRoutes,
      },
      alerts: {
        unread: unreadAlerts,
      },
      recentShipments,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}