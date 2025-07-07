import request from 'supertest';
import app from '../app';
import { User } from '../models/user.model';

describe('User Endpoints', () => {
  let adminToken: string;
  let userId: string;

  beforeAll(async () => {
    // Crea un admin y obtiene el token
    await User.deleteMany({});
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Admin',
        cedula: '999999',
        email: 'admin@example.com',
        password: 'adminpass',
        rol: 'ADMIN',
      });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'adminpass',
      });
    adminToken = res.body.token;
  });

  it('should create a new user as ADMIN', async () => {
    const res = await request(app)
      .post('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'UserTest',
        cedula: '111111',
        email: 'user@test.com',
        password: 'usertest',
        rol: 'USER',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('user@test.com');
    userId = res.body.user._id;
  });

  it('should get all users as ADMIN', async () => {
    const res = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should update a user as ADMIN', async () => {
    const res = await request(app)
      .put(`/api/usuarios/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ nombre: 'UserUpdated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.nombre).toBe('UserUpdated');
  });

  it('should delete a user as ADMIN', async () => {
    const res = await request(app)
      .delete(`/api/usuarios/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/eliminado/i);
  });
});
