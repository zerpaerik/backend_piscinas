import { Request, Response } from 'express';
import { User } from '../models/user.model';

// Crear usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Listar usuarios
export const getUsers = async (_req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

// Obtener usuario por ID
import { AuthRequest } from '../middlewares/auth.middleware';
export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    // Si es USER, solo puede ver su propio usuario
    if (req.user?.rol === 'USER' && req.user.id !== req.params.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    console.log('updateUser: id recibido', req.params.id);
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      console.log('updateUser: usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Eliminar usuario
export const deleteUser = async (req: Request, res: Response) => {
  try {
    console.log('deleteUser: id recibido', req.params.id);
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      console.log('deleteUser: usuario no encontrado');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
