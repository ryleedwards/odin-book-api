import { Request, Response, NextFunction } from 'express-serve-static-core';
import { Prisma } from '@prisma/client';

const prismaErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: `${err.meta?.target} already exists`,
      });
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: err.meta?.cause,
      });
    }
    res
      .status(400)
      .json({ code: err.code, meta: err.meta, error: err.message });
  }
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({ error: 'Validation error' });
  }
};

export default prismaErrorHandler;
