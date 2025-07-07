import request from 'supertest';
import app from '../app';
import { User } from '../models/user.model';

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test',
        cedula: '123456',
        email: 'test@example.com',
        password: 'password123',
        rol: 'USER',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        nombre: 'Test',
        cedula: '123456',
        email: 'test2@example.com',
        password: 'password123',
        rol: 'USER',
      });
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test2@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
