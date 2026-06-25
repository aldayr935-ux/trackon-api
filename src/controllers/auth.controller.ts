import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../prisma/client'

const JWT_SECRET = process.env.JWT_SECRET as string 
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// POST /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Faltan campos requeridos: name, email, password' })
      return
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
      return
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      res.status(409).json({ error: 'El email ya está registrado' })
      return
    }

    // Hashear la contraseña — el 10 es el "salt rounds" (más alto = más seguro pero más lento)
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    // Generar token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any}
    )

    res.status(201).json({ user, token })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' })
  }
}

// POST /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      res.status(400).json({ error: 'Faltan campos requeridos: email, password' })
      return
    }

    // Buscar usuario — aquí SÍ traemos password para comparar
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      // Mensaje genérico intencionalmente — no revelar si el email existe o no
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    // Comparar contraseña con el hash guardado
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' })
      return
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN as any }
    )

    // Responder sin incluir el password
    const { password: _, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword, token })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

// GET /auth/me
export const getMe = async (req: Request, res: Response) => {
  try {
    // req.userId viene del middleware de auth que crearemos enseguida
    const userId = (req as any).userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    if (!user) {
      res.status(404).json({ error: 'Usuario no encontrado' })
      return
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuario' })
  }
}