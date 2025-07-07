import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import * as crypto from 'crypto';
import { sendMail } from '../utils/mailer';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora
    await user.save();
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${email}`;
    await sendMail(email, 'Recuperación de contraseña', `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña.</p>`);
    res.json({ message: 'Email enviado para recuperación de contraseña' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email, resetPasswordToken: token, resetPasswordExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ error: 'Token inválido o expirado' });
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nombre, apellido, cedula, email, password, rol } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ nombre, apellido, cedula, email, password: hashedPassword, rol });
    await user.save();
    res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Credenciales inválidas' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Credenciales inválidas' });
    const token = jwt.sign({ id: user._id, rol: user.rol }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user._id, nombre: user.nombre, rol: user.rol } });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
