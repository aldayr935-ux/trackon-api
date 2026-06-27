"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlert = exports.markAllAsRead = exports.markAsRead = exports.createAlert = exports.getUnreadAlerts = exports.getAlerts = void 0;
const client_1 = __importDefault(require("../prisma/client"));
// GET /alerts
const getAlerts = async (req, res) => {
    try {
        const alerts = await client_1.default.alert.findMany({
            include: {
                shipment: true,
                user: {
                    select: { id: true, name: true, email: true }
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener alertas' });
    }
};
exports.getAlerts = getAlerts;
// GET /alerts/unread
const getUnreadAlerts = async (req, res) => {
    try {
        const alerts = await client_1.default.alert.findMany({
            where: { read: false },
            include: { shipment: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener alertas no leídas' });
    }
};
exports.getUnreadAlerts = getUnreadAlerts;
// POST /alerts
const createAlert = async (req, res) => {
    try {
        const { message, type, shipmentId, userId } = req.body;
        if (!message || !type) {
            res.status(400).json({ error: 'Faltan campos requeridos: message, type' });
            return;
        }
        const validTypes = ['INFO', 'WARNING', 'ERROR'];
        if (!validTypes.includes(type)) {
            res.status(400).json({ error: `Tipo inválido. Debe ser: ${validTypes.join(', ')}` });
            return;
        }
        const alert = await client_1.default.alert.create({
            data: {
                message,
                type,
                shipmentId: shipmentId || null,
                userId: userId || null,
            },
        });
        res.status(201).json(alert);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al crear alerta' });
    }
};
exports.createAlert = createAlert;
// PUT /alerts/:id/read
const markAsRead = async (req, res) => {
    try {
        const id = req.params.id;
        const alert = await client_1.default.alert.update({
            where: { id },
            data: { read: true },
        });
        res.json(alert);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Alerta no encontrada' });
            return;
        }
        res.status(500).json({ error: 'Error al marcar alerta' });
    }
};
exports.markAsRead = markAsRead;
// PUT /alerts/read-all
const markAllAsRead = async (req, res) => {
    try {
        const result = await client_1.default.alert.updateMany({
            where: { read: false },
            data: { read: true },
        });
        res.json({ message: `${result.count} alertas marcadas como leídas` });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al marcar alertas' });
    }
};
exports.markAllAsRead = markAllAsRead;
// DELETE /alerts/:id
const deleteAlert = async (req, res) => {
    try {
        const id = req.params.id;
        await client_1.default.alert.delete({ where: { id } });
        res.json({ message: 'Alerta eliminada' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Alerta no encontrada' });
            return;
        }
        res.status(500).json({ error: 'Error al eliminar alerta' });
    }
};
exports.deleteAlert = deleteAlert;
