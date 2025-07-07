import app from './app';
import dotenv from 'dotenv';
import { connectDB } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});
