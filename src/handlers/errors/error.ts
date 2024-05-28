import { Request, Response, NextFunction } from 'express-serve-static-core';

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ error: err.message });
};

export default errorHandler;
