import { Request, Response } from "express";
import prisma from "../prisma/client";

// GET /routes
export const getRoutes = async (req: Request, res: Response) => {
    try {
    const routes = await prisma.route.findMany({
        include: {
        vehicle: true,
        shipments: true,
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(routes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener rutas" });
  }
};

// GET /routes/:id
export const getRouteById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const route = await prisma.route.findUnique({
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
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ruta" });
  }
};

// POST /routes
export const createRoute = async (req: Request, res: Response) => {
  try {
    const { name, origin, destination, vehicleId } = req.body;

    if (!name || !origin || !destination) {
      res
        .status(400)
        .json({ error: "Faltan campos requeridos: name, origin, destination" });
      return;
    }

    const route = await prisma.route.create({
      data: {
        name,
        origin,
        destination,
        vehicleId: vehicleId || null,
      },
      include: { vehicle: true },
    });

    res.status(201).json(route);
  } catch (error) {
    res.status(500).json({ error: "Error al crear ruta" });
  }
};

// PUT /routes/:id
export const updateRoute = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status, vehicleId, name } = req.body;

    const route = await prisma.route.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(name && { name }),
        ...(vehicleId !== undefined && { vehicleId }),
      },
      include: { vehicle: true },
    });

    res.json(route);
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Ruta no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error al actualizar ruta" });
  }
};

// DELETE /routes/:id
export const deleteRoute = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await prisma.route.delete({ where: { id } });

    res.json({ message: "Ruta eliminada correctamente" });
  } catch (error: any) {
    if (error.code === "P2025") {
      res.status(404).json({ error: "Ruta no encontrada" });
      return;
    }
    res.status(500).json({ error: "Error al eliminar ruta" });
  }
};
