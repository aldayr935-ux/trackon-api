"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentRules = exports.loginRules = exports.registerRules = exports.validate = void 0;
const express_validator_1 = require("express-validator");
// Middleware que revisa si hay errores de validación
const validate = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    next();
};
exports.validate = validate;
// Reglas para registro
exports.registerRules = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
        .escape(), // Escapa caracteres HTML — protección XSS
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(), // Normaliza: mayúsculas, espacios, etc.
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('La contraseña es requerida')
        .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
];
// Reglas para login
exports.loginRules = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('El email es requerido')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('La contraseña es requerida'),
];
// Reglas para shipments
exports.shipmentRules = [
    (0, express_validator_1.body)('trackingCode')
        .trim()
        .notEmpty().withMessage('El trackingCode es requerido')
        .isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
        .escape(),
    (0, express_validator_1.body)('origin')
        .trim()
        .notEmpty().withMessage('El origen es requerido')
        .escape(),
    (0, express_validator_1.body)('destination')
        .trim()
        .notEmpty().withMessage('El destino es requerido')
        .escape(),
    (0, express_validator_1.body)('weight')
        .notEmpty().withMessage('El peso es requerido')
        .isFloat({ min: 0.1 }).withMessage('El peso debe ser un número positivo'),
];
