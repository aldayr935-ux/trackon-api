"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShipment = exports.updateShipment = exports.createShipment = exports.getShipmentById = exports.getShipments = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// GET /shipments
const getShipments = async (req, res) => {
    try {
        const shipments = await client_1.default.shipment.findMany({
            include: {
                vehicle: true,
                route: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(shipments);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener envíos' });
    }
};
exports.getShipments = getShipments;
// GET /shipments/:id
const getShipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const shipment = await client_1.default.shipment.findUnique({
            where: { id },
            include: {
                vehicle: true,
                route: true,
                alerts: true,
            },
        });
        if (!shipment) {
            res.status(404).json({ error: 'Envío no encontrado' });
            return;
        }
        res.json(shipment);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener envío' });
    }
};
exports.getShipmentById = getShipmentById;
// POST /shipments
const createShipment = async (req, res) => {
    try {
        const { trackingCode, origin, destination, weight, vehicleId, routeId } = req.body;
        if (!trackingCode || !origin || !destination || !weight) {
            res.status(400).json({ error: 'Faltan campos requeridos: trackingCode, origin, destination, weight' });
            return;
        }
        const shipment = await client_1.default.shipment.create({
            data: {
                trackingCode,
                origin,
                destination,
                weight: parseFloat(weight),
                vehicleId: vehicleId || null,
                routeId: routeId || null,
            },
        });
        res.status(201).json(shipment);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'El trackingCode ya existe' });
            return;
        }
        res.status(500).json({ error: 'Error al crear envío' });
    }
};
exports.createShipment = createShipment;
// PUT /shipments/:id
const updateShipment = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, vehicleId, routeId } = req.body;
        const shipment = await client_1.default.shipment.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(vehicleId !== undefined && { vehicleId }),
                ...(routeId !== undefined && { routeId }),
            },
        });
        res.json(shipment);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Envío no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al actualizar envío' });
    }
};
exports.updateShipment = updateShipment;
// DELETE /shipments/:id
const deleteShipment = async (req, res) => {
    try {
        const id = req.params.id;
        await client_1.default.shipment.delete({ where: { id } });
        res.json({ message: 'Envío eliminado correctamente' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Envío no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al eliminar envío' });
    }
};
exports.deleteShipment = deleteShipment;
