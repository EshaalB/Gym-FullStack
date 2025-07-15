const request = require('supertest');
const express = require('express');
const userController = require('../userController');

jest.mock('../../utils/database', () => ({
  executeQuery: jest.fn(),
  executeSingleQuery: jest.fn(),
  sql: { Int: 'Int', VarChar: 'VarChar', Date: 'Date', Bit: 'Bit' },
}));
const { executeQuery, executeSingleQuery } = require('../../utils/database');

describe('User Controller', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.get('/api/users', userController.getAllUsers);
    app.get('/api/users/:userId', userController.getUserById);
    app.post('/api/users', userController.createUser);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return users for GET /api/users', async () => {
    executeQuery.mockResolvedValueOnce([{ userId: 1, fName: 'Test', email: 'test@example.com' }]);
    executeSingleQuery.mockResolvedValueOnce({ total: 1 });
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.users).toBeDefined();
    expect(res.body.pagination).toBeDefined();
  });

  it('should return 404 for GET /api/users/:userId if not found', async () => {
    executeSingleQuery.mockResolvedValueOnce(null);
    const res = await request(app).get('/api/users/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.error).toMatch(/not found/i);
  });

  it('should return 400 for POST /api/users with missing fields', async () => {
    const res = await request(app).post('/api/users').send({ email: 'test@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/all fields are required/i);
  });
}); 