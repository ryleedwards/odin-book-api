import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import usersRouter from './routes/users';

export function createApp() {
  const prisma = new PrismaClient();
  const app = express();

  app.use(express.json());

  // ROUTES

  app.use('/api/users', usersRouter);

  return app;
}
