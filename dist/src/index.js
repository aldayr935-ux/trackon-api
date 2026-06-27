"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const client_1 = __importDefault(require("./prisma/client"));
const auth_middleware_1 = require("./middlewares/auth.middleware");
const shipments_routes_1 = __importDefault(require("./routes/shipments.routes"));
const vehicles_routes_1 = __importDefault(require("./routes/vehicles.routes"));
const routes_routes_1 = __importDefault(require("./routes/routes.routes"));
const alerts_routes_1 = __importDefault(require("./routes/alerts.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3000;
// Rate limiter general — 100 requests por IP cada 15 minutos
const generalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Demasiadas solicitudes, intenta más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Rate limiter estricto para auth — 10 intentos por IP cada 15 minutos
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Demasiados intentos de autenticación, intenta más tarde' },
    standardHeaders: true,
    legacyHeaders: false,
});
// Seguridad
const allowedOrigins = [
    'http://localhost:5173',
    'https://trackon-dashboard.vercel.app',
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('No permitido por CORS'));
        }
    },
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(generalLimiter);
app.use(express_1.default.json({ limit: '10kb' }));
// Rutas públicas
app.use('/api/auth', authLimiter, auth_routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'TRACKON API corriendo' });
});
// Rutas protegidas
app.use('/api/shipments', auth_middleware_1.authMiddleware, shipments_routes_1.default);
app.use('/api/vehicles', auth_middleware_1.authMiddleware, vehicles_routes_1.default);
app.use('/api/routes', auth_middleware_1.authMiddleware, routes_routes_1.default);
app.use('/api/alerts', auth_middleware_1.authMiddleware, alerts_routes_1.default);
app.use('/api/dashboard', auth_middleware_1.authMiddleware, dashboard_routes_1.default);
client_1.default.$connect()
    .then(() => console.log('✅ Base de datos conectada'))
    .catch((err) => console.error('❌ Error de DB:', err));
// Manejador de errores global — siempre al final
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Error interno del servidor' });
});
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
