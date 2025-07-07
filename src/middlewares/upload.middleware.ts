import multer from 'multer';

const storage = multer.memoryStorage();

// console.log('MULTER CONFIGURADO');
export const uploadPiscina = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB por archivo
  fileFilter: (req, file, cb) => {
    // console.log('MULTER fileFilter:', file.fieldname, file.mimetype);
    if (file.fieldname === 'foto') {
      // Solo imágenes
      if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
        return cb(new Error('Solo se permiten imágenes PNG/JPEG para foto'));
      }
    } else if (file.fieldname.startsWith('bombas[') && file.fieldname.endsWith('][foto]')) {
      if (!['image/png', 'image/jpeg'].includes(file.mimetype)) {
        return cb(new Error('Solo se permiten imágenes PNG/JPEG para foto de bomba'));
      }
    } else if (file.fieldname.endsWith('hojaSeguridad') || file.fieldname.endsWith('fichaTecnica')) {
      if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Solo se permiten archivos PDF para hoja de seguridad y ficha técnica'));
      }
    }
    cb(null, true);
  },
});
