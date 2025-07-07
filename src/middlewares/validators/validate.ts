import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('VALIDATION ERRORS:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
