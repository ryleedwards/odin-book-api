import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express-serve-static-core';

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
  const allUsers = await prisma.user.findMany();
  res.send(allUsers);
};
