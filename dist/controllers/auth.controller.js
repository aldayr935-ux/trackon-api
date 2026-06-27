"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../prisma/client"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
// POST /auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ error: 'Faltan campos requeridos: name, email, password' });
            return;
        }
        if (password.length < 6) {
            res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }
        // Verificar si el email ya existe
        const existingUser = await client_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            res.status(409).json({ error: 'El email ya está registrado' });
            return;
        }
        // Hashear la contraseña — el 10 es el "salt rounds" (más alto = más seguro pero más lento)
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await client_1.default.user.create({
            data: { name, email, password: hashedPassword },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        // Generar token
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.status(201).json({ user, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};
exports.register = register;
// POST /auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Faltan campos requeridos: email, password' });
            return;
        }
        // Buscar usuario — aquí SÍ traemos password para comparar
        const user = await client_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            // Mensaje genérico intencionalmente — no revelar si el email existe o no
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        // Comparar contraseña con el hash guardado
        const passwordMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        // Responder sin incluir el password
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword, token });
    }
    catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
exports.login = login;
// GET /auth/me
const getMe = async (req, res) => {
    try {
        // req.userId viene del middleware de auth que crearemos enseguida
        const userId = req.userId;
        const user = await client_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        });
        if (!user) {
            res.status(404).json({ error: 'Usuario no encontrado' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
    }
};
exports.getMe = getMe;
