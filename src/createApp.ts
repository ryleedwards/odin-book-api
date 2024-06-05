import express from 'express';
import cors from 'cors';
import { Prisma, PrismaClient } from '@prisma/client';
import indexRouter from './routes/index';
import errorHandler from './handlers/errors/error';
import prismaErrorHandler from './handlers/errors/prismaError';

export function createApp() {
  const prisma = new PrismaClient();
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use('/', indexRouter);
  app.use(prismaErrorHandler);
  app.use(errorHandler);

  return app;
}
