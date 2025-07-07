import { Request, Response, NextFunction } from 'express';

export function parsePiscinaArrays(req: Request, res: Response, next: NextFunction) {
  if (typeof req.body.profundidades === 'string') {
    try {
      req.body.profundidades = JSON.parse(req.body.profundidades);
    } catch (e) {
      // Si falla el parseo, deja el valor original
    }
  }
  if (typeof req.body.bombas === 'string') {
    try {
      req.body.bombas = JSON.parse(req.body.bombas);
    } catch (e) {
      // Si falla el parseo, deja el valor original
    }
  }
  next();
}
