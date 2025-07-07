import { body } from 'express-validator';

export const userValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('apellido').optional(),
  body('cedula').notEmpty().withMessage('La cédula es requerida'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('rol').isIn(['ADMIN', 'USER']).withMessage('Rol inválido'),
];

export const userValidationUpdate = [
  body('nombre').optional().notEmpty(),
  body('apellido').optional(),
  body('cedula').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('rol').optional().isIn(['ADMIN', 'USER']),
];
