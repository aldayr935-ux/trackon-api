import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import prisma from './prisma/client'
import { authMiddleware } from './middlewares/auth.middleware'
import shipmentsRouter from './routes/shipments.routes'
import vehiclesRouter from './routes/vehicles.routes'
import routesRouter from './routes/routes.routes'
import alertsRouter from './routes/alerts.routes'
import dashboardRouter from './routes/dashboard.routes'
import authRouter from './routes/auth.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Rate limiter general — 100 requests por IP cada 15 minutos
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Rate limiter estricto para auth — 10 intentos por IP cada 15 minutos
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Demasiados intentos de autenticación, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Seguridad
app.use(helmet())
app.use(generalLimiter)
const allowedOrigins = [
  'http://localhost:5173',              
  'https://trackon-dashboard.vercel.app/',       
]

app.use(cors({
  origin: (origin, callback) => {
    // Permite requests sin origin (Thunder Client, Postman, apps móviles)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  },
  credentials: true,
}))
app.use(express.json({ limit: '10kb' })) // Limita el tamaño del body

// Rutas públicas
app.use('/api/auth', authLimiter, authRouter)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'TRACKON API corriendo' })
})

// Rutas protegidas
app.use('/api/shipments', authMiddleware, shipmentsRouter)
app.use('/api/vehicles', authMiddleware, vehiclesRouter)
app.use('/api/routes', authMiddleware, routesRouter)
app.use('/api/alerts', authMiddleware, alertsRouter)
app.use('/api/dashboard', authMiddleware, dashboardRouter)

prisma.$connect()
  .then(() => console.log('✅ Base de datos conectada'))
  .catch((err) => console.error('❌ Error de DB:', err))

// Manejador de errores global — siempre al final
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})