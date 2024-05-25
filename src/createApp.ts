import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import indexRouter from './routes/index';

export function createApp() {
  const prisma = new PrismaClient();
  const app = express();

  app.use(express.json());

  app.use('/', indexRouter);

  return app;
}
