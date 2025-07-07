import { Schema, model, Document, Types } from 'mongoose';

export interface IBomba {
  marca: string;
  referencia: string;
  foto: string; // URL S3
  potencia: number;
  material: 'Sumergible' | 'Centrifuga';
  seRepite: boolean;
  totalBombas?: number;
  hojaSeguridad: string; // URL S3 (PDF)
  fichaTecnica: string; // URL S3 (PDF)
}

export interface IPiscina extends Document {
  nombre: string;
  direccion: string;
  altura: number;
  ancho: number;
  ciudad: string;
  municipio: string;
  temperaturaExterna?: number;
  categoria: 'Niños' | 'Adultos';
  totalProfundidades: number;
  profundidades: number[]; // Orden ascendente
  forma: 'Rectangular' | 'Circular';
  uso: 'Privada' | 'Publica';
  foto: string; // URL S3
  bombas: IBomba[];
  createdAt?: Date;
  updatedAt?: Date;
}

const bombaSchema = new Schema<IBomba>({
  marca: { type: String, required: true },
  referencia: { type: String, required: true },
  foto: { type: String, required: true },
  potencia: { type: Number, required: true },
  material: { type: String, enum: ['Sumergible', 'Centrifuga'], required: true },
  seRepite: { type: Boolean, required: true },
  totalBombas: { type: Number, required: false },
  hojaSeguridad: { type: String, required: true },
  fichaTecnica: { type: String, required: true },
});

const piscinaSchema = new Schema<IPiscina>({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  altura: { type: Number, required: true },
  ancho: { type: Number, required: true },
  ciudad: { type: String, required: true },
  municipio: { type: String, required: true },
  temperaturaExterna: { type: Number },
  categoria: { type: String, enum: ['Niños', 'Adultos'], required: true },
  totalProfundidades: { type: Number, required: true },
  profundidades: {
    type: [Number],
    required: true,
    validate: {
      validator: function (arr: number[]) {
        return arr.length > 0 && arr.every((v, i, a) => i === 0 || a[i - 1] < v);
      },
      message: 'Las profundidades deben ir en orden ascendente y no pueden estar vacías.',
    },
  },
  forma: { type: String, enum: ['Rectangular', 'Circular'], required: true },
  uso: { type: String, enum: ['Privada', 'Publica'], required: true },
  foto: { type: String, required: true },
  bombas: { type: [bombaSchema], required: true },
}, {
  timestamps: true,
});

export const Piscina = model<IPiscina>('Piscina', piscinaSchema);
