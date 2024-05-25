import request from 'supertest';
import { Express } from 'express-serve-static-core';
import { createApp } from '../createApp';
import { User } from '../types/response';

describe('getUsers', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it('should return an array of users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    const users = response.body as User[];
    expect(users.length).toBeGreaterThan(0);
  });
});
