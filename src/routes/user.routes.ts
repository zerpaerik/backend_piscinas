import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { userValidation, userValidationUpdate } from '../middlewares/validators/user.validator';
import { validate } from '../middlewares/validators/validate';

const router = Router();

// Solo ADMIN puede crear, editar, eliminar y ver todos
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear usuario (solo ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, cedula, email, password, rol]
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               cedula:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', authenticate, authorizeRoles('ADMIN'), userValidation, validate, userController.createUser);
/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar todos los usuarios (solo ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de usuarios
 */
router.get('/', authenticate, authorizeRoles('ADMIN'), userController.getUsers);
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar usuario (solo ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               cedula:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, USER]
 *     responses:
 *       200:
 *         description: Usuario actualizado
 */
router.put('/:id', authenticate, authorizeRoles('ADMIN'), userValidationUpdate, validate, userController.updateUser);
/**
 * @swagger
 * /usuarios/{id}:
 *   delete:
 *     summary: Eliminar usuario (solo ADMIN)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado
 */
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), userController.deleteUser);
// USER puede ver solo su propio usuario
/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID (ADMIN o el propio USER)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/:id', authenticate, authorizeRoles('ADMIN', 'USER'), userController.getUserById);

export default router;
