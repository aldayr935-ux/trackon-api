import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET as string

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // El token llega en el header: Authorization: Bearer <token>
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token no proporcionado' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string }

    // Adjuntamos el userId al request para que el controller lo use
    ;(req as any).userId = decoded.userId
    ;(req as any).userRole = decoded.role

    next() // ← Deja pasar el request al controller
  } catch (error) {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}