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
 *               direccion:
 *                 type: string
 *               altura:
 *                 type: number
 *               ancho:
 *                 type: number
 *               ciudad:
 *                 type: string
 *               municipio:
 *                 type: string
 *               temperaturaExterna:
 *                 type: number
 *               categoria:
 *                 type: string
 *                 enum: [Niños, Adultos]
 *               totalProfundidades:
 *                 type: integer
 *               profundidades:
 *                 type: array
 *                 items:
 *                   type: number
 *               forma:
 *                 type: string
 *                 enum: [Rectangular, Circular]
 *               uso:
 *                 type: string
 *                 enum: [Privada, Publica]
 *               foto:
 *                 type: string
 *                 format: binary
 *               bombas:
 *                 type: string
 *                 description: JSON string array con datos de bombas
 *     responses:
 *       201:
 *         description: Piscina creada
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
