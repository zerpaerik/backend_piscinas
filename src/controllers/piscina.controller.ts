import { Request, Response } from 'express';
import { Piscina } from '../models/piscina.model';
import { uploadFileToS3 } from '../utils/s3';

// Crear piscina
export const createPiscina = async (req: Request, res: Response) => {
  process.stdout.write('ENTRANDO AL CONTROLADOR PISCINA\n');
  // console.log('BODY:', req.body);
  // console.log('FILES:', req.files);
  try {
    require('fs').appendFileSync('debug.txt', 'LOG INICIAL: Entrando a createPiscina\n');
  } catch (e) {
    process.stdout.write('No se pudo escribir en debug.txt: ' + String(e) + '\n');
  }
  try {
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Subir foto de piscina
    let fotoPiscinaUrl = '';
    if (files && files['foto'] && files['foto'][0]) {
      fotoPiscinaUrl = await uploadFileToS3(files['foto'][0], 'piscinas/fotos');
    }

    // Procesar bombas y subir archivos asociados
    let bombas = [];
    if (req.body.bombas) {
      // Puede venir como string si es multipart
      const bombasArr = typeof req.body.bombas === 'string' ? JSON.parse(req.body.bombas) : req.body.bombas;
      bombas = await Promise.all(bombasArr.map(async (bomba: any, idx: number) => {
        let fotoBombaUrl = '';
        let hojaSeguridadUrl = '';
        let fichaTecnicaUrl = '';
        if (idx === 0) {
          // Para la primera bomba, asocia los archivos planos
          if (files['bombas_foto'] && files['bombas_foto'][0]) {
            fotoBombaUrl = await uploadFileToS3(files['bombas_foto'][0], 'piscinas/bombas/fotos');
          }
          if (files['bombas_hojaSeguridad'] && files['bombas_hojaSeguridad'][0]) {
            hojaSeguridadUrl = await uploadFileToS3(files['bombas_hojaSeguridad'][0], 'piscinas/bombas/hojas');
          }
          if (files['bombas_fichaTecnica'] && files['bombas_fichaTecnica'][0]) {
            fichaTecnicaUrl = await uploadFileToS3(files['bombas_fichaTecnica'][0], 'piscinas/bombas/fichas');
          }
        }
        return {
          ...bomba,
          foto: fotoBombaUrl,
          hojaSeguridad: hojaSeguridadUrl,
          fichaTecnica: fichaTecnicaUrl,
        };
      }));
    }

    // LOGS FORZADOS PARA DEPURACIÓN
    process.stdout.write('// LOG FORZADO: req.body recibido: ' + JSON.stringify(req.body) + '\n');
    process.stdout.write('// LOG FORZADO: fotoPiscinaUrl: ' + fotoPiscinaUrl + '\n');
    process.stdout.write('// LOG FORZADO: bombas: ' + JSON.stringify(bombas) + '\n');
    try {
      require('fs').appendFileSync('debug.txt', 'DEBUG req.body: ' + JSON.stringify(req.body) + '\n');
      require('fs').appendFileSync('debug.txt', 'DEBUG fotoPiscinaUrl: ' + fotoPiscinaUrl + '\n');
      require('fs').appendFileSync('debug.txt', 'DEBUG bombas: ' + JSON.stringify(bombas) + '\n');
    } catch (e) {
      process.stdout.write('No se pudo escribir en debug.txt: ' + String(e) + '\n');
    }

    // Conversión de campos numéricos y arrays
    const piscina = new Piscina({
      ...req.body,
      foto: fotoPiscinaUrl,
      bombas,
      altura: Number(req.body.altura),
      ancho: Number(req.body.ancho),
      totalProfundidades: Number(req.body.totalProfundidades),
      temperaturaExterna: req.body.temperaturaExterna ? Number(req.body.temperaturaExterna) : undefined,
      profundidades: Array.isArray(req.body.profundidades)
        ? req.body.profundidades.map(Number)
        : (typeof req.body.profundidades === 'string' ? JSON.parse(req.body.profundidades).map(Number) : []),
    });
    // console.log('LOG: Objeto piscina a guardar:', piscina);
    await piscina.save();
    // console.log('LOG: Piscina guardada exitosamente');
    res.status(201).json({ piscina });
  } catch (error) {
    // Log detallado y forzado para depuración de tests
    console.error('ERROR DETALLADO [createPiscina]:', error);
    if (error instanceof Error) {
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error('Error como string:', String(error));
      console.error('Error como objeto:', JSON.stringify(error));
    }
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }

};

// Listar piscinas
export const getPiscinas = async (_req: Request, res: Response) => {
  const piscinas = await Piscina.find();
  res.json(piscinas);
};

// Obtener piscina por ID
export const getPiscinaById = async (req: Request, res: Response) => {
  try {
    const piscina = await Piscina.findById(req.params.id);
    if (!piscina) return res.status(404).json({ error: 'Piscina no encontrada' });
    res.json({ piscina });
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
};

// Actualizar piscina
export const updatePiscina = async (req: Request, res: Response) => {
  try {
    const piscina = await Piscina.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!piscina) return res.status(404).json({ error: 'Piscina no encontrada' });
    res.json({ piscina });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Eliminar piscina
export const deletePiscina = async (req: Request, res: Response) => {
  try {
    const piscina = await Piscina.findByIdAndDelete(req.params.id);
    if (!piscina) return res.status(404).json({ error: 'Piscina no encontrada' });
    res.json({ message: 'Piscina eliminada' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
