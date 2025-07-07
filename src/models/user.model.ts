import { Schema, model, Document } from 'mongoose';

export type Rol = 'ADMIN' | 'USER';

export interface IUser extends Document {
  nombre: string;
  apellido?: string;
  cedula: string;
  email: string;
  password: string;
  rol: Rol;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
  nombre: { type: String, required: true },
  apellido: { type: String },
  cedula: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['ADMIN', 'USER'], required: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true,
});

export const User = model<IUser>('User', userSchema);
