import { body } from 'express-validator';

export const piscinaValidation = [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('direccion').notEmpty().withMessage('La dirección es requerida'),
  body('altura').isFloat({ gt: 0 }).withMessage('La altura debe ser mayor a 0'),
  body('ancho').isFloat({ gt: 0 }).withMessage('El ancho debe ser mayor a 0'),
  body('ciudad').notEmpty().withMessage('La ciudad es requerida'),
  body('municipio').notEmpty().withMessage('El municipio es requerido'),
  body('categoria').isIn(['Niños', 'Adultos']).withMessage('Categoría inválida'),
  body('totalProfundidades').isInt({ min: 1 }).withMessage('Debe haber al menos una profundidad'),
  body('profundidades').isArray({ min: 1 }).withMessage('Debe ingresar las profundidades'),
  body('profundidades').custom((arr, { req }) => {
    if (!Array.isArray(arr) || arr.length !== Number(req.body.totalProfundidades)) {
      throw new Error('El número de profundidades debe coincidir con totalProfundidades');
    }
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] <= arr[i - 1]) {
        throw new Error('Las profundidades deben ir en orden ascendente');
      }
    }
    return true;
  }),
  body('forma').isIn(['Rectangular', 'Circular']).withMessage('Forma inválida'),
  body('uso').isIn(['Privada', 'Publica']).withMessage('Uso inválido'),
  body('foto').optional().isString(), // Validación de archivo se hace en middleware de archivos
  body('bombas').isArray({ min: 1 }).withMessage('Debe ingresar al menos una bomba'),
  body('bombas.*.marca').notEmpty().withMessage('La marca de la bomba es requerida'),
  body('bombas.*.referencia').notEmpty().withMessage('La referencia de la bomba es requerida'),
  body('bombas.*.foto').optional().isString(),
  body('bombas.*.potencia').isFloat({ gt: 0 }).withMessage('La potencia debe ser mayor a 0'),
  body('bombas.*.material').isIn(['Sumergible', 'Centrifuga']).withMessage('Material inválido'),
  body('bombas.*.seRepite').isBoolean().withMessage('Debe indicar si la bomba se repite'),
  body('bombas.*.totalBombas').optional().isInt({ min: 1 }),
  body('bombas.*.hojaSeguridad').optional().isString(),
  body('bombas.*.fichaTecnica').optional().isString(),
];

export const piscinaValidationUpdate = [
  body('nombre').optional().notEmpty(),
  body('direccion').optional().notEmpty(),
  body('altura').optional().isFloat({ gt: 0 }),
  body('ancho').optional().isFloat({ gt: 0 }),
  body('ciudad').optional().notEmpty(),
  body('municipio').optional().notEmpty(),
  body('categoria').optional().isIn(['Niños', 'Adultos']),
  body('totalProfundidades').optional().isInt({ min: 1 }),
  body('profundidades').optional().isArray({ min: 1 }),
  body('forma').optional().isIn(['Rectangular', 'Circular']),
  body('uso').optional().isIn(['Privada', 'Publica']),
];
