import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

import piscinaRoutes from './routes/piscina.routes';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a base de datos

// Rutas
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/piscinas', piscinaRoutes);
app.use('/api/usuarios', userRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'API Piscinas funcionando' });
});

// Middleware global de manejo de errores
import { Request, Response, NextFunction } from 'express';

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('GLOBAL ERROR HANDLER:', err);
  res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
});

export default app;
