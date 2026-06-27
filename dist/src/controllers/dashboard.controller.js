"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// GET /dashboard
const getDashboardStats = async (req, res) => {
    try {
        // Ejecutar todas las queries en paralelo con Promise.all
        const [totalShipments, shipmentsByStatus, totalVehicles, vehiclesByStatus, totalRoutes, unreadAlerts, recentShipments,] = await Promise.all([
            // Total de envíos
            client_1.default.shipment.count(),
            // Envíos agrupados por status
            client_1.default.shipment.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            // Total de vehículos
            client_1.default.vehicle.count(),
            // Vehículos agrupados por status
            client_1.default.vehicle.groupBy({
                by: ['status'],
                _count: { status: true },
            }),
            // Total de rutas activas
            client_1.default.route.count({
                where: { status: 'ACTIVE' },
            }),
            // Alertas sin leer
            client_1.default.alert.count({
                where: { read: false },
            }),
            // Últimos 5 envíos
            client_1.default.shipment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { vehicle: true, route: true },
            }),
        ]);
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
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
};
exports.getDashboardStats = getDashboardStats;
