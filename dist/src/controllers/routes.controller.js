"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRoute = exports.updateRoute = exports.createRoute = exports.getRouteById = exports.getRoutes = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// GET /routes
const getRoutes = async (req, res) => {
    try {
        const routes = await client_1.default.route.findMany({
            include: {
                vehicle: true,
                shipments: true,
            },
            orderBy: { createdAt: "desc" },
        });
        res.json(routes);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener rutas" });
    }
};
exports.getRoutes = getRoutes;
// GET /routes/:id
const getRouteById = async (req, res) => {
    try {
        const id = req.params.id;
        const route = await client_1.default.route.findUnique({
            where: { id },
            include: {
                vehicle: true,
                shipments: {
                    include: { vehicle: true },
                },
            },
        });
        if (!route) {
            res.status(404).json({ error: "Ruta no encontrada" });
            return;
        }
        res.json(route);
    }
    catch (error) {
        res.status(500).json({ error: "Error al obtener ruta" });
    }
};
exports.getRouteById = getRouteById;
// POST /routes
const createRoute = async (req, res) => {
    try {
        const { name, origin, destination, distance, avgTime, punctuality, efficiency, vehicleId } = req.body;
        if (!name || !origin || !destination) {
            res.status(400).json({ error: 'Faltan campos requeridos: name, origin, destination' });
            return;
        }
        const route = await client_1.default.route.create({
            data: {
                name,
                origin,
                destination,
                distance: distance ? parseFloat(distance) : null,
                avgTime: avgTime ? parseFloat(avgTime) : null,
                punctuality: punctuality ? parseFloat(punctuality) : null,
                efficiency: efficiency || 'MEDIA',
                vehicleId: vehicleId || null,
            },
            include: { vehicle: true },
        });
        res.status(201).json(route);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear ruta' });
    }
};
exports.createRoute = createRoute;
// PUT /routes/:id
const updateRoute = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, name, distance, avgTime, punctuality, efficiency, vehicleId } = req.body;
        const route = await client_1.default.route.update({
            where: { id },
            data: {
                ...(status !== undefined && { status }),
                ...(name !== undefined && { name }),
                ...(distance !== undefined && { distance: parseFloat(distance) }),
                ...(avgTime !== undefined && { avgTime: parseFloat(avgTime) }),
                ...(punctuality !== undefined && { punctuality: parseFloat(punctuality) }),
                ...(efficiency !== undefined && { efficiency }),
                ...(vehicleId !== undefined && { vehicleId }),
            },
            include: { vehicle: true },
        });
        res.json(route);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Ruta no encontrada' });
            return;
        }
        res.status(500).json({ error: 'Error al actualizar ruta' });
    }
};
exports.updateRoute = updateRoute;
// DELETE /routes/:id
const deleteRoute = async (req, res) => {
    try {
        const id = req.params.id;
        await client_1.default.route.delete({ where: { id } });
        res.json({ message: "Ruta eliminada correctamente" });
    }
    catch (error) {
        if (error.code === "P2025") {
            res.status(404).json({ error: "Ruta no encontrada" });
            return;
        }
        res.status(500).json({ error: "Error al eliminar ruta" });
    }
};
exports.deleteRoute = deleteRoute;
