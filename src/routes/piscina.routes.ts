import { Router } from 'express';
import * as piscinaController from '../controllers/piscina.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { piscinaValidation, piscinaValidationUpdate } from '../middlewares/validators/piscina.validator';
import { validate } from '../middlewares/validators/validate';
import { uploadPiscina } from '../middlewares/upload.middleware';
import { parsePiscinaArrays } from '../middlewares/parseArrays.middleware';

const router = Router();

// Solo ADMIN puede crear, editar, eliminar
/**
 * @swagger
 * /piscinas:
 *   post:
 *     summary: Crear nueva piscina
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de la piscina
 *                 example: "Piscina Olímpica"
 *               direccion:
 *                 type: string
 *                 description: Dirección física
 *                 example: "Av. Principal 123"
 *               altura:
 *                 type: number
 *                 description: Altura en metros
 *                 example: 2.5
 *               ancho:
 *                 type: number
 *                 description: Ancho en metros
 *                 example: 10
 *               ciudad:
 *                 type: string
 *                 description: Ciudad donde se ubica la piscina
 *                 example: "Bogotá"
 *               municipio:
 *                 type: string
 *                 description: Municipio
 *                 example: "Chapinero"
 *               temperaturaExterna:
 *                 type: number
 *                 description: Temperatura ambiente (opcional)
 *                 example: 22.5
 *               categoria:
 *                 type: string
 *                 enum: [Niños, Adultos]
 *                 description: Categoría de la piscina
 *                 example: "Adultos"
 *               totalProfundidades:
 *                 type: integer
 *                 description: Número total de profundidades
 *                 example: 3
 *               profundidades:
 *                 type: array
 *                 items:
 *                   type: number
 *                   example: 1.2
 *                 description: "Lista de profundidades en metros, orden ascendente. Ejemplo: [1.2, 1.5, 2.0]"
 *                 example: [1.2, 1.5, 2.0]
 *               forma:
 *                 type: string
 *                 enum: [Rectangular, Circular]
 *                 description: Forma de la piscina
 *                 example: "Rectangular"
 *               uso:
 *                 type: string
 *                 enum: [Privada, Publica]
 *                 description: Uso de la piscina
 *                 example: "Publica"
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen principal de la piscina
 *               bombas:
 *                 type: string
 *                 description: |
 *                   String JSON con array de bombas. Cada bomba debe tener:
 *                   - marca: string
 *                   - referencia: string
 *                   - foto: string (URL S3)
 *                   - potencia: number
 *                   - material: string (Sumergible o Centrifuga)
 *                   - seRepite: boolean
 *                   - totalBombas: number (opcional)
 *                   - hojaSeguridad: string (URL S3, PDF)
 *                   - fichaTecnica: string (URL S3, PDF)
 *                   Ejemplo:
 *                   '[{"marca":"Pentair","referencia":"X100","foto":"https://bucket.s3.amazonaws.com/foto.jpg","potencia":2,"material":"Sumergible","seRepite":false,"hojaSeguridad":"https://bucket.s3.amazonaws.com/hoja.pdf","fichaTecnica":"https://bucket.s3.amazonaws.com/ficha.pdf"}]'
 *     responses:
 *       201:
 *         description: Piscina creada exitosamente. Retorna el objeto piscina creado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Piscina'
 *       400:
 *         description: Error de validación de campos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Prohibido (solo ADMIN)
 */
router.post('/',
  authenticate,
  authorizeRoles('ADMIN'),
  uploadPiscina.fields([
    { name: 'foto', maxCount: 1 },
    { name: 'bombas_foto', maxCount: 10 },
    { name: 'bombas_hojaSeguridad', maxCount: 10 },
    { name: 'bombas_fichaTecnica', maxCount: 10 }
  ]),
  parsePiscinaArrays,
  piscinaValidation,
  validate,
  piscinaController.createPiscina
);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), piscinaValidationUpdate, validate, piscinaController.updatePiscina);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), piscinaController.deletePiscina);
// USER y ADMIN pueden ver
/**
 * @swagger
 * /piscinas:
 *   get:
 *     summary: Listar todas las piscinas
 *     tags: [Piscinas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de piscinas
 */
router.get('/', authenticate, authorizeRoles('ADMIN', 'USER'), piscinaController.getPiscinas);
router.get('/:id', authenticate, authorizeRoles('ADMIN', 'USER'), piscinaController.getPiscinaById);

router.post('/debug', (req, res) => {
  process.stdout.write('LLEGA A /api/piscinas/debug\n');
  res.json({ ok: true, files: req.files, body: req.body });
});

export default router;
