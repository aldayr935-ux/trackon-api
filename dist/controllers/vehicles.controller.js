"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVehicle = exports.updateVehicle = exports.createVehicle = exports.getVehicleById = exports.getVehicles = void 0;
const client_1 = __importDefault(require("../prisma/client"));
//GET / vehicles
const getVehicles = async (req, res) => {
    try {
        const vehicles = await client_1.default.vehicle.findMany({
            include: {
                shipments: true,
                routes: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(vehicles);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
};
exports.getVehicles = getVehicles;
//GET /vehicles/:id
const getVehicleById = async (req, res) => {
    try {
        const id = req.params.id;
        const vehicle = await client_1.default.vehicle.findUnique({
            where: { id },
            include: {
                shipments: true,
                routes: true,
            },
        });
        if (!vehicle) {
            res.status(404).json({ error: 'Vehículo no encontrado' });
            return;
        }
        res.json(vehicle);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener vehículo' });
    }
};
exports.getVehicleById = getVehicleById;
// POST /vehicles
const createVehicle = async (req, res) => {
    try {
        const { plate, model, year, driver, fuel, kmToday, cargo } = req.body;
        if (!plate || !model) {
            res.status(400).json({ error: 'Faltan campos requeridos: plate, model' });
            return;
        }
        const vehicle = await client_1.default.vehicle.create({
            data: {
                plate,
                model,
                year: year ? parseInt(year) : null,
                driver: driver || null,
                fuel: fuel ? parseFloat(fuel) : null,
                kmToday: kmToday ? parseFloat(kmToday) : null,
                cargo: cargo ? parseFloat(cargo) : null,
            },
        });
        res.status(201).json(vehicle);
    }
    catch (error) {
        if (error.code === 'P2002') {
            res.status(409).json({ error: 'Ya existe un vehículo con esa placa' });
            return;
        }
        res.status(500).json({ error: 'Error al crear vehículo' });
    }
};
exports.createVehicle = createVehicle;
// PUT /vehicles/:id
const updateVehicle = async (req, res) => {
    try {
        const id = req.params.id;
        const { status, model, year, driver, fuel, kmToday, cargo } = req.body;
        const vehicle = await client_1.default.vehicle.update({
            where: { id },
            data: {
                ...(status !== undefined && { status }),
                ...(model !== undefined && { model }),
                ...(year !== undefined && { year: parseInt(year) }),
                ...(driver !== undefined && { driver }),
                ...(fuel !== undefined && { fuel: parseFloat(fuel) }),
                ...(kmToday !== undefined && { kmToday: parseFloat(kmToday) }),
                ...(cargo !== undefined && { cargo: parseFloat(cargo) }),
            },
        });
        res.json(vehicle);
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Vehículo no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al actualizar vehículo' });
    }
};
exports.updateVehicle = updateVehicle;
//DELETE /vehicles/:id
const deleteVehicle = async (req, res) => {
    try {
        const id = req.params.id;
        await client_1.default.vehicle.delete({ where: { id } });
        res.json({ message: 'Vehículo eliminado correctamente' });
    }
    catch (error) {
        if (error.code === 'P2025') {
            res.status(404).json({ error: 'Vehículo no encontrado' });
            return;
        }
        res.status(500).json({ error: 'Error al eliminar vehículo' });
    }
};
exports.deleteVehicle = deleteVehicle;
