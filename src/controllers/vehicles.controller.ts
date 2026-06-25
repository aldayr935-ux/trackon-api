import { Request, Response } from 'express'
import prisma from '../prisma/client'

//GET / vehicles
export const getVehicles = async (req: Request, res: Response) => {
    try{
        const vehicles = await prisma.vehicle.findMany({
            include: {
                shipments: true,
                routes: true,
            },
            orderBy: {createdAt: 'desc'},
        })
        res.json(vehicles)
    }   catch (error) {
        res.status(500).json({error: 'Error al obtener vehículos'})
    }
}

//GET /vehicles/:id
export const getVehicleById = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string

        const vehicle = await prisma.vehicle.findUnique ({
            where: {id},
            include: {
                shipments: true,
                routes: true,
            },
        })

        if (!vehicle) {
            res.status(404).json({error: 'Vehículo no encontrado'})
            return
        }

        res.json(vehicle)
    }   catch(error) {
        res.status(500).json({error: 'Error al obtener vehículo'})
    }
}

// POST /vehicles
export const createVehicle = async (req: Request, res: Response) => {
    try {
        const { plate, model } = req.body

        if (!plate || !model) {
            res.status(400).json({error: 'Faltan campos requeridos: plate, model'})
            return
        }

        const vehicle = await prisma.vehicle.create ({
            data: { plate, model }
        })

        res.status(201).json(vehicle)
    }   catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({error: 'Ya esixte un Vehículo con esa placa'})
            return
        }
        res.status(500).json({error: 'Error al crear vehículo'})
    }
}

//PUT /vehicle
export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string
        const { status, model} = req.body

        const vehicle = await prisma.vehicle.update({
            where: {id},
            data: {
                ...(status && {status}),
                ...(model && {model}),
            },
        })

        res.json(vehicle)
    }   catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Vehículo no encontrado'})
            return
        }
        res.status(500).json({error: 'Error al actualizar vehículo'})
    }
}

//DELETE /vehicles/:id
export const deleteVehicle = async (req: Request, res: Response) => {
    try{
        const id = req.params.id as string

        await prisma.vehicle.delete({ where: {id} })

        res.json({message: 'Vehículo eliminado correctamente'})
    }   catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({error: 'Vehículo no encontrado'})
            return
        }
        res.status(500).json({error: 'Error al eliminar vehículo'})
    }
}
