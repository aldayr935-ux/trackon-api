import { Request, Response, NextFunction } from 'express'
import { validationResult, body } from 'express-validator'

// Middleware que revisa si hay errores de validación
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

// Reglas para registro
export const registerRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .escape(), // Escapa caracteres HTML — protección XSS

  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(), // Normaliza: mayúsculas, espacios, etc.

  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
]

// Reglas para login
export const loginRules = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
]

// Reglas para shipments
export const shipmentRules = [
  body('trackingCode')
    .trim()
    .notEmpty().withMessage('El trackingCode es requerido')
    .isLength({ max: 50 }).withMessage('Máximo 50 caracteres')
    .escape(),

  body('origin')
    .trim()
    .notEmpty().withMessage('El origen es requerido')
    .escape(),

  body('destination')
    .trim()
    .notEmpty().withMessage('El destino es requerido')
    .escape(),

  body('weight')
    .notEmpty().withMessage('El peso es requerido')
    .isFloat({ min: 0.1 }).withMessage('El peso debe ser un número positivo'),
]