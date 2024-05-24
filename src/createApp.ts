import express from 'express';
import { Prisma, PrismaClient } from '@prisma/client';

export function createApp() {
  const prisma = new PrismaClient();
  const app = express();

  app.use(express.json());

  // FUTURE ROUTES

  return app;
}
