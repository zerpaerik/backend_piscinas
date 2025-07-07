import request from 'supertest';
import app from '../app';
jest.mock('../utils/s3', () => require('./__mocks__/s3'));

import { User } from '../models/user.model';

describe('Piscina Endpoints', () => {
  let adminToken: string;
  let piscinaId: string;

  beforeAll(async () => {
    await User.deleteMany({});
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Admin',
        cedula: '999999',
        email: 'adminpiscina@example.com',
        password: 'adminpass',
        rol: 'ADMIN',
      });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'adminpiscina@example.com',
        password: 'adminpass',
      });
    adminToken = res.body.token;
  });

  beforeEach(async () => {
    // Limpia piscinas antes de cada test dependiente
    await request(app)
      .delete('/api/piscinas/all') // Si tienes endpoint de borrado masivo, si no, usa Piscina.deleteMany({})
      .set('Authorization', `Bearer ${adminToken}`)
      .catch(() => {});
    const res = await request(app)
      .post('/api/piscinas')
      .set('Authorization', `Bearer ${adminToken}`)
      .field('nombre', 'Piscina Test')
      .field('direccion', 'Calle 123')
      .field('altura', 1.5)
      .field('ancho', 3)
      .field('ciudad', 'CiudadX')
      .field('municipio', 'MunicipioX')
      .field('temperaturaExterna', 25)
      .field('categoria', 'Niños')
      .field('totalProfundidades', 2)
      .field('profundidades', JSON.stringify([1,2]))
      .field('forma', 'Rectangular')
      .field('uso', 'Privada')
      .field('bombas', JSON.stringify([
        {
          marca: 'MarcaTest',
          referencia: 'RefTest',
          potencia: 1.5,
          material: 'Sumergible',
          seRepite: false,
          foto: '',
          hojaSeguridad: '',
          fichaTecnica: ''
        }
      ]))
      .attach('foto', Buffer.from('test'), 'foto.png')
      .attach('bombas_foto', Buffer.from('test'), 'bomba.png')
      .attach('bombas_hojaSeguridad', Buffer.from('pdf'), 'hoja.pdf')
      .attach('bombas_fichaTecnica', Buffer.from('pdf'), 'ficha.pdf');
    piscinaId = res.body.piscina._id;
  });

  it('should create a new piscina as ADMIN', async () => {
    // Solo verifica creación, no crea otra piscina
    const res = await request(app)
      .get(`/api/piscinas/${piscinaId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.piscina.nombre).toBe('Piscina Test');
  });

  it('should get all piscinas as ADMIN', async () => {
    const res = await request(app)
      .get('/api/piscinas')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a piscina as ADMIN', async () => {
    const res = await request(app)
      .put(`/api/piscinas/${piscinaId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'Piscina Actualizada' });
    expect(res.statusCode).toBe(200);
    expect(res.body.piscina.nombre).toBe('Piscina Actualizada');
  });

  it('should delete a piscina as ADMIN', async () => {
    const res = await request(app)
      .delete(`/api/piscinas/${piscinaId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminada/i);
  });
});

describe('Debug Piscina', () => {
    it('debug direct post', async () => {
      const res = await request(app)
        .post('/api/piscinas/debug')
        .attach('foto', Buffer.from('test'), 'foto.png')
        .attach('bombas[].foto', Buffer.from('test'), 'bomba.png')
        .attach('bombas[].hojaSeguridad', Buffer.from('pdf'), 'hoja.pdf')
        .attach('bombas[].fichaTecnica', Buffer.from('pdf'), 'ficha.pdf')
        .field('nombre', 'Piscina Test');
      expect(res.body.ok).toBe(true);
      // Imprime el body y files para inspección
      console.log('DEBUG /api/piscinas/debug:', res.body);
    });
  });